/**
 * VOID CLAIM — SpacetimeDB Server Module (v2 — Hybrid Authority)
 * 
 * Server-authoritative combat, seeded asteroids, projectile sync.
 * Tables: players, kill_feed, chat, leaderboard, world_state, projectiles
 * Reducers: player CRUD, deal_damage, fire_projectile, world seed, chat, leaderboard
 */

import { schema, table, t } from 'spacetimedb/server';

// ═══════════════════════════════════════════
// Schema — all tables defined inline
// ═══════════════════════════════════════════

const spacetimedb = schema({
  player: table(
    { public: true },
    {
      identity:    t.identity().primaryKey(),
      name:        t.string(),
      x:           t.f32(),
      y:           t.f32(),
      angle:       t.f32(),
      ship:        t.string(),
      color:       t.string(),
      hp:          t.f32(),
      max_hp:      t.f32(),
      shield:      t.f32(),
      max_shield:  t.f32(),
      cargo_used:  t.u32(),
      dead:        t.bool(),
      cloaked:     t.bool(),
      bounty:      t.bool(),
      kills:       t.u32(),
      earned:      t.u64(),
      last_update: t.u64(),
      vx:          t.f32(),  // velocity for dead-reckoning (added at end)
      vy:          t.f32(),
    }
  ),

  // Server-managed projectiles for cross-client visibility
  projectile: table(
    { public: true },
    {
      id:         t.u64().primaryKey().autoInc(),
      owner_id:   t.string(),    // hex identity of shooter
      owner_name: t.string(),
      x:          t.f32(),
      y:          t.f32(),
      vx:         t.f32(),
      vy:         t.f32(),
      dmg:        t.f32(),
      color:      t.string(),
      is_player:  t.bool(),      // was fired by a human player
      spawned_at: t.u64(),       // ms timestamp
      ttl_ms:     t.u32(),       // lifetime in ms
    }
  ),

  // Shared world seed for deterministic asteroid generation
  world_state: table(
    { public: true },
    {
      id:         t.u32().primaryKey(),   // always 0 (singleton)
      world_seed: t.u64(),
    }
  ),

  kill_event: table(
    { public: true },
    {
      id:        t.u64().primaryKey().autoInc(),
      killer:    t.string(),
      victim:    t.string(),
      timestamp: t.u64(),
    }
  ),

  chat_message: table(
    { public: true },
    {
      id:        t.u64().primaryKey().autoInc(),
      sender:    t.string(),
      text:      t.string(),
      timestamp: t.u64(),
    }
  ),

  leaderboard_entry: table(
    { public: true },
    {
      id:        t.u64().primaryKey().autoInc(),
      name:      t.string(),
      credits:   t.u64(),
      kills:     t.u32(),
      mined:     t.u64(),
      ship:      t.string(),
      color:     t.string(),
      timestamp: t.u64(),
    }
  ),
});

export default spacetimedb;

// ═══════════════════════════════════════════
// Lifecycle hooks
// ═══════════════════════════════════════════

export const client_connected = spacetimedb.reducer(
  (ctx) => {
    console.log(`Client connected: ${ctx.sender.toHexString()}`);
    // Ensure world seed exists (singleton row id=0)
    const ws = ctx.db.world_state.id.find(0);
    if (!ws) {
      // First client ever — generate a random world seed
      const seed = BigInt(Math.floor(Math.random() * 2147483647));
      ctx.db.world_state.insert({ id: 0, world_seed: seed });
      console.log(`World seed initialized: ${seed}`);
    }
  }
);

export const client_disconnected = spacetimedb.reducer(
  (ctx) => {
    const existing = ctx.db.player.identity.find(ctx.sender);
    if (existing) {
      ctx.db.player.identity.delete(ctx.sender);
      console.log(`Player left: ${existing.name}`);
    }
  }
);

// ═══════════════════════════════════════════
// Reducers — Player Management
// ═══════════════════════════════════════════

export const join_game = spacetimedb.reducer(
  {
    name: t.string(),
    ship: t.string(),
    color: t.string(),
    max_hp: t.f32(),
    max_shield: t.f32(),
  },
  (ctx, args) => {
    const existing = ctx.db.player.identity.find(ctx.sender);
    if (existing) {
      ctx.db.player.identity.delete(ctx.sender);
    }

    ctx.db.player.insert({
      identity:    ctx.sender,
      name:        args.name,
      x:           0,
      y:           -280,
      vx:          0,
      vy:          0,
      angle:       0,
      ship:        args.ship,
      color:       args.color,
      hp:          args.max_hp,
      max_hp:      args.max_hp,
      shield:      args.max_shield,
      max_shield:  args.max_shield,
      cargo_used:  0,
      dead:        false,
      cloaked:     false,
      bounty:      false,
      kills:       0,
      earned:      BigInt(0),
      last_update: BigInt(Date.now()),
    });

    console.log(`${args.name} joined in a ${args.ship}`);
  }
);

