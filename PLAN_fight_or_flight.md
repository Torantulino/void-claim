# Implementation Plan: Miner Fight-or-Flight Response System

## Problem Statement

Currently, miner NPCs completely ignore incoming attacks until their HP drops below `fleeHP` (25%), at which point they simply head to Earth to heal. This creates a lifeless, unreactive feel — miners behave like oblivious asteroids rather than living entities with a survival instinct.

## Goal

Give miners a **reactive, personality-driven fight-or-flight system** that triggers the moment they take damage, creating dramatic emergent gameplay moments. The system should make every pirate ambush feel alive — with some miners panicking and fleeing, some fighting back, some dropping cargo to appease attackers, and the best creating tense standoff moments.

## Codebase Context

### Key Files & Functions
- **Single file**: `index.html` (~9500 lines)
- **`npcThink(n)`** (line 3534): Main NPC decision tree. Miners only check `hpPct < n.fleeHP` for flee behavior
- **`npcAct(n, dt)`** (line 3802): State machine executing NPC actions (mine, attack, flee, sell, etc.)
- **`applyDamage(target, dmg, attackerId)`** (line 6204): Damage application — sets `lastDamageTime` but does NOT set `lastAttacker` or trigger any NPC reaction
- **`createNPC(npcIndex)`** (line 2667): Creates miners with `personality:'miner'`, `greed` (0-1), `fleeHP:.25`
- **`fireProjectile(entity)`** (line 4184): Projectile creation

### Key Observations
1. **`lastAttacker` is never set** — it's referenced once (line 3561) for pirate flee direction but never assigned anywhere in `applyDamage` or the projectile hit code
2. Miners have a `greed` stat (0=cautious, 1=reckless) that already drives mining zone choice and cargo return thresholds — perfect for reuse as a bravery/fight proxy
3. Miners progress through ship tiers: `prospector → hauler → sentinel`. Sentinels have 200 hull and 80 shield — these upgraded miners should genuinely fight back
4. The `stunTimer` mechanic already exists on all entities
5. The `dropCargoAndSalvage()` function exists for death — we can create a lighter "jettison partial cargo" variant
6. SFX infrastructure is rich — `SFX.shieldHit()`, `SFX.hit()`, `emitBurst()`, `addFloatingText()`, `notify()` all available
7. Pirates already have sophisticated flee behavior (`fleeToSecondDen`, `fleeToWild`) we can learn from

## Design

### Core Concept: Personality-Driven Threat Response

When a miner takes damage, they enter a **threat assessment** phase that produces one of four responses based on their personality, ship class, HP, cargo value, and who's attacking them:

| Response | Trigger Conditions | Behavior |
|----------|-------------------|----------|
| **PANIC FLEE** | Low greed, weak ship, heavy cargo | Drop partial cargo, speed boost away from attacker toward Earth/safe zone |
| **EVASIVE FLEE** | Medium greed, any ship, moderate HP | Dodge/jink while fleeing, no cargo drop, head to Earth |
| **FIGHT BACK** | High greed OR strong ship (sentinel), high HP | Turn and return fire while slowly retreating |
| **CARGO DUMP** | Any greed, very heavy cargo, attacker is pirate NPC | Jettison some cargo as "bait" then flee while pirate collects it |

### New NPC Properties (added to `createNPC`)

```javascript
// Fight-or-flight system
lastAttacker: null,        // Entity reference of last attacker
lastAttackTime: 0,         // Timestamp of last incoming hit
threatLevel: 0,            // Accumulated threat (0-1), decays over time  
combatResponse: null,      // Current response: 'panicFlee','evasiveFlee','fightBack','cargoDump'
combatResponseTimer: 0,    // How long current response has been active
threatCooldown: 0,         // Cooldown before re-evaluating threat
_fleeFromX: 0,            // Attacker position for flee direction
_fleeFromY: 0,
```

### Implementation Steps

#### Step 1: Track `lastAttacker` in damage pipeline

**Where**: Projectile hit detection (~line 5951-6034) and `applyDamage()` (~line 6204)

In the projectile collision code, after finding the attacker entity, store it on the target:

