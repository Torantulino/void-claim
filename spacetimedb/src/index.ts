/**
 * VOID CLAIM — SpacetimeDB Server Module (v3 — Hybrid Authority + Server-Synced NPCs)
 * 
 * Server-authoritative combat, seeded asteroids, projectile sync, NPC host-authority.
 * Tables: players, kill_feed, chat, leaderboard, world_state, projectiles, npc, npc_host
 * Reducers: player CRUD, deal_damage, fire_projectile, world seed, chat, leaderboard,
 *           claim_npc_host, update_npcs_batch, damage_npc, respawn_npc
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

  // ── NPC Host-Authority Tables ──
  // One client runs NPC AI and syncs state here; others just render from this table
  npc: table(
    { public: true },
    {
      id:          t.u32().primaryKey(),   // NPC index 0..NPC_COUNT-1
      name:        t.string(),
      x:           t.f32(),
      y:           t.f32(),
      vx:          t.f32(),
      vy:          t.f32(),
      angle:       t.f32(),
      ship:        t.string(),
      color:       t.string(),
      personality: t.string(),             // 'miner' or 'pirate'
      state:       t.string(),             // 'idle','mine','attack','flee','return','sell','wander'
      hp:          t.f32(),
      max_hp:      t.f32(),
      shield:      t.f32(),
      max_shield:  t.f32(),
      dead:        t.bool(),
      cargo_used:  t.u32(),
      total_kills: t.u32(),
      total_mined: t.u32(),
      total_earned:t.u32(),
      stun_timer:  t.f32(),
      last_update: t.u64(),
    }
  ),

  // Singleton: which client is the NPC host
  npc_host: table(
    { public: true },
    {
      id:              t.u32().primaryKey(),   // always 0 (singleton)
      host_identity:   t.string(),             // hex identity of the host client
      claimed_at:      t.u64(),
    }
  ),
});

export default spacetimedb;

// ═══════════════════════════════════════════
// Lifecycle hooks — use spacetimedb.clientConnected/clientDisconnected
// (NOT spacetimedb.reducer — that creates a regular reducer, not a lifecycle hook!)
// ═══════════════════════════════════════════

// Helper: generate a seed from identity hex string (deterministic, no Math.random)
function seedFromIdentity(hexStr: string): bigint {
  let hash = 0;
  for (let i = 0; i < hexStr.length; i++) {
    const ch = hexStr.charCodeAt(i);
    hash = ((hash << 5) - hash + ch) | 0;
  }
  return BigInt(Math.abs(hash) || 42);
}

// init runs once when the module is first published (or after --delete-data)
spacetimedb.init(
  (ctx) => {
    // Generate world seed using owner identity (deterministic)
    const seed = seedFromIdentity(ctx.sender.toHexString());
    ctx.db.world_state.insert({ id: 0, world_seed: seed });
    console.log(`World initialized with seed: ${seed}`);
  }
);

spacetimedb.clientConnected(
  (ctx) => {
    console.log(`Client connected: ${ctx.sender.toHexString()}`);
    // Ensure world seed exists (safety net — init should have created it)
    const ws = ctx.db.world_state.id.find(0);
    if (!ws) {
      const seed = seedFromIdentity(ctx.sender.toHexString());
      ctx.db.world_state.insert({ id: 0, world_seed: seed });
      console.log(`World seed initialized (fallback): ${seed}`);
    }
  }
);

spacetimedb.clientDisconnected(
  (ctx) => {
    const existing = ctx.db.player.identity.find(ctx.sender);
    if (existing) {
      ctx.db.player.identity.delete(ctx.sender);
      console.log(`Player left: ${existing.name}`);
    }
    // If this was the NPC host, clear the host claim so another client can take over
    const host = ctx.db.npc_host.id.find(0);
    if (host && host.host_identity === ctx.sender.toHexString()) {
      ctx.db.npc_host.id.delete(0);
      console.log(`NPC host disconnected: ${ctx.sender.toHexString().slice(0,8)} — host slot open`);
    }
  }
);

// seed_world — callable fallback in case init/clientConnected didn't seed
export const seed_world = spacetimedb.reducer(
  (ctx) => {
    const ws = ctx.db.world_state.id.find(0);
    if (!ws) {
      const seed = seedFromIdentity(ctx.sender.toHexString());
      ctx.db.world_state.insert({ id: 0, world_seed: seed });
      console.log(`World seeded by client: ${seed}`);
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

    // Post-respawn invulnerability is handled client-side (2s invulnTimer).
    // The client won't call dealDamage during that window, so no server check needed.

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

// ═══════════════════════════════════════════
// Reducers — NPC Host-Authority System
// ═══════════════════════════════════════════
// One client runs NPC AI locally and pushes state updates here.
// All other clients read from the npc table and just render.

// claim_npc_host — first caller wins; if existing host disconnected, anyone can reclaim
export const claim_npc_host = spacetimedb.reducer(
  (ctx) => {
    const myHex = ctx.sender.toHexString();
    const existing = ctx.db.npc_host.id.find(0);
    
    if (existing) {
      // Check if existing host is still connected (has a player row)
      let hostAlive = false;
      for (const p of ctx.db.player.iter()) {
        if (p.identity.toHexString() === existing.host_identity) {
          hostAlive = true;
          break;
        }
      }
      if (hostAlive && existing.host_identity !== myHex) {
        // Another live client is already hosting — reject
        console.log(`NPC host claim rejected: ${myHex.slice(0,8)} (host=${existing.host_identity.slice(0,8)})`);
        return;
      }
      // Host disconnected or it's us re-claiming — update
      ctx.db.npc_host.id.update({
        id: 0,
        host_identity: myHex,
        claimed_at: BigInt(Date.now()),
      });
    } else {
      // No host exists — claim it
      try { ctx.db.npc_host.id.delete(0); } catch(e) {} // safety cleanup
      ctx.db.npc_host.insert({
        id: 0,
        host_identity: myHex,
        claimed_at: BigInt(Date.now()),
      });
    }
    console.log(`NPC host claimed by: ${myHex.slice(0,8)}`);
  }
);

// spawn_npc — host creates initial NPC rows
export const spawn_npc = spacetimedb.reducer(
  {
    npc_id:      t.u32(),
    name:        t.string(),
    x:           t.f32(),
    y:           t.f32(),
    angle:       t.f32(),
    ship:        t.string(),
    color:       t.string(),
    personality: t.string(),
    hp:          t.f32(),
    max_hp:      t.f32(),
    shield:      t.f32(),
    max_shield:  t.f32(),
    total_kills: t.u32(),
    total_mined: t.u32(),
    total_earned:t.u32(),
  },
  (ctx, args) => {
    // Only the NPC host can spawn NPCs
    const host = ctx.db.npc_host.id.find(0);
    if (!host || host.host_identity !== ctx.sender.toHexString()) return;

    // Delete existing NPC with this ID if present
    const existing = ctx.db.npc.id.find(args.npc_id);
    if (existing) {
      ctx.db.npc.id.delete(args.npc_id);
    }

    ctx.db.npc.insert({
      id:           args.npc_id,
      name:         args.name,
      x:            args.x,
      y:            args.y,
      vx:           0,
      vy:           0,
      angle:        args.angle,
      ship:         args.ship,
      color:        args.color,
      personality:  args.personality,
      state:        'idle',
      hp:           args.hp,
      max_hp:       args.max_hp,
      shield:       args.shield,
      max_shield:   args.max_shield,
      dead:         false,
      cargo_used:   0,
      total_kills:  args.total_kills,
      total_mined:  args.total_mined,
      total_earned: args.total_earned,
      stun_timer:   0,
      last_update:  BigInt(Date.now()),
    });
  }
);

// update_npc — host pushes position/state for a single NPC (called in batch from client)
export const update_npc = spacetimedb.reducer(
  {
    npc_id:      t.u32(),
    x:           t.f32(),
    y:           t.f32(),
    vx:          t.f32(),
    vy:          t.f32(),
    angle:       t.f32(),
    state:       t.string(),
    hp:          t.f32(),
    shield:      t.f32(),
    dead:        t.bool(),
    cargo_used:  t.u32(),
    stun_timer:  t.f32(),
    total_kills: t.u32(),
    total_mined: t.u32(),
    total_earned:t.u32(),
  },
  (ctx, args) => {
    // Only the NPC host can update NPCs
    const host = ctx.db.npc_host.id.find(0);
    if (!host || host.host_identity !== ctx.sender.toHexString()) return;

    const npc = ctx.db.npc.id.find(args.npc_id);
    if (!npc) return;

    ctx.db.npc.id.update({
      ...npc,
      x:            args.x,
      y:            args.y,
      vx:           args.vx,
      vy:           args.vy,
      angle:        args.angle,
      state:        args.state,
      hp:           args.hp,
      shield:       args.shield,
      dead:         args.dead,
      cargo_used:   args.cargo_used,
      stun_timer:   args.stun_timer,
      total_kills:  args.total_kills,
      total_mined:  args.total_mined,
      total_earned: args.total_earned,
      last_update:  BigInt(Date.now()),
    });
  }
);

// damage_npc — any player can deal damage to an NPC (server-authoritative)
export const damage_npc = spacetimedb.reducer(
  {
    npc_id:       t.u32(),
    damage:       t.f32(),
    attacker_name:t.string(),
  },
  (ctx, args) => {
    const npc = ctx.db.npc.id.find(args.npc_id);
    if (!npc || npc.dead) return;

    // Shield absorption (70% — same as player combat)
    let dmg = args.damage;
    let newShield = npc.shield;
    let newHp = npc.hp;

    if (newShield > 0) {
      const shieldAbsorb = Math.min(newShield, dmg * 0.7);
      newShield -= shieldAbsorb;
      dmg -= shieldAbsorb;
    }
    newHp -= dmg;

    if (newHp <= 0) {
      ctx.db.npc.id.update({
        ...npc,
        hp: 0,
        shield: 0,
        dead: true,
        last_update: BigInt(Date.now()),
      });
      // Record kill event
      ctx.db.kill_event.insert({
        id: BigInt(0),
        killer: args.attacker_name,
        victim: npc.name,
        timestamp: BigInt(Date.now()),
      });
      console.log(`${args.attacker_name} destroyed NPC ${npc.name}`);
    } else {
      ctx.db.npc.id.update({
        ...npc,
        hp: newHp,
        shield: Math.max(0, newShield),
        last_update: BigInt(Date.now()),
      });
    }
  }
);

// respawn_npc — host respawns a dead NPC
export const respawn_npc = spacetimedb.reducer(
  {
    npc_id:    t.u32(),
    x:         t.f32(),
    y:         t.f32(),
    hp:        t.f32(),
    shield:    t.f32(),
  },
  (ctx, args) => {
    const host = ctx.db.npc_host.id.find(0);
    if (!host || host.host_identity !== ctx.sender.toHexString()) return;

    const npc = ctx.db.npc.id.find(args.npc_id);
    if (!npc) return;

    ctx.db.npc.id.update({
      ...npc,
      x:           args.x,
      y:           args.y,
      vx:          0,
      vy:          0,
      hp:          args.hp,
      shield:      args.shield,
      dead:        false,
      cargo_used:  0,
      state:       'idle',
      stun_timer:  0,
      last_update: BigInt(Date.now()),
    });
  }
);