// update_player — now clients only send position/movement/cosmetic state.
// HP and shield are SERVER-OWNED and cannot be overwritten by the client.
export const update_player = spacetimedb.reducer(
  {
    x: t.f32(),
    y: t.f32(),
    vx: t.f32(),
    vy: t.f32(),
    angle: t.f32(),
    cargo_used: t.u32(),
    dead: t.bool(),
    cloaked: t.bool(),
    bounty: t.bool(),
    kills: t.u32(),
    earned: t.u64(),
    ship: t.string(),
    color: t.string(),
    max_hp: t.f32(),
    max_shield: t.f32(),
  },
  (ctx, args) => {
    const existing = ctx.db.player.identity.find(ctx.sender);
    if (!existing) return;

    ctx.db.player.identity.update({
      ...existing,
      x:           args.x,
      y:           args.y,
      vx:          args.vx,
      vy:          args.vy,
      angle:       args.angle,
      // HP & shield are NOT taken from client — server keeps its own values
      // But we DO allow max_hp/max_shield updates (from upgrades)
      max_hp:      args.max_hp,
      max_shield:  args.max_shield,
      cargo_used:  args.cargo_used,
      dead:        args.dead,
      cloaked:     args.cloaked,
      bounty:      args.bounty,
      kills:       args.kills,
      earned:      args.earned,
      ship:        args.ship,
      color:       args.color,
      last_update: BigInt(Date.now()),
    });
  }
);

export const leave_game = spacetimedb.reducer(
  (ctx) => {
    const existing = ctx.db.player.identity.find(ctx.sender);
    if (existing) {
      ctx.db.player.identity.delete(ctx.sender);
    }
  }
);

// ═══════════════════════════════════════════
// Reducers — Server-Authoritative Combat
// ═══════════════════════════════════════════

// deal_damage — THE core authority reducer.
// Only the server processes HP changes. Clients call this when their
// local projectile simulation detects a hit on a remote player.
export const deal_damage = spacetimedb.reducer(
  {
    victim_identity_hex: t.string(),
    damage: t.f32(),
    attacker_name: t.string(),
  },
  (ctx, args) => {
    // Find victim by hex identity string
    let victim = null;
    for (const p of ctx.db.player.iter()) {
      if (p.identity.toHexString() === args.victim_identity_hex) {
        victim = p;
        break;
      }
    }
    if (!victim || victim.dead) return;

    // Shield absorption (70% of damage absorbed by shield)
    let dmg = args.damage;
    let newShield = victim.shield;
    let newHp = victim.hp;

    if (newShield > 0) {
      const shieldAbsorb = Math.min(newShield, dmg * 0.7);
      newShield -= shieldAbsorb;
      dmg -= shieldAbsorb;
    }
    newHp -= dmg;

    if (newHp <= 0) {
      // Player is dead
      ctx.db.player.identity.update({
        ...victim,
        hp: 0,
        shield: 0,
        dead: true,
        last_update: BigInt(Date.now()),
      });

      // Record kill event
      ctx.db.kill_event.insert({
        id: BigInt(0),
        killer: args.attacker_name,
        victim: victim.name,
        timestamp: BigInt(Date.now()),
      });

      console.log(`${args.attacker_name} destroyed ${victim.name}`);
    } else {
      // Apply damage
      ctx.db.player.identity.update({
        ...victim,
        hp: newHp,
        shield: Math.max(0, newShield),
        last_update: BigInt(Date.now()),
      });
    }
  }
);

// heal_player — for Earth shield zone healing
export const heal_player = spacetimedb.reducer(
  {
    heal_hp: t.f32(),
    heal_shield: t.f32(),
  },
  (ctx, args) => {
    const p = ctx.db.player.identity.find(ctx.sender);
    if (!p || p.dead) return;

    ctx.db.player.identity.update({
      ...p,
      hp: Math.min(p.max_hp, p.hp + args.heal_hp),
      shield: Math.min(p.max_shield, p.shield + args.heal_shield),
      last_update: BigInt(Date.now()),
    });
  }
);