```javascript
// In the projectile hit section, after aggression checks:
if(t.isNPC && t.personality === 'miner') {
  t.lastAttacker = attacker;
  t.lastAttackTime = performance.now();
  t._fleeFromX = attacker ? attacker.x : p.x;
  t._fleeFromY = attacker ? attacker.y : p.y;
}
```

#### Step 2: Threat Assessment Function

**Where**: New function, placed after `npcThink()` (~line 3711)

```javascript
function minerThreatAssess(n) {
  // Only for miners currently not in a combat response
  if(n.personality !== 'miner') return null;
  if(!n.lastAttacker || n.lastAttacker.dead) return null;
  
  const timeSinceHit = (performance.now() - n.lastAttackTime) / 1000;
  if(timeSinceHit > 8) { // Threat expires after 8 seconds with no hits
    n.lastAttacker = null;
    n.threatLevel = 0;
    return null;
  }
  
  // Build threat score from multiple factors
  const hpPct = n.hp / n.maxHp;
  const shieldPct = n.shield / n.maxShield;
  const cargoPct = totalCargo(n.cargo) / maxCargo(n);
  const cargoVal = cargoValue(n.cargo);
  const g = n.greed || 0; // 0=cautious, 1=reckless
  
  // Ship power assessment
  const shipPower = { prospector: 0.3, hauler: 0.2, sentinel: 0.9 };
  const myPower = (shipPower[n.ship] || 0.3) + (n.upgrades?.laser || 0) * 0.1;
  
  // Attacker power estimate
  const attackerShipPower = n.lastAttacker.ship ? (shipPower[n.lastAttacker.ship] || 0.5) : 0.5;
  const powerRatio = myPower / Math.max(attackerShipPower, 0.1);
  
  // Attacker is pirate NPC? (cargo dump viable)
  const attackerIsPirateNPC = n.lastAttacker.isNPC && 
    (n.lastAttacker.personality === 'pirate' || n.lastAttacker.personality === 'denPirate');
  
  // Decision matrix
  // FIGHT BACK: brave + strong + healthy
  if(g > 0.7 && myPower > 0.6 && hpPct > 0.5 && shieldPct > 0.3) {
    return 'fightBack';
  }
  // Sentinels always fight if healthy (they're combat ships)
  if(n.ship === 'sentinel' && hpPct > 0.4) {
    return 'fightBack';
  }
  
  // CARGO DUMP: has significant cargo + attacked by pirate NPC (bait strategy)
  if(attackerIsPirateNPC && cargoPct > 0.3 && cargoVal > 50) {
    return 'cargoDump';
  }
  
  // PANIC FLEE: cautious + weak + has cargo to lose
  if(g < 0.4 && hpPct < 0.7) {
    return 'panicFlee';
  }
  
  // EVASIVE FLEE: default for everyone else
  return 'evasiveFlee';
}
```

#### Step 3: Integrate into `npcThink()`

**Where**: `npcThink()` function, right after the denPirate early return (line 3543), BEFORE the existing `hpPct < fleeHP` check

```javascript
// ── Miner fight-or-flight: react to incoming attacks ──
if(n.personality === 'miner' && n.lastAttacker && !n.lastAttacker.dead) {
  const timeSinceHit = (performance.now() - (n.lastAttackTime || 0)) / 1000;
  
  // Threat active within last 8 seconds
  if(timeSinceHit < 8) {
    // Don't re-assess if already in a combat response and it's working
    if(n.combatResponse && timeSinceHit < 3) {
      return; // Stay committed to current response for at least 3 seconds
    }
    
    const response = minerThreatAssess(n);
    if(response) {
      n.combatResponse = response;
      n.combatResponseTimer = 0;
      
      switch(response) {
        case 'panicFlee':
          n.state = 'panicFlee';
          n.target = null;
          break;
        case 'evasiveFlee':
          n.state = 'evasiveFlee';
          n.target = null;
          break;
        case 'fightBack':
          n.state = 'fightBack';
          n.target = n.lastAttacker;
          break;
        case 'cargoDump':
          n.state = 'cargoDump';
          n.target = null;
          break;
      }
      return;
    }
  } else {
    // Threat expired — clear combat state
    n.lastAttacker = null;
    n.combatResponse = null;
  }
}
```

