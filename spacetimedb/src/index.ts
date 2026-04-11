/**
 * VOID CLAIM — SpacetimeDB Server Module
 * 
 * Handles real-time multiplayer state for the asteroid mining game.
 * Tables: players, kill_feed, chat_messages, leaderboard
 * Reducers: player CRUD, combat, chat, leaderboard updates
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

export const update_player = spacetimedb.reducer(
  {
    x: t.f32(),
    y: t.f32(),
    angle: t.f32(),
    hp: t.f32(),
    max_hp: t.f32(),
    shield: t.f32(),
    max_shield: t.f32(),
    cargo_used: t.u32(),
    dead: t.bool(),
    cloaked: t.bool(),
    bounty: t.bool(),
    kills: t.u32(),
    earned: t.u64(),
    ship: t.string(),
    color: t.string(),
  },
  (ctx, args) => {
    const existing = ctx.db.player.identity.find(ctx.sender);
    if (!existing) return;

    ctx.db.player.identity.update({
      ...existing,
      x:           args.x,
      y:           args.y,
      angle:       args.angle,
      hp:          args.hp,
      max_hp:      args.max_hp,
      shield:      args.shield,
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
