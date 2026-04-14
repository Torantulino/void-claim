var SpacetimeDB = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // client-bindings/src/index.ts
  var index_exports = {};
  __export(index_exports, {
    DbConnection: () => DbConnection,
    DbConnectionBuilder: () => DbConnectionBuilder,
    SubscriptionBuilder: () => SubscriptionBuilder,
    reducers: () => reducers,
    tables: () => tables
  });
  var import_spacetimedb36 = __require("spacetimedb");

  // client-bindings/src/claim_npc_host_reducer.ts
  var claim_npc_host_reducer_default = {};

  // client-bindings/src/damage_asteroid_reducer.ts
  var import_spacetimedb = __require("spacetimedb");
  var damage_asteroid_reducer_default = {
    asteroidId: import_spacetimedb.t.u32(),
    damage: import_spacetimedb.t.f32()
  };

  // client-bindings/src/damage_npc_reducer.ts
  var import_spacetimedb2 = __require("spacetimedb");
  var damage_npc_reducer_default = {
    npcId: import_spacetimedb2.t.u32(),
    damage: import_spacetimedb2.t.f32(),
    attackerName: import_spacetimedb2.t.string()
  };

  // client-bindings/src/damage_station_reducer.ts
  var import_spacetimedb3 = __require("spacetimedb");
  var damage_station_reducer_default = {
    stationId: import_spacetimedb3.t.u32(),
    damage: import_spacetimedb3.t.f32(),
    attackerName: import_spacetimedb3.t.string()
  };

  // client-bindings/src/damage_wingman_reducer.ts
  var import_spacetimedb4 = __require("spacetimedb");
  var damage_wingman_reducer_default = {
    wingmanId: import_spacetimedb4.t.string(),
    damage: import_spacetimedb4.t.f32(),
    attackerName: import_spacetimedb4.t.string()
  };

  // client-bindings/src/deal_damage_reducer.ts
  var import_spacetimedb5 = __require("spacetimedb");
  var deal_damage_reducer_default = {
    victimIdentityHex: import_spacetimedb5.t.string(),
    damage: import_spacetimedb5.t.f32(),
    attackerName: import_spacetimedb5.t.string()
  };

  // client-bindings/src/delete_wingman_reducer.ts
  var import_spacetimedb6 = __require("spacetimedb");
  var delete_wingman_reducer_default = {
    wingmanId: import_spacetimedb6.t.string()
  };

  // client-bindings/src/fire_projectile_reducer.ts
  var import_spacetimedb7 = __require("spacetimedb");
  var fire_projectile_reducer_default = {
    x: import_spacetimedb7.t.f32(),
    y: import_spacetimedb7.t.f32(),
    vx: import_spacetimedb7.t.f32(),
    vy: import_spacetimedb7.t.f32(),
    dmg: import_spacetimedb7.t.f32(),
    color: import_spacetimedb7.t.string(),
    ttlMs: import_spacetimedb7.t.u32()
  };

  // client-bindings/src/heal_player_reducer.ts
  var import_spacetimedb8 = __require("spacetimedb");
  var heal_player_reducer_default = {
    healHp: import_spacetimedb8.t.f32(),
    healShield: import_spacetimedb8.t.f32()
  };

  // client-bindings/src/heartbeat_npc_host_reducer.ts
  var heartbeat_npc_host_reducer_default = {};

  // client-bindings/src/join_game_reducer.ts
  var import_spacetimedb9 = __require("spacetimedb");
  var join_game_reducer_default = {
    name: import_spacetimedb9.t.string(),
    ship: import_spacetimedb9.t.string(),
    color: import_spacetimedb9.t.string(),
    maxHp: import_spacetimedb9.t.f32(),
    maxShield: import_spacetimedb9.t.f32()
  };

  // client-bindings/src/leave_game_reducer.ts
  var leave_game_reducer_default = {};

  // client-bindings/src/prune_events_reducer.ts
  var prune_events_reducer_default = {};

  // client-bindings/src/prune_projectiles_reducer.ts
  var prune_projectiles_reducer_default = {};

  // client-bindings/src/report_kill_reducer.ts
  var import_spacetimedb10 = __require("spacetimedb");
  var report_kill_reducer_default = {
    killerName: import_spacetimedb10.t.string(),
    victimName: import_spacetimedb10.t.string()
  };

  // client-bindings/src/respawn_asteroid_reducer.ts
  var import_spacetimedb11 = __require("spacetimedb");
  var respawn_asteroid_reducer_default = {
    asteroidId: import_spacetimedb11.t.u32()
  };

  // client-bindings/src/respawn_npc_reducer.ts
  var import_spacetimedb12 = __require("spacetimedb");
  var respawn_npc_reducer_default = {
    npcId: import_spacetimedb12.t.u32(),
    x: import_spacetimedb12.t.f32(),
    y: import_spacetimedb12.t.f32(),
    hp: import_spacetimedb12.t.f32(),
    shield: import_spacetimedb12.t.f32()
  };

  // client-bindings/src/respawn_player_reducer.ts
  var respawn_player_reducer_default = {};

  // client-bindings/src/respawn_station_reducer.ts
  var import_spacetimedb13 = __require("spacetimedb");
  var respawn_station_reducer_default = {
    stationId: import_spacetimedb13.t.u32()
  };

  // client-bindings/src/seed_asteroids_reducer.ts
  var seed_asteroids_reducer_default = {};

  // client-bindings/src/seed_world_reducer.ts
  var seed_world_reducer_default = {};

  // client-bindings/src/sell_ore_reducer.ts
  var import_spacetimedb14 = __require("spacetimedb");
  var sell_ore_reducer_default = {
    amount: import_spacetimedb14.t.u64(),
    sale_type: import_spacetimedb14.t.string(),
    x: import_spacetimedb14.t.f32(),
    y: import_spacetimedb14.t.f32()
  };

  // client-bindings/src/send_chat_reducer.ts
  var import_spacetimedb15 = __require("spacetimedb");
  var send_chat_reducer_default = {
    senderName: import_spacetimedb15.t.string(),
    text: import_spacetimedb15.t.string()
  };

  // client-bindings/src/npc_sell_ore_reducer.ts
  var import_spacetimedb16 = __require("spacetimedb");
  var npc_sell_ore_reducer_default = {
    npc_id: import_spacetimedb16.t.u32(),
    amount: import_spacetimedb16.t.u64(),
    sale_type: import_spacetimedb16.t.string(),
    x: import_spacetimedb16.t.f32(),
    y: import_spacetimedb16.t.f32()
  };

  // client-bindings/src/spawn_npc_reducer.ts
  var import_spacetimedb17 = __require("spacetimedb");
  var spawn_npc_reducer_default = {
    npcId: import_spacetimedb17.t.u32(),
    name: import_spacetimedb17.t.string(),
    x: import_spacetimedb17.t.f32(),
    y: import_spacetimedb17.t.f32(),
    angle: import_spacetimedb17.t.f32(),
    ship: import_spacetimedb17.t.string(),
    color: import_spacetimedb17.t.string(),
    personality: import_spacetimedb17.t.string(),
    hp: import_spacetimedb17.t.f32(),
    maxHp: import_spacetimedb17.t.f32(),
    shield: import_spacetimedb17.t.f32(),
    maxShield: import_spacetimedb17.t.f32(),
    totalKills: import_spacetimedb17.t.u32(),
    totalMined: import_spacetimedb17.t.u32(),
    totalEarned: import_spacetimedb17.t.u32()
  };

  // client-bindings/src/spawn_station_reducer.ts
  var import_spacetimedb18 = __require("spacetimedb");
  var spawn_station_reducer_default = {
    stationId: import_spacetimedb18.t.u32(),
    x: import_spacetimedb18.t.f32(),
    y: import_spacetimedb18.t.f32(),
    hp: import_spacetimedb18.t.f32(),
    maxHp: import_spacetimedb18.t.f32(),
    shield: import_spacetimedb18.t.f32(),
    maxShield: import_spacetimedb18.t.f32()
  };

  // client-bindings/src/spawn_wingman_reducer.ts
  var import_spacetimedb19 = __require("spacetimedb");
  var spawn_wingman_reducer_default = {
    wingmanId: import_spacetimedb19.t.string(),
    name: import_spacetimedb19.t.string(),
    ship: import_spacetimedb19.t.string(),
    color: import_spacetimedb19.t.string(),
    wmType: import_spacetimedb19.t.string(),
    hp: import_spacetimedb19.t.f32(),
    maxHp: import_spacetimedb19.t.f32(),
    shield: import_spacetimedb19.t.f32(),
    maxShield: import_spacetimedb19.t.f32()
  };

  // client-bindings/src/submit_score_reducer.ts
  var import_spacetimedb20 = __require("spacetimedb");
  var submit_score_reducer_default = {
    name: import_spacetimedb20.t.string(),
    mined: import_spacetimedb20.t.u64(),
    ship: import_spacetimedb20.t.string(),
    color: import_spacetimedb20.t.string()
  };

  // client-bindings/src/update_npc_reducer.ts
  var import_spacetimedb21 = __require("spacetimedb");
  var update_npc_reducer_default = {
    npcId: import_spacetimedb21.t.u32(),
    x: import_spacetimedb21.t.f32(),
    y: import_spacetimedb21.t.f32(),
    vx: import_spacetimedb21.t.f32(),
    vy: import_spacetimedb21.t.f32(),
    angle: import_spacetimedb21.t.f32(),
    state: import_spacetimedb21.t.string(),
    hp: import_spacetimedb21.t.f32(),
    shield: import_spacetimedb21.t.f32(),
    dead: import_spacetimedb21.t.bool(),
    cargoUsed: import_spacetimedb21.t.u32(),
    stunTimer: import_spacetimedb21.t.f32(),
    totalKills: import_spacetimedb21.t.u32(),
    totalMined: import_spacetimedb21.t.u32(),
    totalEarned: import_spacetimedb21.t.u32(),
    miningTargetId: import_spacetimedb21.t.i32()
  };

  // client-bindings/src/update_player_reducer.ts
  var import_spacetimedb22 = __require("spacetimedb");
  var update_player_reducer_default = {
    x: import_spacetimedb22.t.f32(),
    y: import_spacetimedb22.t.f32(),
    vx: import_spacetimedb22.t.f32(),
    vy: import_spacetimedb22.t.f32(),
    angle: import_spacetimedb22.t.f32(),
    cargoUsed: import_spacetimedb22.t.u32(),
    dead: import_spacetimedb22.t.bool(),
    cloaked: import_spacetimedb22.t.bool(),
    bounty: import_spacetimedb22.t.bool(),
    ship: import_spacetimedb22.t.string(),
    color: import_spacetimedb22.t.string(),
    maxHp: import_spacetimedb22.t.f32(),
    maxShield: import_spacetimedb22.t.f32(),
    miningX: import_spacetimedb22.t.f32(),
    miningY: import_spacetimedb22.t.f32(),
    miningOre: import_spacetimedb22.t.string()
  };

  // client-bindings/src/update_wingman_reducer.ts
  var import_spacetimedb23 = __require("spacetimedb");
  var update_wingman_reducer_default = {
    wingmanId: import_spacetimedb23.t.string(),
    x: import_spacetimedb23.t.f32(),
    y: import_spacetimedb23.t.f32(),
    vx: import_spacetimedb23.t.f32(),
    vy: import_spacetimedb23.t.f32(),
    angle: import_spacetimedb23.t.f32(),
    state: import_spacetimedb23.t.string(),
    hp: import_spacetimedb23.t.f32(),
    shield: import_spacetimedb23.t.f32()
  };

  // client-bindings/src/asteroid_table.ts
  var import_spacetimedb24 = __require("spacetimedb");
  var asteroid_table_default = import_spacetimedb24.t.row({
    id: import_spacetimedb24.t.u32().primaryKey(),
    x: import_spacetimedb24.t.f32(),
    y: import_spacetimedb24.t.f32(),
    oreType: import_spacetimedb24.t.u32().name("ore_type"),
    size: import_spacetimedb24.t.f32(),
    hp: import_spacetimedb24.t.f32(),
    maxHp: import_spacetimedb24.t.f32().name("max_hp"),
    alive: import_spacetimedb24.t.bool(),
    respawnAt: import_spacetimedb24.t.u64().name("respawn_at"),
    rotSpeed: import_spacetimedb24.t.f32().name("rot_speed")
  });

  // client-bindings/src/chat_message_table.ts
  var import_spacetimedb25 = __require("spacetimedb");
  var chat_message_table_default = import_spacetimedb25.t.row({
    id: import_spacetimedb25.t.u64().primaryKey(),
    sender: import_spacetimedb25.t.string(),
    text: import_spacetimedb25.t.string(),
    timestamp: import_spacetimedb25.t.u64()
  });

  // client-bindings/src/kill_event_table.ts
  var import_spacetimedb26 = __require("spacetimedb");
  var kill_event_table_default = import_spacetimedb26.t.row({
    id: import_spacetimedb26.t.u64().primaryKey(),
    killer: import_spacetimedb26.t.string(),
    victim: import_spacetimedb26.t.string(),
    timestamp: import_spacetimedb26.t.u64()
  });

  // client-bindings/src/leaderboard_entry_table.ts
  var import_spacetimedb27 = __require("spacetimedb");
  var leaderboard_entry_table_default = import_spacetimedb27.t.row({
    id: import_spacetimedb27.t.u64().primaryKey(),
    name: import_spacetimedb27.t.string(),
    credits: import_spacetimedb27.t.u64(),
    kills: import_spacetimedb27.t.u32(),
    mined: import_spacetimedb27.t.u64(),
    ship: import_spacetimedb27.t.string(),
    color: import_spacetimedb27.t.string(),
    timestamp: import_spacetimedb27.t.u64()
  });

  // client-bindings/src/npc_table.ts
  var import_spacetimedb28 = __require("spacetimedb");
  var npc_table_default = import_spacetimedb28.t.row({
    id: import_spacetimedb28.t.u32().primaryKey(),
    name: import_spacetimedb28.t.string(),
    x: import_spacetimedb28.t.f32(),
    y: import_spacetimedb28.t.f32(),
    vx: import_spacetimedb28.t.f32(),
    vy: import_spacetimedb28.t.f32(),
    angle: import_spacetimedb28.t.f32(),
    ship: import_spacetimedb28.t.string(),
    color: import_spacetimedb28.t.string(),
    personality: import_spacetimedb28.t.string(),
    state: import_spacetimedb28.t.string(),
    hp: import_spacetimedb28.t.f32(),
    maxHp: import_spacetimedb28.t.f32().name("max_hp"),
    shield: import_spacetimedb28.t.f32(),
    maxShield: import_spacetimedb28.t.f32().name("max_shield"),
    dead: import_spacetimedb28.t.bool(),
    cargoUsed: import_spacetimedb28.t.u32().name("cargo_used"),
    totalKills: import_spacetimedb28.t.u32().name("total_kills"),
    totalMined: import_spacetimedb28.t.u32().name("total_mined"),
    totalEarned: import_spacetimedb28.t.u32().name("total_earned"),
    stunTimer: import_spacetimedb28.t.f32().name("stun_timer"),
    miningTargetId: import_spacetimedb28.t.i32().name("mining_target_id"),
    lastUpdate: import_spacetimedb28.t.u64().name("last_update")
  });

  // client-bindings/src/npc_host_table.ts
  var import_spacetimedb29 = __require("spacetimedb");
  var npc_host_table_default = import_spacetimedb29.t.row({
    id: import_spacetimedb29.t.u32().primaryKey(),
    hostIdentity: import_spacetimedb29.t.string().name("host_identity"),
    claimedAt: import_spacetimedb29.t.u64().name("claimed_at")
  });

  // client-bindings/src/player_table.ts
  var import_spacetimedb30 = __require("spacetimedb");
  var player_table_default = import_spacetimedb30.t.row({
    identity: import_spacetimedb30.t.identity().primaryKey(),
    name: import_spacetimedb30.t.string(),
    x: import_spacetimedb30.t.f32(),
    y: import_spacetimedb30.t.f32(),
    angle: import_spacetimedb30.t.f32(),
    ship: import_spacetimedb30.t.string(),
    color: import_spacetimedb30.t.string(),
    hp: import_spacetimedb30.t.f32(),
    maxHp: import_spacetimedb30.t.f32().name("max_hp"),
    shield: import_spacetimedb30.t.f32(),
    maxShield: import_spacetimedb30.t.f32().name("max_shield"),
    cargoUsed: import_spacetimedb30.t.u32().name("cargo_used"),
    dead: import_spacetimedb30.t.bool(),
    cloaked: import_spacetimedb30.t.bool(),
    bounty: import_spacetimedb30.t.bool(),
    kills: import_spacetimedb30.t.u32(),
    earned: import_spacetimedb30.t.u64(),
    lastUpdate: import_spacetimedb30.t.u64().name("last_update"),
    vx: import_spacetimedb30.t.f32(),
    vy: import_spacetimedb30.t.f32(),
    miningX: import_spacetimedb30.t.f32().name("mining_x"),
    miningY: import_spacetimedb30.t.f32().name("mining_y"),
    miningOre: import_spacetimedb30.t.string().name("mining_ore"),
    lastDamageTime: import_spacetimedb30.t.u64().name("last_damage_time")
  });

  // client-bindings/src/projectile_table.ts
  var import_spacetimedb31 = __require("spacetimedb");
  var projectile_table_default = import_spacetimedb31.t.row({
    id: import_spacetimedb31.t.u64().primaryKey(),
    ownerId: import_spacetimedb31.t.string().name("owner_id"),
    ownerName: import_spacetimedb31.t.string().name("owner_name"),
    x: import_spacetimedb31.t.f32(),
    y: import_spacetimedb31.t.f32(),
    vx: import_spacetimedb31.t.f32(),
    vy: import_spacetimedb31.t.f32(),
    dmg: import_spacetimedb31.t.f32(),
    color: import_spacetimedb31.t.string(),
    isPlayer: import_spacetimedb31.t.bool().name("is_player"),
    spawnedAt: import_spacetimedb31.t.u64().name("spawned_at"),
    ttlMs: import_spacetimedb31.t.u32().name("ttl_ms")
  });

  // client-bindings/src/sale_event_table.ts
  var import_spacetimedb32 = __require("spacetimedb");
  var sale_event_table_default = import_spacetimedb32.t.row({
    id: import_spacetimedb32.t.u64(),
    seller_id: import_spacetimedb32.t.string(),
    seller_name: import_spacetimedb32.t.string(),
    seller_type: import_spacetimedb32.t.string(),
    amount_earned: import_spacetimedb32.t.u64(),
    sale_type: import_spacetimedb32.t.string(),
    x: import_spacetimedb32.t.f32(),
    y: import_spacetimedb32.t.f32(),
    timestamp: import_spacetimedb32.t.u64()
  });

  // client-bindings/src/space_station_table.ts
  var import_spacetimedb33 = __require("spacetimedb");
  var space_station_table_default = import_spacetimedb33.t.row({
    id: import_spacetimedb33.t.u32().primaryKey(),
    x: import_spacetimedb33.t.f32(),
    y: import_spacetimedb33.t.f32(),
    hp: import_spacetimedb33.t.f32(),
    maxHp: import_spacetimedb33.t.f32().name("max_hp"),
    shield: import_spacetimedb33.t.f32(),
    maxShield: import_spacetimedb33.t.f32().name("max_shield"),
    dead: import_spacetimedb33.t.bool(),
    respawnAt: import_spacetimedb33.t.u64().name("respawn_at"),
    lastUpdate: import_spacetimedb33.t.u64().name("last_update")
  });

  // client-bindings/src/wingman_table.ts
  var import_spacetimedb34 = __require("spacetimedb");
  var wingman_table_default = import_spacetimedb34.t.row({
    id: import_spacetimedb34.t.string().primaryKey(),
    ownerIdentityHex: import_spacetimedb34.t.string().name("owner_identity_hex"),
    name: import_spacetimedb34.t.string(),
    ship: import_spacetimedb34.t.string(),
    color: import_spacetimedb34.t.string(),
    wmType: import_spacetimedb34.t.string().name("wm_type"),
    x: import_spacetimedb34.t.f32(),
    y: import_spacetimedb34.t.f32(),
    vx: import_spacetimedb34.t.f32(),
    vy: import_spacetimedb34.t.f32(),
    angle: import_spacetimedb34.t.f32(),
    hp: import_spacetimedb34.t.f32(),
    maxHp: import_spacetimedb34.t.f32().name("max_hp"),
    shield: import_spacetimedb34.t.f32(),
    maxShield: import_spacetimedb34.t.f32().name("max_shield"),
    dead: import_spacetimedb34.t.bool(),
    state: import_spacetimedb34.t.string(),
    lastUpdate: import_spacetimedb34.t.u64().name("last_update")
  });

  // client-bindings/src/world_state_table.ts
  var import_spacetimedb35 = __require("spacetimedb");
  var world_state_table_default = import_spacetimedb35.t.row({
    id: import_spacetimedb35.t.u32().primaryKey(),
    worldSeed: import_spacetimedb35.t.u64().name("world_seed")
  });

  // client-bindings/src/index.ts
  var tablesSchema = (0, import_spacetimedb36.schema)({
    asteroid: (0, import_spacetimedb36.table)({
      name: "asteroid",
      indexes: [
        { accessor: "id", name: "asteroid_id_idx_btree", algorithm: "btree", columns: [
          "id"
        ] }
      ],
      constraints: [
        { name: "asteroid_id_key", constraint: "unique", columns: ["id"] }
      ]
    }, asteroid_table_default),
    chat_message: (0, import_spacetimedb36.table)({
      name: "chat_message",
      indexes: [
        { accessor: "id", name: "chat_message_id_idx_btree", algorithm: "btree", columns: [
          "id"
        ] }
      ],
      constraints: [
        { name: "chat_message_id_key", constraint: "unique", columns: ["id"] }
      ]
    }, chat_message_table_default),
    kill_event: (0, import_spacetimedb36.table)({
      name: "kill_event",
      indexes: [
        { accessor: "id", name: "kill_event_id_idx_btree", algorithm: "btree", columns: [
          "id"
        ] }
      ],
      constraints: [
        { name: "kill_event_id_key", constraint: "unique", columns: ["id"] }
      ]
    }, kill_event_table_default),
    sale_event: (0, import_spacetimedb36.table)({
      name: "sale_event",
      indexes: [
        { accessor: "id", name: "sale_event_id_idx_btree", algorithm: "btree", columns: [
          "id"
        ] }
      ],
      constraints: [
        { name: "sale_event_id_key", constraint: "unique", columns: ["id"] }
      ]
    }, sale_event_table_default),
    leaderboard_entry: (0, import_spacetimedb36.table)({
      name: "leaderboard_entry",
      indexes: [
        { accessor: "id", name: "leaderboard_entry_id_idx_btree", algorithm: "btree", columns: [
          "id"
        ] }
      ],
      constraints: [
        { name: "leaderboard_entry_id_key", constraint: "unique", columns: ["id"] }
      ]
    }, leaderboard_entry_table_default),
    npc: (0, import_spacetimedb36.table)({
      name: "npc",
      indexes: [
        { accessor: "id", name: "npc_id_idx_btree", algorithm: "btree", columns: [
          "id"
        ] }
      ],
      constraints: [
        { name: "npc_id_key", constraint: "unique", columns: ["id"] }
      ]
    }, npc_table_default),
    npc_host: (0, import_spacetimedb36.table)({
      name: "npc_host",
      indexes: [
        { accessor: "id", name: "npc_host_id_idx_btree", algorithm: "btree", columns: [
          "id"
        ] }
      ],
      constraints: [
        { name: "npc_host_id_key", constraint: "unique", columns: ["id"] }
      ]
    }, npc_host_table_default),
    player: (0, import_spacetimedb36.table)({
      name: "player",
      indexes: [
        { accessor: "identity", name: "player_identity_idx_btree", algorithm: "btree", columns: [
          "identity"
        ] }
      ],
      constraints: [
        { name: "player_identity_key", constraint: "unique", columns: ["identity"] }
      ]
    }, player_table_default),
    projectile: (0, import_spacetimedb36.table)({
      name: "projectile",
      indexes: [
        { accessor: "id", name: "projectile_id_idx_btree", algorithm: "btree", columns: [
          "id"
        ] }
      ],
      constraints: [
        { name: "projectile_id_key", constraint: "unique", columns: ["id"] }
      ]
    }, projectile_table_default),
    space_station: (0, import_spacetimedb36.table)({
      name: "space_station",
      indexes: [
        { accessor: "id", name: "space_station_id_idx_btree", algorithm: "btree", columns: [
          "id"
        ] }
      ],
      constraints: [
        { name: "space_station_id_key", constraint: "unique", columns: ["id"] }
      ]
    }, space_station_table_default),
    wingman: (0, import_spacetimedb36.table)({
      name: "wingman",
      indexes: [
        { accessor: "id", name: "wingman_id_idx_btree", algorithm: "btree", columns: [
          "id"
        ] }
      ],
      constraints: [
        { name: "wingman_id_key", constraint: "unique", columns: ["id"] }
      ]
    }, wingman_table_default),
    world_state: (0, import_spacetimedb36.table)({
      name: "world_state",
      indexes: [
        { accessor: "id", name: "world_state_id_idx_btree", algorithm: "btree", columns: [
          "id"
        ] }
      ],
      constraints: [
        { name: "world_state_id_key", constraint: "unique", columns: ["id"] }
      ]
    }, world_state_table_default)
  });
  var reducersSchema = (0, import_spacetimedb36.reducers)(
    (0, import_spacetimedb36.reducerSchema)("claim_npc_host", claim_npc_host_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("damage_asteroid", damage_asteroid_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("damage_npc", damage_npc_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("damage_station", damage_station_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("damage_wingman", damage_wingman_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("deal_damage", deal_damage_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("delete_wingman", delete_wingman_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("fire_projectile", fire_projectile_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("heal_player", heal_player_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("heartbeat_npc_host", heartbeat_npc_host_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("join_game", join_game_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("leave_game", leave_game_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("npc_sell_ore", npc_sell_ore_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("prune_events", prune_events_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("prune_projectiles", prune_projectiles_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("report_kill", report_kill_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("respawn_asteroid", respawn_asteroid_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("respawn_npc", respawn_npc_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("respawn_player", respawn_player_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("respawn_station", respawn_station_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("seed_asteroids", seed_asteroids_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("seed_world", seed_world_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("sell_ore", sell_ore_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("send_chat", send_chat_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("spawn_npc", spawn_npc_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("spawn_station", spawn_station_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("spawn_wingman", spawn_wingman_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("submit_score", submit_score_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("update_npc", update_npc_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("update_player", update_player_reducer_default),
    (0, import_spacetimedb36.reducerSchema)("update_wingman", update_wingman_reducer_default)
  );
  var proceduresSchema = (0, import_spacetimedb36.procedures)();
  var REMOTE_MODULE = {
    versionInfo: {
      cliVersion: "2.1.0"
    },
    tables: tablesSchema.schemaType.tables,
    reducers: reducersSchema.reducersType.reducers,
    ...proceduresSchema
  };
  var tables = (0, import_spacetimedb36.makeQueryBuilder)(tablesSchema.schemaType);
  var reducers = (0, import_spacetimedb36.convertToAccessorMap)(reducersSchema.reducersType.reducers);
  var SubscriptionBuilder = class extends import_spacetimedb36.SubscriptionBuilderImpl {
  };
  var DbConnectionBuilder = class extends import_spacetimedb36.DbConnectionBuilder {
  };
  var DbConnection = class _DbConnection extends import_spacetimedb36.DbConnectionImpl {
    /** Creates a new {@link DbConnectionBuilder} to configure and connect to the remote SpacetimeDB instance. */
    static builder = () => {
      return new DbConnectionBuilder(REMOTE_MODULE, (config) => new _DbConnection(config));
    };
    /** Creates a new {@link SubscriptionBuilder} to configure a subscription to the remote SpacetimeDB instance. */
    subscriptionBuilder = () => {
      return new SubscriptionBuilder(this);
    };
  };
  return __toCommonJS(index_exports);
})();