#### Step 4: New NPC States in `npcAct()`

**Where**: Inside the `switch(n.state)` in `npcAct()` (~line 3806), add new cases before the `default` case

```javascript
case 'panicFlee': {
  // Panic! Drop some cargo, speed burst away from attacker toward Earth
  // One-time cargo jettison on entering state
  if(!n._panicDropped) {
    n._panicDropped = true;
    const tc = totalCargo(n.cargo);
    if(tc > 0) {
      // Drop ~40% of cargo as panic loot
      const dropAmt = Math.max(1, Math.floor(tc * 0.4));
      jettisoncargo(n, dropAmt);
      // Visual + text feedback
      const near = distToPlayer(n.x, n.y) < FX_RANGE;
      if(near) {
        addFloatingText(n.x, n.y - 20, '😱 PANIC!', '#ffaa00', 1.5);
        emitBurst(n.x, n.y, 8, 80, 'rgba(255,170,0,.7)', 2, 0.4, 6);
      }
    }
  }
  // Flee toward Earth at boosted speed (panic adrenaline)
  moveToward(n, 0, 0, thrust * 1.4, dt);
  // Add slight random jitter (panicking, not flying straight)
  n.vx += (Math.random() - 0.5) * thrust * 0.3 * dt;
  n.vy += (Math.random() - 0.5) * thrust * 0.3 * dt;
  // If reached safe zone, calm down
  if(dist(n.x, n.y, 0, 0) < CFG.EARTH_SHIELD_R) {
    n.state = 'sell';
    n.combatResponse = null;
    n._panicDropped = false;
  }
  // If threat gone for 5+ seconds, calm down and resume
  const panicAge = (performance.now() - (n.lastAttackTime || 0)) / 1000;
  if(panicAge > 5) {
    n.state = 'idle';
    n.combatResponse = null;
    n._panicDropped = false;
  }
  break;
}

case 'evasiveFlee': {
  // Skilled evasion — zigzag pattern while heading toward Earth
  const fleeAngle = angle(n._fleeFromX || 0, n._fleeFromY || 0, n.x, n.y);
  // Primary: move away from attacker (toward Earth-ish)
  const earthAngle = angle(n.x, n.y, 0, 0);
  // Blend: 60% toward Earth, 40% away from attacker
  const blendAngle = earthAngle * 0.6 + fleeAngle * 0.4;
  
  // Zigzag: sinusoidal offset perpendicular to flee direction
  n.combatResponseTimer = (n.combatResponseTimer || 0) + dt;
  const zigzag = Math.sin(n.combatResponseTimer * 4) * thrust * 0.5;
  const perpAngle = blendAngle + Math.PI / 2;
  
  n.vx += (Math.cos(blendAngle) * thrust * 1.1 + Math.cos(perpAngle) * zigzag) * dt;
  n.vy += (Math.sin(blendAngle) * thrust * 1.1 + Math.sin(perpAngle) * zigzag) * dt;
  n.angle = blendAngle;
  
  // Visual: occasional thruster particles
  if(Math.random() < 0.15) {
    const near = distToPlayer(n.x, n.y) < FX_RANGE;
    if(near) emitBurst(n.x, n.y, 2, 40, 'rgba(100,200,255,.5)', 1, 0.2, 3);
  }
  
  // If reached safe zone, done
  if(dist(n.x, n.y, 0, 0) < CFG.EARTH_SHIELD_R) {
    n.state = 'sell';
    n.combatResponse = null;
  }
  // Threat timeout
  const evasiveAge = (performance.now() - (n.lastAttackTime || 0)) / 1000;
  if(evasiveAge > 8) {
    n.state = 'idle';
    n.combatResponse = null;
  }
  break;
}

case 'fightBack': {
  // Stand and fight! Target the attacker, return fire while slowly retreating
  if(!n.target || n.target.dead) {
    n.state = 'idle';
    n.combatResponse = null;
    break;
  }
  const d = dist(n.x, n.y, n.target.x, n.target.y);
  
  // One-time "fight" callout
  if(!n._fightCallout) {
    n._fightCallout = true;
    const near = distToPlayer(n.x, n.y) < FX_RANGE;
    if(near) {
      addFloatingText(n.x, n.y - 20, '⚔️ ENGAGING!', '#ff4444', 1.3);
    }
  }
  
  // Close range: strafe and shoot
  if(d < 350) {
    n.angle = angle(n.x, n.y, n.target.x, n.target.y);
    if(n.shootCD <= 0) { fireProjectile(n); n.shootCD = shipFireRate(n) * 1.2; }
    // Orbit-strafe the attacker
    const strafeA = n.angle + Math.PI / 2;
    n.vx += Math.cos(strafeA) * thrust * 0.4 * dt;
    n.vy += Math.sin(strafeA) * thrust * 0.4 * dt;
    // Slowly back away toward Earth
    const earthDir = angle(n.x, n.y, 0, 0);
    n.vx += Math.cos(earthDir) * thrust * 0.15 * dt;
    n.vy += Math.sin(earthDir) * thrust * 0.15 * dt;
  } else {
    // Too far — close distance to engage
    moveToward(n, n.target.x, n.target.y, thrust * 0.8, dt);
  }
  
  // Disengage if HP gets low (override to flee)
  const hpPct = n.hp / n.maxHp;
  if(hpPct < n.fleeHP + 0.1) { // Slightly higher threshold than normal flee
    n.state = 'evasiveFlee';
    n.combatResponse = 'evasiveFlee';
    n._fightCallout = false;
  }
  // Disengage if attacker fled
  if(d > 800) {
    n.state = 'idle';
    n.combatResponse = null;
    n._fightCallout = false;
  }
  break;
}

case 'cargoDump': {
  // Strategic: drop some cargo as bait, then flee while pirate collects it
  if(!n._cargoDumped) {
    n._cargoDumped = true;
    const tc = totalCargo(n.cargo);
    if(tc > 0) {
      // Drop ~30% of cargo toward the attacker as bait
      const dropAmt = Math.max(1, Math.floor(tc * 0.3));
      const baitX = n.lastAttacker ? (n.x + n.lastAttacker.x) / 2 : n.x;
      const baitY = n.lastAttacker ? (n.y + n.lastAttacker.y) / 2 : n.y;
      jettisonCargoAt(n, dropAmt, baitX, baitY);
      const near = distToPlayer(n.x, n.y) < FX_RANGE;
      if(near) {
        addFloatingText(n.x, n.y - 20, '📦 TAKE IT!', '#ffcc00', 1.3);
      }
    }
  }
  // Flee away from attacker (not necessarily toward Earth — just AWAY)
  const fleeA = n.lastAttacker ? 
    angle(n.lastAttacker.x, n.lastAttacker.y, n.x, n.y) : 
    angle(n.x, n.y, 0, 0);
  moveToward(n, n.x + Math.cos(fleeA) * 500, n.y + Math.sin(fleeA) * 500, thrust * 1.2, dt);
  
  // After 6 seconds or safe distance, resume normal
  const dumpAge = (performance.now() - (n.lastAttackTime || 0)) / 1000;
  const safeFromAttacker = !n.lastAttacker || n.lastAttacker.dead || 
    dist(n.x, n.y, n.lastAttacker.x, n.lastAttacker.y) > 600;
  if(dumpAge > 6 || safeFromAttacker) {
    n.state = 'idle';
    n.combatResponse = null;
    n._cargoDumped = false;
  }
  break;
}
```

