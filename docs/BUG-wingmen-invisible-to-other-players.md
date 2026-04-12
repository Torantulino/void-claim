# 🐛 BUG: Wingmen Invisible to Other Players

**Severity:** High — breaks core multiplayer feature  
**Component:** SpacetimeDB wingman sync pipeline  
**Status:** Root cause confirmed, fix not yet applied  
**Filed:** 2026-04-12  

---

## Summary

Other players cannot see your wingmen. The wingman table in SpacetimeDB is never populated for wingmen restored from a localStorage save, and even freshly hired wingmen disappear from the server on page reload.

---

## Steps to Reproduce

1. Player A connects to the game, buys a Carrier ship, and hires 3 wingmen
2. Player A refreshes the page (wingmen are restored from localStorage save)
3. Player B connects and flies near Player A
4. **Expected:** Player B sees Player A's 3 wingmen flying in formation
5. **Actual:** Player B sees Player A's ship but no wingmen

### Alternate reproduction (fresh hire):
1. Player A hires a wingman → Player B sees it ✅ (works for this session)
2. Player A refreshes the page
3. Player B no longer sees the wingman ❌

---

## Root Cause

**`spawnWingman` reducer is only called in one code path — `hireWingman()` (line 1448).** Wingmen restored from localStorage are created via `createWingman()` but never registered with SpacetimeDB.

### Detailed Trace

#### The working path (hiring a new wingman):
```
hireWingman(type)
  → createWingman(type)           // creates local wingman object
  → wingmen.push(w)              // adds to local array
  → stdbConn.reducers.spawnWingman({...})  // ✅ inserts row in server DB
  → syncWingmenToServer() at 10Hz         // ✅ updates position/HP in server DB
  → Other clients receive onInsert → remoteWingmanMap populated → rendered ✅
```

#### The broken path (restoring from save):
```
startGame(name, color, saved)
  → saved.wingmenTypes.forEach(wType => {
      wingmen.push(createWingman(wType))   // creates local wingman objects
    })
  // ❌ spawnWingman reducer is NEVER called
  // ❌ No server row exists for these wingmen

  → connectSTDB()                          // connects to SpacetimeDB
  → syncWingmenToServer() at 10Hz          // calls updateWingman reducer
    → server: ctx.db.wingman.id.find(id)   // returns null — row doesn't exist
    → server: if (!wm) return;             // ❌ silently no-ops
```

### Why `syncWingmenToServer` doesn't help

The `update_wingman` reducer (server-side, line 911 of `spacetimedb/src/index.ts`) does:

```typescript
const wm = ctx.db.wingman.id.find(args.wingman_id);
if (!wm) return;  // Row doesn't exist → silent no-op
```

Since `spawnWingman` was never called, the row doesn't exist, so every `updateWingman` call silently fails.

---

## Affected Code Locations

| File | Line(s) | Description |
|------|---------|-------------|
| `index.html` | 1436-1454 | `hireWingman()` — only place `spawnWingman` is called |
| `index.html` | 1448-1451 | The actual `spawnWingman` reducer call |
| `index.html` | 5867-5871 | Save restore path — creates wingmen without server sync |
| `index.html` | 1998-2012 | `syncWingmenToServer()` — calls `updateWingman` (no-ops if row missing) |
| `index.html` | 4951-4967 | `stdbJoinGame()` — does NOT sync wingmen |
| `index.html` | 4832-4841 | `onInsert` handler — correctly populates `remoteWingmanMap` (never fires because row never created) |
| `spacetimedb/src/index.ts` | 852-895 | `spawn_wingman` reducer — inserts wingman row |
| `spacetimedb/src/index.ts` | 898-929 | `update_wingman` reducer — requires existing row (line 912: `if (!wm) return`) |

---

## Pipeline Diagram

```
                    WORKING (hire)                    BROKEN (save restore)
                    ─────────────                     ────────────────────
                          │                                   │
                   hireWingman()                     startGame(saved)
                          │                                   │
                   createWingman()                    createWingman()
                          │                                   │
                   wingmen.push(w) ✅                 wingmen.push(w) ✅
                          │                                   │
              spawnWingman reducer ✅                    (nothing) ❌
                          │                                   │
                Server inserts row ✅              No server row exists ❌
                          │                                   │
              updateWingman at 10Hz ✅           updateWingman → find() = null ❌
                          │                                   │
           Other clients' onInsert ✅            Other clients get nothing ❌
                          │                                   │
              remoteWingmanMap ✅                 remoteWingmanMap empty ❌
                          │                                   │
              drawShipEntity renders ✅           Nothing to render ❌
```

---

## Proposed Fix

After SpacetimeDB connects and subscriptions are applied (inside `onApplied` or after `stdbJoinGame`), call `spawnWingman` for each existing local wingman:

```javascript
// In onApplied callback or stdbJoinGame:
function syncExistingWingmenToServer() {
  if (!stdbConn || !stdbConnected || wingmen.length === 0) return;
  wingmen.forEach(w => {
    if (w.dead) return;
    try {
      stdbConn.reducers.spawnWingman({
        wingmanId: w.id,
        name: w.name,
        ship: w.ship,
        color: w.color,
        wmType: w.wmType,
        hp: w.hp,
        maxHp: w.maxHp,
        shield: w.shield,
        maxShield: w.maxShield
      });
    } catch (e) {
      console.warn('[STDB] syncExistingWingmen spawnWingman failed:', e);
    }
  });
  console.log('[STDB] Synced', wingmen.filter(w => !w.dead).length, 'existing wingmen to server');
}
```

**Best placement:** Inside the `onApplied` callback (around line 4888), right after `stdbJoinGame()`:

```javascript
stdbJoinGame();
syncExistingWingmenToServer();  // ← ADD THIS
```

This ensures:
- Wingmen restored from save are registered with the server
- Works for both fresh sessions and reconnections
- The `spawnWingman` reducer's delete-before-insert pattern handles duplicates safely
- Other clients will receive `onInsert` callbacks and render the wingmen

### Edge cases to handle:
1. **Duplicate spawn on reconnect:** Safe — `spawnWingman` deletes existing row before re-inserting
2. **Wingman dies between save and restore:** Dead wingmen should be skipped (`if (w.dead) return`)
3. **Player changes ship from carrier:** Wingmen are cleared on ship change, so `wingmen.length === 0`

---

## Verification Plan

1. Player A: Start game → buy Carrier → hire 3 wingmen → refresh page
2. Player B: Connect and fly to Player A's location
3. Verify Player B sees 3 wingmen around Player A
4. Player A: Fly around, verify wingmen follow (positions update for Player B)
5. Player A: Kill a wingman → verify it disappears for Player B
6. Player A: Disconnect → verify wingmen are cleaned up for Player B

---

## Related Systems (confirmed working)

- ✅ `onInsert` / `onUpdate` / `onDelete` callbacks correctly handle remote wingmen
- ✅ `remoteWingmanMap` populates and renders correctly when rows exist
- ✅ `drawShipEntity` renders wingmen with correct ship hull, color, and position
- ✅ `subscribeToAllTables()` includes the wingman table
- ✅ Bindings IIFE correctly maps field names (camelCase ↔ snake_case)
- ✅ Identity comparison (`ownerIdentityHex !== myHex`) correctly filters own vs remote
- ✅ Interpolation and position updates work for remote wingmen
