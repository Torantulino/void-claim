# VOID CLAIM — Dynamic Music System Implementation Plan

> Companion to `SOUNDTRACK_DESIGN.md`. This document specifies **exactly** how to wire 12 music tracks into the existing single-file codebase (`index.html`, ~6 138 lines) with seamless crossfading, vertical stem layering, and full edge-case coverage.

---

## Table of Contents

1. [Audio Graph Architecture](#1-audio-graph-architecture)
2. [Track Manifest & Loading Strategy](#2-track-manifest--loading-strategy)
3. [Game-State Detection Signals](#3-game-state-detection-signals)
4. [Music State Machine](#4-music-state-machine)
5. [Crossfade Engine](#5-crossfade-engine)
6. [Vertical Layer Engine](#6-vertical-layer-engine)
7. [Stinger / One-Shot System](#7-stinger--one-shot-system)
8. [Mix Bus & Ducking](#8-mix-bus--ducking)
9. [Edge Cases & Resilience](#9-edge-cases--resilience)
10. [Integration Points (Line-by-Line)](#10-integration-points-line-by-line)
11. [File Budget & Format Matrix](#11-file-budget--format-matrix)
12. [Implementation Order / Milestones](#12-implementation-order--milestones)

---

## 1. Audio Graph Architecture

### Current audio graph (simplified)

```
oscillators / noise ──► SFX GainNode ──► masterGain (0.35) ──► audioCtx.destination
drone oscillator ─────► droneGain ──────► masterGain
```

### Proposed graph with music

```
                        ┌──────────────────────────────────────────────────────┐
                        │                   MUSIC BUS                          │
                        │                                                      │
  Track A stems ──►[stemGainA1]──┐                                             │
                  ──►[stemGainA2]──► trackGainA ──┐                            │
                  ──►[stemGainA3]──┘               │                           │
                                                   ├──► musicBusGain ──┐       │
  Track B stems ──►[stemGainB1]──┐                 │        (0.7)      │       │
                  ──►[stemGainB2]──► trackGainB ──┘                    │       │
                  ──►[stemGainB3]──┘                                   │       │
                        └──────────────────────────────────────────────┘       │
                                                                               │
  Stingers ─────────────────────► stingerGain ─────────────────────────────────┤
                                     (1.0)                                     │
                                                                               │
  SFX (existing) ───────────────► sfxGain ─────────────────────────────────────┤
                                     (1.0)                                     │
                                                                               │
  Drone (existing) ─────────────► droneGain ───────────────────────────────────┤
                                                                               │
                                                              ┌────────────────┘
                                                              ▼
                                                         masterGain (0.35)
                                                              │
                                                              ▼
                                                       audioCtx.destination
```

### Key nodes to create

| Node              | Purpose                                         | Default gain |
|-------------------|-------------------------------------------------|-------------|
| `musicBusGain`    | Master volume for all music                     | 0.7         |
| `trackGain[i]`    | Per-track fader — crossfade target               | 0.0 or 1.0  |
| `stemGain[i][j]`  | Per-stem fader — vertical layer target           | 0.0 or 1.0  |
| `stingerGain`     | One-shot jingles (PAYDAY, HIRED GUN, CARRIER)   | 1.0         |
| `sfxGain`         | Wrap existing SFX so they can be ducked against  | 1.0         |
| `duckGain`        | Inserted before `musicBusGain` for SFX ducking   | 1.0         |

### Code location
Create all nodes inside `initAudio()` (currently line ~270). Insert **after** `masterGain` creation, **before** `startDrone()`.

```js
// --- Music bus ---
const musicBusGain = audioCtx.createGain();
musicBusGain.gain.value = 0.7;
const duckGain = audioCtx.createGain();
duckGain.gain.value = 1.0;
duckGain.connect(musicBusGain);
musicBusGain.connect(masterGain);

const stingerGain = audioCtx.createGain();
stingerGain.gain.value = 1.0;
stingerGain.connect(masterGain);
```


---

## 2. Track Manifest & Loading Strategy

### Track manifest (constant)

```js
const MUSIC_TRACKS = {
  title:    { id: 'title',    file: 'snd/last_signal',    bpm: 70,  loop: true,  stems: 1, loopStart: 0, loopEnd: null },
  safe:     { id: 'safe',     file: 'snd/orbital',        bpm: 95,  loop: true,  stems: 3, loopStart: 0, loopEnd: null },
  green:    { id: 'green',    file: 'snd/prospect',       bpm: 105, loop: true,  stems: 3, loopStart: 0, loopEnd: null },
  yellow:   { id: 'yellow',   file: 'snd/contested',      bpm: 115, loop: true,  stems: 3, loopStart: 0, loopEnd: null },
  red:      { id: 'red',      file: 'snd/lawless',        bpm: 128, loop: true,  stems: 3, loopStart: 0, loopEnd: null },
  void:     { id: 'void',     file: 'snd/the_breach',     bpm: 80,  loop: true,  stems: 4, loopStart: 0, loopEnd: null },
  police:   { id: 'police',   file: 'snd/wanted',         bpm: 135, loop: true,  stems: 3, loopStart: 0, loopEnd: null },
  combat:   { id: 'combat',   file: 'snd/iron_and_fire',  bpm: 140, loop: true,  stems: 1, loopStart: 0, loopEnd: null },
  death:    { id: 'death',    file: 'snd/cold_drift',     bpm: 0,   loop: false, stems: 1, loopStart: 0, loopEnd: null },
  // Stingers (one-shot, not looped)
  payday:   { id: 'payday',   file: 'snd/payday',         bpm: 0,   loop: false, stems: 3 },  // small/med/large variants
  hired:    { id: 'hired',    file: 'snd/hired_gun',      bpm: 0,   loop: false, stems: 1 },
  carrier:  { id: 'carrier',  file: 'snd/carrier_launch', bpm: 0,   loop: false, stems: 1 },
};
```

### File naming convention
Each stem is a separate file:
```
snd/orbital_a.ogg   (Layer A — base)
snd/orbital_b.ogg   (Layer B — shop)
snd/orbital_c.ogg   (Layer C — departure)
```
Single-stem tracks:
```
snd/last_signal.ogg
snd/iron_and_fire.ogg
```

### Loading strategy: Lazy + Priority Queue

**Problem:** 8-12 MB of music files cannot all be loaded on page load — that would stall the game start.

**Solution:** Priority-tiered lazy loading:

| Priority | Tracks | When to load |
|----------|--------|-------------|
| P0 — Immediate | `title` | On `initAudio()` call (title screen) |
| P1 — Pre-game | `safe`, `death` | On "Start Game" click, before spawning |
| P2 — Adjacent | Next zone ± 1 | When player enters a zone, preload neighbors |
| P3 — Background | All remaining | Idle-load via `requestIdleCallback` after P1 done |

```js
const audioBuffers = {};  // { 'safe_a': AudioBuffer, 'safe_b': AudioBuffer, ... }
let loadQueue = [];
let loading = false;

async function loadTrackStems(trackId) {
  const track = MUSIC_TRACKS[trackId];
  if (!track) return;
  const stemCount = track.stems;
  const promises = [];
  for (let i = 0; i < stemCount; i++) {
    const suffix = stemCount === 1 ? '' : '_' + String.fromCharCode(97 + i); // _a, _b, _c
    const key = trackId + suffix;
    if (audioBuffers[key]) continue;  // Already loaded
    const ext = canPlayOgg() ? '.ogg' : '.mp3';
    const url = track.file + suffix + ext;
    promises.push(
      fetch(url)
        .then(r => r.arrayBuffer())
        .then(buf => audioCtx.decodeAudioData(buf))
        .then(decoded => { audioBuffers[key] = decoded; })
        .catch(e => console.warn(`Failed to load ${url}:`, e))
    );
  }
  await Promise.all(promises);
}

function canPlayOgg() {
  return (new Audio()).canPlayType('audio/ogg; codecs=vorbis') !== '';
}

// Preload neighbors when entering a zone
const ZONE_NEIGHBORS = {
  safe:   ['title', 'green', 'death', 'police', 'combat'],
  green:  ['safe', 'yellow', 'combat'],
  yellow: ['green', 'red', 'combat'],
  red:    ['yellow', 'void', 'combat'],
  void:   ['red', 'combat', 'death'],
};

function preloadNeighbors(zone) {
  const neighbors = ZONE_NEIGHBORS[zone] || [];
  neighbors.forEach(id => {
    if (!audioBuffers[id] && !loadQueue.includes(id)) {
      loadQueue.push(id);
    }
  });
  processLoadQueue();
}

async function processLoadQueue() {
  if (loading) return;
  loading = true;
  while (loadQueue.length) {
    const next = loadQueue.shift();
    await loadTrackStems(next);
  }
  loading = false;
}
```

### Format selection
- **Primary:** OGG Vorbis (smaller, better loop accuracy)
- **Fallback:** MP3 (Safari pre-17, older iOS)
- Detection via `canPlayType('audio/ogg; codecs=vorbis')`
- **Encoding:** 128 kbps VBR for music, 96 kbps for stingers


---

## 3. Game-State Detection Signals

The music system needs to read game state without coupling to rendering code. We'll derive all signals from existing variables — **no new game logic required**, only readers.

### Signal: Current Zone

```js
// Already exists at line ~1040
function getZone(x, y) → 'safe' | 'green' | 'yellow' | 'red' | 'void'

// Music reads:
const currentZone = getZone(player.x, player.y);
```

### Signal: Game Phase

```js
// Already exists at line ~529
// gameState: 'menu' | 'playing' | 'dead'
```

### Signal: In Combat

No explicit flag exists. Derive from:

```js
function detectCombat() {
  const now = performance.now();

  // Player recently fired
  const playerFiring = player.shootCD > 0;

  // Player recently took damage (track in applyDamage)
  const playerHit = (now - player.lastDamageTime) < 3000;

  // Hostile NPC within engagement range attacking player
  const npcEngaging = npcs.some(n =>
    !n.dead && n.hostile && n.target === player &&
    dist(n, player) < 600
  );

  return playerFiring || playerHit || npcEngaging;
}
```

**New variable needed:** `player.lastDamageTime = 0;`
Set in `applyDamage()` (line ~4098):
```js
player.lastDamageTime = performance.now();
```

**Combat hold timer (prevents flicker):**
```js
let combatActiveUntil = 0;
const COMBAT_HOLD = 5000; // 5s after last combat signal

function isCombatActive() {
  if (detectCombat()) combatActiveUntil = performance.now() + COMBAT_HOLD;
  return performance.now() < combatActiveUntil;
}
```

### Signal: Police Chase

```js
function isPoliceChasing() {
  return policeUnits.some(p => p.state === 'hunt' && p.target === player);
}

function isPoliceWarning() {
  return isAggressor(player) && !isPoliceChasing();
}
```

### Signal: Leviathan Active

```js
function isLeviathanActive() {
  return leviathan && !leviathan.dead;
}

function isLeviathanPursuing() {
  return isLeviathanActive() && leviathan.state === 'chase';
}

function isLeviathanAttacking() {
  return isLeviathanActive() && leviathan.state === 'bite';
}
```

### Signal: Near Pirate Den

```js
function isNearPirateDen() {
  return pirateDens.some(d => dist(player, d) < d.radius * 1.5);
}
```

### Signal: Player HP Critical

```js
function isHpCritical() {
  return player.hp / player.maxHp < 0.3;
}
```

### Signal: Mining Active

```js
function isMining() {
  return player.miningTarget != null;
}
```

### Signal: Near Earth / Shop Open

```js
function isNearEarth() {
  return dist(player, {x: 0, y: 0}) < 500;
}
// Shop open is detectable via the existing market UI visibility flag
```

### Signal Priority Table

When multiple signals are true simultaneously, **music state is resolved by priority** (highest wins):

| Priority | Signal | Music State |
|----------|--------|-------------|
| 1 (highest) | `gameState === 'dead'` | `DEATH` |
| 2 | `gameState === 'menu'` | `TITLE` |
| 3 | `isPoliceChasing()` | `POLICE` |
| 4 | `isLeviathanPursuing()` | `VOID` (Layer C) |
| 5 | `isCombatActive()` | `COMBAT` |
| 6 | — | Zone track (safe/green/yellow/red/void) |

This means: if police are chasing you AND you're in combat, police music wins. If you die during any of these, death music wins instantly.


---

## 4. Music State Machine

### States

```
SILENT → TITLE → ZONE_SAFE → ZONE_GREEN → ZONE_YELLOW → ZONE_RED → ZONE_VOID
                     ↕             ↕            ↕            ↕          ↕
                   COMBAT ←──────────────────────────────────────────────
                     ↕
                   POLICE ←── (from any ZONE or COMBAT)
                     ↕
                   DEATH  ←── (from ANY state)
                     ↕
                   ZONE_SAFE (respawn always returns to safe)
```

### State definition

```js
const MusicState = {
  SILENT:      'silent',
  TITLE:       'title',
  ZONE_SAFE:   'safe',
  ZONE_GREEN:  'green',
  ZONE_YELLOW: 'yellow',
  ZONE_RED:    'red',
  ZONE_VOID:   'void',
  COMBAT:      'combat',
  POLICE:      'police',
  DEATH:       'death',
};

let currentMusicState = MusicState.SILENT;
let previousMusicState = MusicState.SILENT;  // For returning after combat/police
let pendingMusicState = null;                // Queued during crossfade lock
let crossfadeLocked = false;                 // Prevents rapid flickering
```

### State resolution (runs every frame)

```js
function resolveMusicState() {
  // Priority 1: Death
  if (gameState === 'dead') return MusicState.DEATH;

  // Priority 2: Menu
  if (gameState === 'menu') return MusicState.TITLE;

  // Priority 3: Police chase
  if (isPoliceChasing()) return MusicState.POLICE;

  // Priority 4: Leviathan pursuit (stays in VOID but activates layers)
  // (handled by layer engine, not state change)

  // Priority 5: Active combat
  if (isCombatActive()) return MusicState.COMBAT;

  // Priority 6: Zone-based
  const zone = getZone(player.x, player.y);
  switch (zone) {
    case 'safe':   return MusicState.ZONE_SAFE;
    case 'green':  return MusicState.ZONE_GREEN;
    case 'yellow': return MusicState.ZONE_YELLOW;
    case 'red':    return MusicState.ZONE_RED;
    case 'void':   return MusicState.ZONE_VOID;
    default:       return MusicState.ZONE_SAFE;
  }
}
```

### State transition handler

```js
function updateMusicState() {
  const desired = resolveMusicState();

  if (desired === currentMusicState) return;  // No change

  // If we're mid-crossfade, queue the change (unless it's DEATH — always immediate)
  if (crossfadeLocked && desired !== MusicState.DEATH) {
    pendingMusicState = desired;
    return;
  }

  // Track the "background" zone state for returning from combat/police
  if (desired === MusicState.COMBAT || desired === MusicState.POLICE) {
    if (currentMusicState !== MusicState.COMBAT && currentMusicState !== MusicState.POLICE) {
      previousMusicState = currentMusicState;
    }
  }

  const from = currentMusicState;
  const to = desired;

  // Determine crossfade duration
  const fadeDuration = getCrossfadeDuration(from, to);

  // Execute transition
  crossfadeTo(to, fadeDuration);

  previousMusicState = from;
  currentMusicState = to;
}
```

### Crossfade duration lookup

```js
function getCrossfadeDuration(from, to) {
  // Death: always instant
  if (to === MusicState.DEATH) return 0;

  // Death → Respawn (death → safe zone)
  if (from === MusicState.DEATH) return 1.0;

  // To police: fast (urgency)
  if (to === MusicState.POLICE) return 2.0;

  // To combat: quick
  if (to === MusicState.COMBAT) return 3.0;

  // From combat back to zone: slow unwind
  if (from === MusicState.COMBAT) return 5.0;

  // From police back to zone: moderate
  if (from === MusicState.POLICE) return 3.0;

  // To void: slow creep
  if (to === MusicState.ZONE_VOID) return 6.0;

  // Zone to zone: standard
  return 4.0;
}
```


---

## 5. Crossfade Engine

### Track playback manager

Each "active track" is a bundle of `AudioBufferSourceNode`s (one per stem) connected through `GainNode`s.

```js
const activeTracks = {};  // { trackId: { sources: [], gains: [], trackGain: GainNode, startTime: number } }

function startTrack(trackId, initialGain = 0) {
  const track = MUSIC_TRACKS[trackId];
  if (!track) return null;

  const entry = { sources: [], gains: [], trackGain: null, startTime: 0 };

  // Create per-track gain
  entry.trackGain = audioCtx.createGain();
  entry.trackGain.gain.value = initialGain;
  entry.trackGain.connect(duckGain);  // → duckGain → musicBusGain → masterGain

  // Create source + gain for each stem
  for (let i = 0; i < track.stems; i++) {
    const suffix = track.stems === 1 ? '' : '_' + String.fromCharCode(97 + i);
    const bufferKey = trackId + suffix;
    const buffer = audioBuffers[bufferKey];
    if (!buffer) { console.warn(`Buffer not loaded: ${bufferKey}`); continue; }

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.loop = track.loop;

    // Set loop points if specified
    if (track.loopStart != null) source.loopStart = track.loopStart;
    if (track.loopEnd != null)   source.loopEnd = track.loopEnd;

    const stemGain = audioCtx.createGain();
    stemGain.gain.value = (i === 0) ? 1.0 : 0.0;  // Layer A on, others off

    source.connect(stemGain);
    stemGain.connect(entry.trackGain);

    entry.sources.push(source);
    entry.gains.push(stemGain);
  }

  // Start all stems simultaneously (critical for sync)
  const startTime = audioCtx.currentTime + 0.05;  // Tiny offset for scheduling precision
  entry.sources.forEach(s => s.start(startTime));
  entry.startTime = startTime;

  activeTracks[trackId] = entry;
  return entry;
}

function stopTrack(trackId, fadeTime = 0) {
  const entry = activeTracks[trackId];
  if (!entry) return;

  if (fadeTime > 0) {
    // Fade out then stop
    const now = audioCtx.currentTime;
    entry.trackGain.gain.setValueAtTime(entry.trackGain.gain.value, now);
    entry.trackGain.gain.linearRampToValueAtTime(0, now + fadeTime);
    // Schedule stop after fade completes
    entry.sources.forEach(s => {
      try { s.stop(now + fadeTime + 0.1); } catch(e) {}
    });
    setTimeout(() => { cleanupTrack(trackId); }, (fadeTime + 0.2) * 1000);
  } else {
    // Immediate stop
    entry.sources.forEach(s => { try { s.stop(); } catch(e) {} });
    cleanupTrack(trackId);
  }
}

function cleanupTrack(trackId) {
  const entry = activeTracks[trackId];
  if (!entry) return;
  entry.sources.forEach(s => { try { s.disconnect(); } catch(e) {} });
  entry.gains.forEach(g => { try { g.disconnect(); } catch(e) {} });
  try { entry.trackGain.disconnect(); } catch(e) {}
  delete activeTracks[trackId];
}
```

### Crossfade function

```js
function crossfadeTo(newState, duration) {
  const newTrackId = stateToTrackId(newState);
  const oldTrackId = stateToTrackId(currentMusicState);

  // DEATH: hard cut — silence everything immediately
  if (newState === MusicState.DEATH) {
    Object.keys(activeTracks).forEach(id => stopTrack(id, 0));
    // 1.5s silence, then start death track
    setTimeout(() => {
      if (gameState === 'dead') {  // Still dead? Play death music
        const entry = startTrack('death', 0);
        if (entry) {
          const now = audioCtx.currentTime;
          entry.trackGain.gain.setValueAtTime(0, now);
          entry.trackGain.gain.linearRampToValueAtTime(1.0, now + 2.0);
        }
      }
    }, 1500);
    return;
  }

  crossfadeLocked = true;

  // Start new track at gain 0
  const bufferReady = audioBuffers[newTrackId] || audioBuffers[newTrackId + '_a'];
  if (!bufferReady) {
    // Track not loaded yet — load it and retry
    loadTrackStems(newTrackId).then(() => {
      crossfadeLocked = false;
      crossfadeTo(newState, duration);
    });
    return;
  }

  const newEntry = startTrack(newTrackId, 0);
  if (!newEntry) { crossfadeLocked = false; return; }

  // Ramp new track in
  const now = audioCtx.currentTime;
  newEntry.trackGain.gain.setValueAtTime(0, now);
  newEntry.trackGain.gain.linearRampToValueAtTime(1.0, now + duration);

  // Ramp old track out (if different)
  if (oldTrackId && oldTrackId !== newTrackId && activeTracks[oldTrackId]) {
    const oldEntry = activeTracks[oldTrackId];
    oldEntry.trackGain.gain.setValueAtTime(oldEntry.trackGain.gain.value, now);
    oldEntry.trackGain.gain.linearRampToValueAtTime(0, now + duration);
    // Stop old track after fade
    setTimeout(() => { stopTrack(oldTrackId, 0); }, (duration + 0.5) * 1000);
  }

  // Unlock after crossfade completes, then check for pending state
  setTimeout(() => {
    crossfadeLocked = false;
    if (pendingMusicState) {
      const pending = pendingMusicState;
      pendingMusicState = null;
      updateMusicState();  // Will re-evaluate and transition if needed
    }
  }, (duration + 0.1) * 1000);

  // Preload neighbor tracks
  if (newState.startsWith('zone_') || ['safe','green','yellow','red','void'].includes(newState)) {
    preloadNeighbors(newTrackId);
  }
}

function stateToTrackId(state) {
  const map = {
    [MusicState.TITLE]:       'title',
    [MusicState.ZONE_SAFE]:   'safe',
    [MusicState.ZONE_GREEN]:  'green',
    [MusicState.ZONE_YELLOW]: 'yellow',
    [MusicState.ZONE_RED]:    'red',
    [MusicState.ZONE_VOID]:   'void',
    [MusicState.COMBAT]:      'combat',
    [MusicState.POLICE]:      'police',
    [MusicState.DEATH]:       'death',
  };
  return map[state] || null;
}
```

### BPM-synced crossfade (optional enhancement)

For the smoothest possible transitions between tracks of different tempos, align crossfade start to the **next bar boundary** of the outgoing track:

```js
function getNextBarTime(trackId) {
  const entry = activeTracks[trackId];
  const track = MUSIC_TRACKS[trackId];
  if (!entry || !track || !track.bpm) return audioCtx.currentTime;

  const elapsed = audioCtx.currentTime - entry.startTime;
  const barDuration = (60 / track.bpm) * 4;  // 4 beats per bar
  const barsElapsed = Math.floor(elapsed / barDuration);
  const nextBarStart = entry.startTime + (barsElapsed + 1) * barDuration;

  // Don't wait more than 2 seconds for bar alignment
  return Math.min(nextBarStart, audioCtx.currentTime + 2.0);
}
```

This is an **optional enhancement** — linear crossfades at the durations specified work well enough. BPM-synced transitions are a polish step.


---

## 6. Vertical Layer Engine

Each zone track has 2-4 stems (layers A, B, C, D). Stems are pre-loaded and started simultaneously but their `stemGain` is ramped 0↔1 based on contextual signals.

### Layer mapping per track

```js
const LAYER_RULES = {
  safe: {
    // Layer A (base): always on
    a: () => 1.0,
    // Layer B (shop): near Earth or market open
    b: () => (isNearEarth() || marketOpen) ? 1.0 : 0.0,
    // Layer C (departure): moving toward zone edge
    c: () => {
      const d = dist(player, {x:0, y:0});
      return (d > 300) ? Math.min((d - 300) / 400, 1.0) : 0.0;
    },
  },
  green: {
    a: () => 1.0,
    // Layer B (mining): active mining beam
    b: () => isMining() ? 1.0 : 0.0,
    // Layer C (contact): other ship on radar
    c: () => {
      const hasContact = npcs.some(n => !n.dead && dist(n, player) < 800);
      return hasContact ? 1.0 : 0.0;
    },
  },
  yellow: {
    a: () => 1.0,
    // Layer B (threat): hostile on radar
    b: () => {
      const hasThreat = npcs.some(n => !n.dead && n.hostile && dist(n, player) < 600);
      return hasThreat ? 1.0 : 0.0;
    },
    // Layer C (combat alert): taking damage
    c: () => (performance.now() - player.lastDamageTime < 2000) ? 1.0 : 0.0,
  },
  red: {
    a: () => 1.0,
    // Layer B (den proximity): near pirate den
    b: () => isNearPirateDen() ? 1.0 : 0.0,
    // Layer C (overwhelmed): HP critical
    c: () => isHpCritical() ? 1.0 : 0.0,
  },
  void: {
    a: () => 1.0,
    // Layer B (detection): leviathan spawned
    b: () => isLeviathanActive() ? 1.0 : 0.0,
    // Layer C (pursuit): leviathan chasing
    c: () => isLeviathanPursuing() ? 1.0 : 0.0,
    // Layer D (attack): leviathan biting
    d: () => isLeviathanAttacking() ? 1.0 : 0.0,
  },
  police: {
    a: () => 1.0,
    // Layer B (active pursuit): police firing
    b: () => isPoliceChasing() ? 1.0 : 0.0,
    // Layer C (carrier): police carrier nearby
    c: () => {
      const carrierNear = policeUnits.some(p => p.isCarrier && dist(p, player) < 800);
      return carrierNear ? 1.0 : 0.0;
    },
  },
};
```

### Layer update function (runs every frame)

```js
const LAYER_FADE_SPEED = 2.0;  // Gain change per second (0→1 in 0.5s)

function updateMusicLayers(dt) {
  const trackId = stateToTrackId(currentMusicState);
  const entry = activeTracks[trackId];
  const rules = LAYER_RULES[trackId];
  if (!entry || !rules) return;

  const stemLabels = ['a', 'b', 'c', 'd'];
  for (let i = 0; i < entry.gains.length; i++) {
    const label = stemLabels[i];
    const rule = rules[label];
    if (!rule) continue;

    const targetGain = rule();
    const currentGain = entry.gains[i].gain.value;

    // Smooth ramp toward target
    if (Math.abs(currentGain - targetGain) > 0.01) {
      const step = LAYER_FADE_SPEED * dt;
      const newGain = currentGain < targetGain
        ? Math.min(currentGain + step, targetGain)
        : Math.max(currentGain - step, targetGain);
      entry.gains[i].gain.setValueAtTime(newGain, audioCtx.currentTime);
    }
  }
}
```

### Why per-frame smoothing instead of `linearRampToValueAtTime`?

For **vertical layers** (as opposed to track crossfades), per-frame smoothing is better because:
1. Layer conditions change rapidly (moving in/out of range, mining on/off)
2. We need to interrupt fades mid-way when conditions flip
3. `cancelScheduledValues()` + new ramp is more complex and less smooth than incremental blending
4. Track crossfades use `linearRamp` because they have committed duration with a lock


---

## 7. Stinger / One-Shot System

Stingers play **on top of** the current music without interrupting it. They're fire-and-forget.

```js
function playStinger(stingerId, variant = 0) {
  const track = MUSIC_TRACKS[stingerId];
  if (!track) return;

  const suffix = track.stems === 1 ? '' : '_' + String.fromCharCode(97 + variant);
  const bufferKey = stingerId + suffix;
  const buffer = audioBuffers[bufferKey];
  if (!buffer) {
    // Lazy-load and play when ready
    loadTrackStems(stingerId).then(() => playStinger(stingerId, variant));
    return;
  }

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(stingerGain);
  source.start();
  // Auto-cleanup
  source.onended = () => { try { source.disconnect(); } catch(e) {} };
}
```

### Stinger trigger points

| Stinger | Trigger Location | Variant Logic |
|---------|-----------------|---------------|
| `payday` | `sellOre()` function (~line 3600) | `amount < 500` → variant 0 (small), `< 2000` → variant 1 (med), else → variant 2 (large) |
| `hired` | Wingman hire logic (after `spawnWingman`) | Always variant 0 |
| `carrier` | Carrier purchase in upgrade menu | Always variant 0 |

### Ducking during stingers

When a stinger plays, briefly duck the music bus:

```js
function playStingerWithDuck(stingerId, variant = 0) {
  const now = audioCtx.currentTime;
  // Duck music by 40% during stinger
  duckGain.gain.setValueAtTime(1.0, now);
  duckGain.gain.linearRampToValueAtTime(0.6, now + 0.1);

  playStinger(stingerId, variant);

  // Restore after stinger duration
  const track = MUSIC_TRACKS[stingerId];
  const buffer = audioBuffers[stingerId] || audioBuffers[stingerId + '_a'];
  const dur = buffer ? buffer.duration : 3;
  duckGain.gain.setValueAtTime(0.6, now + dur - 0.5);
  duckGain.gain.linearRampToValueAtTime(1.0, now + dur);
}
```

---

## 8. Mix Bus & Ducking

### SFX ducking (music ducks when loud SFX play)

Important SFX that should duck music: `explode`, `leviathanRoar`, `death`, `leviathanBite`.

Modify the `snd()` wrapper to support ducking:

```js
const DUCKING_SFX = new Set(['explode', 'leviathanRoar', 'death', 'leviathanBite']);
const SFX_DUCK_AMOUNT = 0.4;  // Duck to 40%
const SFX_DUCK_ATTACK = 0.05; // 50ms attack
const SFX_DUCK_RELEASE = 0.5; // 500ms release

let duckTimeout = null;

function duckMusicForSFX() {
  const now = audioCtx.currentTime;
  duckGain.gain.cancelScheduledValues(now);
  duckGain.gain.setValueAtTime(duckGain.gain.value, now);
  duckGain.gain.linearRampToValueAtTime(SFX_DUCK_AMOUNT, now + SFX_DUCK_ATTACK);

  clearTimeout(duckTimeout);
  duckTimeout = setTimeout(() => {
    const t = audioCtx.currentTime;
    duckGain.gain.setValueAtTime(duckGain.gain.value, t);
    duckGain.gain.linearRampToValueAtTime(1.0, t + SFX_DUCK_RELEASE);
  }, 300);  // Hold duck for 300ms after last trigger
}
```

### Master limiter

Web Audio doesn't have a native limiter, but we can approximate with `DynamicsCompressorNode`:

```js
const limiter = audioCtx.createDynamicsCompressor();
limiter.threshold.value = -1.0;   // dBFS
limiter.knee.value = 0;
limiter.ratio.value = 20;         // Near-infinite ratio = limiting
limiter.attack.value = 0.001;
limiter.release.value = 0.1;

// Insert between masterGain and destination
masterGain.disconnect();
masterGain.connect(limiter);
limiter.connect(audioCtx.destination);
```


---

## 9. Edge Cases & Resilience

### 9.1 Rapid zone transitions (flickering)

**Problem:** Player sits on a zone boundary, rapid-fires between two zones.

**Solution:** Crossfade lock + minimum hold time.

```js
const MIN_STATE_HOLD = 2000;  // Don't transition again within 2s
let lastStateChangeTime = 0;

// In updateMusicState():
if (performance.now() - lastStateChangeTime < MIN_STATE_HOLD) {
  // Exception: death and police override the hold
  if (desired !== MusicState.DEATH && desired !== MusicState.POLICE) return;
}
```

### 9.2 Death during combat / police chase

**Problem:** Player dies while combat or police music is playing. Multiple tracks could be active.

**Solution:** `MusicState.DEATH` has highest priority and calls `stopTrack(id, 0)` on ALL active tracks before the 1.5s silence gap. No special-casing needed — the priority system handles this.

### 9.3 Police chase across zone boundaries

**Problem:** Police chase you from safe → green → yellow. Music should stay as POLICE, not flip to zone tracks.

**Solution:** `isPoliceChasing()` has priority 3, above combat (5) and zones (6). As long as any police unit has `state === 'hunt' && target === player`, police music persists regardless of zone.

### 9.4 Leviathan + death overlap

**Problem:** Leviathan kills you in the void. Need void layers D (attack) → death transition.

**Solution:** Death is priority 1. The `crossfadeTo(DEATH)` hard-cuts all tracks (including void with its layers). The 1.5s silence naturally follows the leviathan bite impact — this enhances the dread.

### 9.5 Tab backgrounding / visibility change

**Problem:** Browser suspends `AudioContext` when tab loses focus. When returning, music playback position is stale/desynced.

**Solution:**

```js
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Tab hidden — suspend audio to save resources
    if (audioCtx.state === 'running') audioCtx.suspend();
  } else {
    // Tab visible — resume and re-sync state
    audioCtx.resume().then(() => {
      // Force state re-evaluation
      const desired = resolveMusicState();
      if (desired !== currentMusicState) {
        crossfadeLocked = false;
        pendingMusicState = null;
        updateMusicState();
      }
    });
  }
});
```

### 9.6 Sound toggle (mute/unmute)

**Problem:** Player toggles sound off then on. Music should resume from correct state, not silence.

Currently `soundEnabled` toggles `masterGain.gain.value` between 0.35 and 0 (line ~4837).

**Solution:** No changes needed — `masterGain` is downstream of all music nodes. When unmuted, music resumes at correct playback position because `AudioBufferSourceNode` continues playing even when gain is 0.

### 9.7 AudioContext not yet started

**Problem:** Browsers require user gesture to start AudioContext. Music system called before gesture.

**Solution:** All music functions check `audioCtx.state`:

```js
function safeSchedule(fn) {
  if (!audioCtx || audioCtx.state === 'closed') return;
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().then(fn);
  } else {
    fn();
  }
}
```

The game already calls `resumeAudio()` on game start (line ~6208) and has click handlers for resume. Music simply won't play until context is running — no errors thrown.

### 9.8 Track not loaded when needed

**Problem:** Player enters void zone before void track is loaded.

**Solution:** `crossfadeTo()` checks if buffer exists. If not, it kicks off `loadTrackStems()` and retries. The old track continues playing during load — user hears a slightly delayed transition rather than silence.

Preloading neighbors (§2) makes this extremely unlikely after the first zone entry.

### 9.9 Multiple simultaneous stingers

**Problem:** Player sells ore and hires wingman in quick succession.

**Solution:** Stingers are independent `AudioBufferSourceNode`s — Web Audio naturally mixes them. Two stingers playing simultaneously is fine. The `duckGain` may get double-ducked briefly, but the limiter prevents clipping.

### 9.10 Respawn location

**Problem:** Respawn always returns to safe zone (Earth). Music needs to snap from death → safe.

**Solution:** `getCrossfadeDuration(DEATH, ZONE_SAFE)` returns 1.0s. On respawn (line ~6250), the next `updateMusicState()` call resolves to `ZONE_SAFE` and triggers a fast 1s crossfade from the death drone to ORBITAL.

### 9.11 Drone oscillator conflict

**Problem:** The existing `drone` oscillator system serves a similar ambient purpose to music.

**Solution:** When the music system is active (any music loaded and playing), **mute the drone oscillator** by ramping `droneGain` to 0. The music tracks already contain equivalent ambient textures per their design. If no music is loaded (fallback), the drone continues operating as-is.

```js
// In startTrack() — mute drone when music is playing
if (droneGain) {
  droneGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 2.0);
}

// If music system fails to load, re-enable drone
function fallbackToDrone() {
  if (droneGain) {
    droneGain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 1.0);
  }
}
```


---

## 10. Integration Points (Line-by-Line)

These are the exact places in `index.html` where music system code hooks in.

### 10.1 Initialization

| What | Where | Action |
|------|-------|--------|
| Create music bus nodes | `initAudio()` (~line 275) | After `masterGain` creation, add `musicBusGain`, `duckGain`, `stingerGain`, limiter |
| Load title track | `initAudio()` end | Call `loadTrackStems('title')` |
| Start title music | After `initAudio()` in page load | Call `startTrack('title', 1.0)` |

### 10.2 Game start

| What | Where | Action |
|------|-------|--------|
| Preload P1 tracks | `startGame()` (~line 6208) | `await loadTrackStems('safe'); await loadTrackStems('death');` |
| Transition title → safe | `startGame()` after load | `currentMusicState = MusicState.TITLE; updateMusicState();` |
| Mute drone | `startDrone()` || Skip `startDrone()` entirely if music loaded, OR let it start and immediately mute via `droneGain.gain.value = 0` |

### 10.3 Main game loop

| What | Where | Action |
|------|-------|--------|
| Update music state | Game loop update phase (~line 6040) | Add `updateMusicState();` |
| Update vertical layers | Game loop update phase (~line 6041) | Add `updateMusicLayers(dt);` |

These two calls should run **after** game logic (so signals are fresh) but **before** rendering.

### 10.4 Combat detection

| What | Where | Action |
|------|-------|--------|
| Track damage time | `applyDamage()` (~line 4098) | Add `player.lastDamageTime = performance.now();` |
| Initialize property | Player creation (~line 525) | Add `lastDamageTime: 0` to player object |

### 10.5 Death & respawn

| What | Where | Action |
|------|-------|--------|
| Death triggers music | `gameState = 'dead'` (~line 4098) | No hook needed — `updateMusicState()` in game loop detects `gameState === 'dead'` on next frame |
| Respawn triggers music | `gameState = 'playing'` in respawn (~line 6250) | No hook needed — same detection |

### 10.6 Stingers

| What | Where | Action |
|------|-------|--------|
| Ore sale | `sellOre()` or equivalent sell function | `playStingerWithDuck('payday', amount < 500 ? 0 : amount < 2000 ? 1 : 2);` |
| Wingman hire | After `spawnWingman()` call | `playStingerWithDuck('hired');` |
| Carrier purchase | Carrier upgrade handler | `playStingerWithDuck('carrier');` |

### 10.7 SFX ducking

| What | Where | Action |
|------|-------|--------|
| Duck on explosion | `SFX.explode()` | Add `duckMusicForSFX();` at start of function |
| Duck on leviathan roar | `SFX.leviathanRoar()` | Add `duckMusicForSFX();` at start of function |
| Duck on death | `SFX.death()` | Not needed — death hard-cuts music anyway |
| Duck on leviathan bite | `SFX.leviathanBite()` | Add `duckMusicForSFX();` at start of function |

### 10.8 Sound toggle

| What | Where | Action |
|------|-------|--------|
| Respect mute | Sound toggle handler (~line 4836) | No change needed — `masterGain` controls all audio including music |

### 10.9 Tab visibility

| What | Where | Action |
|------|-------|--------|
| Suspend/resume | Global scope | Add `visibilitychange` listener (§9.5) near other event listeners (~line 5900) |

---

## 11. File Budget & Format Matrix

### Per-track size estimates (OGG 128kbps)

| Track | Stems | Duration | Est. Size |
|-------|-------|----------|-----------|
| LAST SIGNAL (title) | 1 | 2:00 | 0.9 MB |
| ORBITAL (safe) | 3 | 3:00 | 3 × 1.4 = 4.2 MB |
| PROSPECT (green) | 3 | 3:30 | 3 × 1.6 = 4.8 MB |
| CONTESTED (yellow) | 3 | 3:00 | 3 × 1.4 = 4.2 MB |
| CONTESTED (yellow) | 3 | 3:00 | 3 × 1.4 = 4.2 MB |
| LAWLESS (red) | 3 | 3:00 | 3 × 1.4 = 4.2 MB |
| THE BREACH (void) | 4 | 4:00 | 4 × 1.8 = 7.2 MB |
| WANTED (police) | 3 | 2:00 | 3 × 0.9 = 2.7 MB |
| IRON AND FIRE (combat) | 1 | 2:30 | 1.1 MB |
| COLD DRIFT (death) | 1 | 0:30 | 0.2 MB |
| PAYDAY (stinger) | 3 | 0:05 each | 0.1 MB |
| HIRED GUN (stinger) | 1 | 0:03 | 0.02 MB |
| CARRIER LAUNCH (stinger) | 1 | 0:07 | 0.05 MB |
| **TOTAL** | | | **~29.6 MB** |

### PROBLEM: This exceeds the 8-12 MB budget significantly!

### Solutions to fit budget

**Option A — Reduce stem count (RECOMMENDED)**
- Safe, Green, Yellow, Red: Use **2 stems** instead of 3 (Layer A = base, Layer B = dynamic mix of what was B+C)
- Void: Keep 4 stems (it's the showcase moment)
- Police: Use **2 stems** (warning + full pursuit)
- Revised total: ~20 MB → still over

**Option B — Lower quality + shorter loops**
- Drop to 96 kbps VBR
- Shorten zone loops to 1:30–2:00 (they repeat anyway)
- Revised total: ~10 MB ✓

**Option C — Hybrid: single-file per zone + procedural layering**
- Ship 1 mixed stem per zone track (not separate layers)
- Use **Web Audio processing** (filters, effects) to simulate layers:
  - Layer B: Apply bandpass filter to the single track when mining/threat detected
  - Layer C: Apply distortion/LPF for critical states
- **Pros:** ~8 MB total, works well
- **Cons:** Less separation between layers

**RECOMMENDED: Option B** — shorter loops at slightly lower quality. The vast majority of players won't notice 96 vs 128 kbps on laptop/phone speakers, and 1:30 loops with seamless loop points feel identical to 3:00 loops.

### Revised budget (Option B)

| Track | Stems | Duration | Est. Size |
|-------|-------|----------|-----------|
| LAST SIGNAL | 1 | 1:30 | 0.5 MB |
| ORBITAL | 2 | 1:30 | 1.4 MB |
| PROSPECT | 2 | 1:30 | 1.4 MB |
| CONTESTED | 2 | 1:30 | 1.4 MB |
| LAWLESS | 2 | 1:30 | 1.4 MB |
| THE BREACH | 3 | 2:00 | 2.1 MB |
| WANTED | 2 | 1:00 | 0.9 MB |
| IRON AND FIRE | 1 | 1:30 | 0.7 MB |
| COLD DRIFT | 1 | 0:30 | 0.2 MB |
| Stingers (3) | 5 total | ~15s total | 0.1 MB |
| **TOTAL** | | | **~10.1 MB** ✓ |


---

## 12. Implementation Order / Milestones

### Phase 1: Foundation (Est. 2-3 hours)
**Goal:** Music plays, crossfades between zones. No stems, no layers — just one file per track.

1. Add audio graph nodes to `initAudio()` (musicBusGain, duckGain, stingerGain, limiter)
2. Implement `MUSIC_TRACKS` manifest (single-stem only — stems: 1 for everything initially)
3. Implement `loadTrackStems()`, `canPlayOgg()`, format fallback
4. Implement `startTrack()`, `stopTrack()`, `cleanupTrack()`
5. Implement `MusicState` enum, `resolveMusicState()`, `updateMusicState()`
6. Implement `crossfadeTo()` with duration lookup
7. Hook `updateMusicState()` into game loop
8. Hook `startGame()` to load P1 tracks and transition from title
9. Add `visibilitychange` handler
10. Mute drone when music active
11. **Test with placeholder tracks** — generate silent OGG files of correct duration, verify transitions fire correctly

**Deliverable:** Zone transitions work with placeholder audio. State machine correctly prioritizes death > police > combat > zone.

### Phase 2: Vertical Layers (Est. 1-2 hours)
**Goal:** Multi-stem tracks with dynamic layer activation.

1. Update manifest to multi-stem where applicable
2. Implement `LAYER_RULES` for each track
3. Implement `updateMusicLayers(dt)` with smooth ramping
4. Add `player.lastDamageTime` tracking
5. Add signal functions (`isPoliceChasing`, `isLeviathanActive`, etc.)
6. Hook `updateMusicLayers(dt)` into game loop after `updateMusicState()`
7. **Test:** Verify layers fade in/out based on proximity, combat, mining

**Deliverable:** Each zone track responds dynamically to gameplay context.

### Phase 3: Stingers & Ducking (Est. 1 hour)
**Goal:** One-shot jingles and SFX ducking.

1. Implement `playStinger()` and `playStingerWithDuck()`
2. Hook stinger triggers into sell, hire, carrier purchase
3. Implement `duckMusicForSFX()` 
4. Add ducking calls to `SFX.explode`, `SFX.leviathanRoar`, `SFX.leviathanBite`
5. **Test:** Verify stingers overlay correctly, music ducks during explosions

**Deliverable:** Full music system feature-complete with placeholder audio.

### Phase 4: Real Audio Assets (Est. variable)
**Goal:** Replace placeholders with actual composed tracks.

1. Compose/source tracks per `SOUNDTRACK_DESIGN.md` specs
2. Encode to OGG Vorbis 96kbps VBR + MP3 128kbps fallback
3. Set precise `loopStart` / `loopEnd` values per track
4. Normalize all tracks to -1 dBFS peak, -14 LUFS integrated
5. Verify total file size ≤ 12 MB
6. Test on multiple browsers (Chrome, Firefox, Safari, mobile Safari, Chrome Android)

**Deliverable:** Ship-ready dynamic soundtrack.

### Phase 5: Polish (Est. 1-2 hours)
**Goal:** BPM-synced transitions, fine-tuning.

1. Implement optional BPM-synced crossfade (bar-aligned transitions)
2. Fine-tune crossfade durations based on playtesting
3. Fine-tune layer fade speeds per track
4. Add `AnalyserNode` for optional visual music reactivity (asteroid pulse, etc.)
5. Performance profiling — ensure music system adds < 1ms per frame
6. Final QA on all edge cases from §9

**Deliverable:** Polished, production-quality dynamic music system.

---

## Appendix A: Testing Checklist

### State transitions to verify

- [ ] Menu → Start → Safe zone music plays
- [ ] Safe → Green → Yellow → Red → Void (forward zone progression)
- [ ] Void → Red → Yellow → Green → Safe (backward zone progression)
- [ ] Any zone → Combat (engage enemy) → back to zone (5s after last shot)
- [ ] Safe zone → Mark aggressor → Police warning (Layer A) → Police chase (Layer B)
- [ ] Police chase → Escape → Zone music resumes
- [ ] Police chase → Death → Silence → Death music
- [ ] Combat → Death → Silence → Death music
- [ ] Death → Respawn → Safe zone music (1s fade)
- [ ] Void → Leviathan spawn (Layer B) → Chase (Layer C) → Bite (Layer D)
- [ ] Void → Leviathan kills player → Death
- [ ] Sell ore (small/medium/large stingers)
- [ ] Hire wingman stinger
- [ ] Buy carrier stinger
- [ ] Rapid zone boundary crossing (no flickering)
- [ ] Tab away → Tab back (music resumes correct state)
- [ ] Sound toggle off → on (music continues from correct position)
- [ ] Stinger during crossfade (should overlay cleanly)
- [ ] Two stingers simultaneously (sell + hire)
- [ ] Death during stinger playback

### Performance targets

- [ ] Music system update: < 0.5ms per frame
- [ ] Memory: < 50 MB for all decoded audio buffers
- [ ] Initial load (title track only): < 500ms on 4G
- [ ] No audio glitches/clicks on zone transition
- [ ] No memory leaks (tracks properly cleaned up after stop)

---

## Appendix B: File Structure

```
void-claim/
├── index.html                    (game + music system code)
├── snd/
│   ├── last_signal.ogg          (title)
│   ├── last_signal.mp3
│   ├── orbital_a.ogg            (safe - base)
│   ├── orbital_a.mp3
│   ├── orbital_b.ogg            (safe - dynamic layer)
│   ├── orbital_b.mp3
│   ├── prospect_a.ogg           (green - base)
│   ├── prospect_a.mp3
│   ├── prospect_b.ogg           (green - dynamic layer)
│   ├── prospect_b.mp3
│   ├── contested_a.ogg          (yellow - base)
│   ├── contested_a.mp3
│   ├── contested_b.ogg          (yellow - dynamic layer)
│   ├── contested_b.mp3
│   ├── lawless_a.ogg            (red - base)
│   ├── lawless_a.mp3
│   ├── lawless_b.ogg            (red - dynamic layer)
│   ├── lawless_b.mp3
│   ├── the_breach_a.ogg         (void - base drone)
│   ├── the_breach_a.mp3
│   ├── the_breach_b.ogg         (void - detection pulse)
│   ├── the_breach_b.mp3
│   ├── the_breach_c.ogg         (void - pursuit layer)
│   ├── the_breach_c.mp3
│   ├── wanted_a.ogg             (police - warning)
│   ├── wanted_a.mp3
│   ├── wanted_b.ogg             (police - pursuit)
│   ├── wanted_b.mp3
│   ├── iron_and_fire.ogg        (combat)
│   ├── iron_and_fire.mp3
│   ├── cold_drift.ogg           (death)
│   ├── cold_drift.mp3
│   ├── payday_a.ogg             (stinger - small sale)
│   ├── payday_a.mp3
│   ├── payday_b.ogg             (stinger - medium sale)
│   ├── payday_b.mp3
│   ├── payday_c.ogg             (stinger - large sale)
│   ├── payday_c.mp3
│   ├── hired_gun.ogg            (stinger - wingman)
│   ├── hired_gun.mp3
│   ├── carrier_launch.ogg       (stinger - carrier)
│   └── carrier_launch.mp3
├── SOUNDTRACK_DESIGN.md
└── MUSIC_IMPLEMENTATION_PLAN.md  (this document)
```

**Total files:** 34 audio files (17 OGG + 17 MP3)
**Total estimated size:** ~10 MB (OGG) + ~12 MB (MP3) = ~22 MB repo, but only one format is loaded at runtime (~10 MB)

---

## Appendix C: Quick Reference — The Full Update Loop

```js
// Called every frame in game loop, after game logic, before render
function updateMusic(dt) {
  if (!audioCtx || audioCtx.state !== 'running') return;
  if (!soundEnabled) return;

  updateMusicState();       // Crossfade between tracks (§4-5)
  updateMusicLayers(dt);    // Fade stems in/out (§6)
}
```

Two function calls per frame. That's it.