#### Step 5: Cargo Jettison Helper Functions

**Where**: New functions, placed near `dropCargoAndSalvage()` (~line 6167)

```javascript
// Jettison a portion of cargo as loot drops (panic/bait mechanic)
function jettisonCargo(entity, amount) {
  jettisonCargoAt(entity, amount, entity.x, entity.y);
}

function jettisonCargoAt(entity, amount, dropX, dropY) {
  const cargo = entity.cargo;
  if(!cargo || totalCargo(cargo) === 0) return;
  
  let remaining = amount;
  const entries = Object.entries(cargo).filter(([,v]) => v > 0);
  // Shuffle to randomize which ores get dropped
  entries.sort(() => Math.random() - 0.5);
  
  const dropCargo = {};
  for(const [ore, amt] of entries) {
    if(remaining <= 0) break;
    const take = Math.min(amt, remaining);
    dropCargo[ore] = take;
    cargo[ore] -= take;
    if(cargo[ore] <= 0) delete cargo[ore];
    remaining -= take;
  }
  
  if(totalCargo(dropCargo) > 0) {
    // Create 1-3 scattered loot drops
    const numDrops = Math.min(totalCargo(dropCargo), randInt(1, 3));
    const items = [];
    Object.entries(dropCargo).forEach(([ore, amt]) => {
      for(let i = 0; i < amt; i++) items.push(ore);
    });
    
    let idx = 0;
    for(let d = 0; d < numDrops; d++) {
      const dc = {};
      const take = d === numDrops - 1 ? items.length - idx : 
        Math.max(1, Math.ceil((items.length - idx) / (numDrops - d)));
      for(let t = 0; t < take && idx < items.length; t++, idx++) {
        dc[items[idx]] = (dc[items[idx]] || 0) + 1;
      }
      if(totalCargo(dc) <= 0) continue;
      const ang = rand(0, Math.PI * 2);
      const spd = rand(30, 80);
      // Bias velocity toward drop target position
      const biasAngle = angle(entity.x, entity.y, dropX, dropY);
      const vx = Math.cos(biasAngle) * spd * 0.5 + Math.cos(ang) * spd * 0.5;
      const vy = Math.sin(biasAngle) * spd * 0.5 + Math.sin(ang) * spd * 0.5;
      const l = createLoot(entity.x, entity.y, dc, vx, vy);
      if(l) loot.push(l);
    }
  }
}
```

