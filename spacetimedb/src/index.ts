/**
 * VOID CLAIM — SpacetimeDB Server Module
 * 
 * Handles real-time multiplayer state for the asteroid mining game.
 * Tables: players, projectiles, kill_feed, chat_messages, leaderboard
 * Reducers: player CRUD, combat, chat, leaderboard updates
 */

import { schema, table, t } from 'spacetimedb/server';

// ═══════════════════════════════════════════
// Tables
// ═══════════════════════════════════════════

/**
 * Active player state — synced in real-time to all clients.
 * Each connected client has exactly one row.
 * Identity is the SpacetimeDB connection identity.
 */
const player = table(
  { name: 'player', public: true },
  {
    identity:    t.identity().primaryKey(),
    name:        t.string(),
    x:           t.f32(),
    y:           t.f32(),
    angle:       t.f32(),
    ship:        t.string(),     // 'prospector' | 'hauler' | 'corsair' | 'sentinel' | 'phantom'
    color:       t.string(),     // hex color e.g. '#33ff77'
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
    last_update: t.u64(),        // timestamp ms — used for stale detection
  }
);

/**
 * Kill feed — recent kills shown to all players.
 * Auto-pruned: clients only render the last N entries.
 */
const kill_event = table(
  { name: 'kill_event', public: true },
  {
    id:        t.u64().primaryKey().autoInc(),
    killer:    t.string(),
    victim:    t.string(),
    timestamp: t.u64(),
  }
);

/**
 * Chat messages — broadcast to all players.
 */
const chat_message = table(
  { name: 'chat_message', public: true },
  {
    id:        t.u64().primaryKey().autoInc(),
    sender:    t.string(),
    text:      t.string(),
    timestamp: t.u64(),
  }
);

/**
 * Persistent leaderboard — top players by credits earned.
 * Survives across sessions.
 */
const leaderboard_entry = table(
  { name: 'leaderboard_entry', public: true },
  {
    id:      t.u64().primaryKey().autoInc(),
    name:    t.string(),
    credits: t.u64(),
    kills:   t.u32(),
    mined:   t.u64(),
    ship:    t.string(),
    color:   t.string(),
    timestamp: t.u64(),
  }
);

// ═══════════════════════════════════════════
// Schema export
// ═══════════════════════════════════════════

const spacetimedb = schema({ player, kill_event, chat_message, leaderboard_entry });
export default spacetimedb;

// ═══════════════════════════════════════════
// Lifecycle hooks
// ═══════════════════════════════════════════

/**
 * When a client connects, we don't auto-create a player row.
 * The client calls `join_game` explicitly after the user picks a name/ship.
 */
export const client_connected = spacetimedb.reducer(
  (ctx) => {
    console.log(`Client connected: ${ctx.sender.toHexString()}`);
  }
);

/**
 * When a client disconnects, remove their player row so
 * other clients stop rendering them.
 */
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

/**
 * Called once when the player clicks LAUNCH.
 * Creates their row in the player table.
 */
export const join_game = spacetimedb.reducer(
  {
    name: t.string(),
    ship: t.string(),
    color: t.string(),
    max_hp: t.f32(),
    max_shield: t.f32(),
  },
  (ctx, args) => {
    // Remove any stale row from a previous session
    const existing = ctx.db.player.identity.find(ctx.sender);
    if (existing) {
      ctx.db.player.identity.delete(ctx.sender);
    }

    ctx.db.player.insert({
      identity:    ctx.sender,
      name:        args.name,
      x:           0,
      y:           -280,  // Just outside Earth
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

/**
 * High-frequency state update — called every game tick (~10Hz from client).
 * Only updates position, rotation, and visual state. 
 * Lightweight: no validation needed for position (client-authoritative for now).
 */
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
    if (!existing) return; // Not joined yet

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

/**
 * Player leaves game (explicit, e.g. closing tab sends this before disconnect).
 */
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

/**
 * Report a kill. Client-authoritative: the killer's client reports the event.
 * The kill_event table is public, so all clients see it in real-time.
 */
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

/**
 * Send a chat message. Broadcast to all subscribed clients.
 */
export const send_chat = spacetimedb.reducer(
  {
    sender_name: t.string(),
    text: t.string(),
  },
  (ctx, args) => {
    // Basic validation
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

/**
 * Submit or update a leaderboard score.
 * Called when player sells ore at Earth market.
 */
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
    // Find existing entry by name to update rather than duplicate
    let found = false;
    for (const entry of ctx.db.leaderboard_entry.iter()) {
      if (entry.name === args.name) {
        // Update if new score is higher
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

/**
 * Prune old kill events and chat messages to prevent unbounded growth.
 * Called periodically by any client (or a scheduled task).
 * Keeps the last 50 kills and 100 chat messages.
 */
export const prune_events = spacetimedb.reducer(
  (ctx) => {
    // Prune kill events older than 5 minutes
    const fiveMinAgo = BigInt(Date.now() - 5 * 60 * 1000);
    for (const ev of ctx.db.kill_event.iter()) {
      if (ev.timestamp < fiveMinAgo) {
        ctx.db.kill_event.id.delete(ev.id);
      }
    }

    // Prune chat messages older than 10 minutes
    const tenMinAgo = BigInt(Date.now() - 10 * 60 * 1000);
    for (const msg of ctx.db.chat_message.iter()) {
      if (msg.timestamp < tenMinAgo) {
        ctx.db.chat_message.id.delete(msg.id);
      }
    }
  }
);