// respawn_player — reset HP/shield on respawn
export const respawn_player = spacetimedb.reducer(
  (ctx) => {
    const p = ctx.db.player.identity.find(ctx.sender);
    if (!p) return;

    ctx.db.player.identity.update({
      ...p,
      hp: p.max_hp,
      shield: p.max_shield,
      dead: false,
      x: 0,
      y: -280,
      vx: 0,
      vy: 0,
      last_update: BigInt(Date.now()),
    });
  }
);

// fire_projectile — broadcast a bullet to all clients
export const fire_projectile = spacetimedb.reducer(
  {
    x: t.f32(),
    y: t.f32(),
    vx: t.f32(),
    vy: t.f32(),
    dmg: t.f32(),
    color: t.string(),
    ttl_ms: t.u32(),
  },
  (ctx, args) => {
    const p = ctx.db.player.identity.find(ctx.sender);
    if (!p || p.dead) return;

    ctx.db.projectile.insert({
      id: BigInt(0),
      owner_id: ctx.sender.toHexString(),
      owner_name: p.name,
      x: args.x,
      y: args.y,
      vx: args.vx,
      vy: args.vy,
      dmg: args.dmg,
      color: args.color,
      is_player: true,
      spawned_at: BigInt(Date.now()),
      ttl_ms: args.ttl_ms,
    });
  }
);

// prune_projectiles — clean up expired projectiles
export const prune_projectiles = spacetimedb.reducer(
  (ctx) => {
    const now = BigInt(Date.now());
    for (const proj of ctx.db.projectile.iter()) {
      const age = Number(now - proj.spawned_at);
      if (age > proj.ttl_ms) {
        ctx.db.projectile.id.delete(proj.id);
      }
    }
  }
);

// ═══════════════════════════════════════════
// Reducers — Combat Events
// ═══════════════════════════════════════════

export const report_kill = spacetimedb.reducer(
  {
    killer_name: t.string(),
    victim_name: t.string(),
  },
  (ctx, args) => {
    ctx.db.kill_event.insert({
      id:        BigInt(0),
      killer:    args.killer_name,
      victim:    args.victim_name,
      timestamp: BigInt(Date.now()),
    });
  }
);

// ═══════════════════════════════════════════
// Reducers — Chat
// ═══════════════════════════════════════════

export const send_chat = spacetimedb.reducer(
  {
    sender_name: t.string(),
    text: t.string(),
  },
  (ctx, args) => {
    const trimmed = args.text.trim().substring(0, 200);
    if (!trimmed) return;

    ctx.db.chat_message.insert({
      id:        BigInt(0),
      sender:    args.sender_name,
      text:      trimmed,
      timestamp: BigInt(Date.now()),
    });
  }
);

// ═══════════════════════════════════════════
// Reducers — Leaderboard
// ═══════════════════════════════════════════

export const submit_score = spacetimedb.reducer(
  {
    name: t.string(),
    credits: t.u64(),
    kills: t.u32(),
    mined: t.u64(),
    ship: t.string(),
    color: t.string(),
  },
  (ctx, args) => {
    let found = false;
    for (const entry of ctx.db.leaderboard_entry.iter()) {
      if (entry.name === args.name) {
        if (args.credits > entry.credits) {
          ctx.db.leaderboard_entry.id.update({
            ...entry,
            credits:   args.credits,
            kills:     args.kills,
            mined:     args.mined,
            ship:      args.ship,
            color:     args.color,
            timestamp: BigInt(Date.now()),
          });
        }
        found = true;
        break;
      }
    }

    if (!found) {
      ctx.db.leaderboard_entry.insert({
        id:        BigInt(0),
        name:      args.name,
        credits:   args.credits,
        kills:     args.kills,
        mined:     args.mined,
        ship:      args.ship,
        color:     args.color,
        timestamp: BigInt(Date.now()),
      });
    }
  }
);

export const prune_events = spacetimedb.reducer(
  (ctx) => {
    const fiveMinAgo = BigInt(Date.now() - 5 * 60 * 1000);
    for (const ev of ctx.db.kill_event.iter()) {
      if (ev.timestamp < fiveMinAgo) {
        ctx.db.kill_event.id.delete(ev.id);
      }
    }

    const tenMinAgo = BigInt(Date.now() - 10 * 60 * 1000);
    for (const msg of ctx.db.chat_message.iter()) {
      if (msg.timestamp < tenMinAgo) {
        ctx.db.chat_message.id.delete(msg.id);
      }
    }
  }
);