#### Step 6: Reset Combat State on Death/Respawn

**Where**: In `serverRespawnNPC()` (~line 3371) and the respawn block (~line 3487)

```javascript
// Add to respawn reset:
n.lastAttacker = null;
n.lastAttackTime = 0;
n.combatResponse = null;
n.combatResponseTimer = 0;
n._panicDropped = false;
n._cargoDumped = false;
n._fightCallout = false;
```

#### Step 7: Sync-safe property handling

**Where**: NPC sync code (~line 2860, ~line 2908)

The `combatResponse` state and `lastAttacker` are local-only (host-computed). They don't need to be synced to non-host clients since only the NPC host runs `npcThink()`. However, `n.state` IS synced, so the new state names ('panicFlee', 'evasiveFlee', 'fightBack', 'cargoDump') will be transmitted and the `npcAct()` switch on remote clients will just fall into the `default` wander case, which is fine — the position/velocity sync handles the actual movement visual.

No sync changes needed.

## Testing Scenarios

1. **Cautious miner (low greed) in prospector gets attacked by pirate**: Should PANIC FLEE — drop cargo, zigzag to Earth
2. **Greedy miner (high greed) in sentinel gets attacked by player**: Should FIGHT BACK — return fire, strafe, slowly retreat
3. **Medium miner with cargo attacked by pirate NPC**: Should CARGO DUMP — drop bait, flee while pirate collects
4. **Miner attacked but attacker dies/leaves**: Threat should timeout after 8 seconds, miner resumes mining
5. **Miner in fightBack mode HP gets low**: Should transition to evasiveFlee

## Risk Assessment

- **Low risk**: All changes are additive — new states, new function, new properties. No existing behavior is removed.
- **Sync safety**: New states gracefully degrade on non-host clients (fall into default wander, position synced via velocity).
- **Performance**: `minerThreatAssess()` is only called when a miner has an active `lastAttacker`, and only during `npcThink()` which already runs on a timer. No per-frame cost for peaceful miners.
- **Balance**: Cargo jettison percentages (30-40%) are tuned to be meaningful but not devastating. The 8-second threat timeout prevents permanent flee states.
