<div align="center">

# 🚀 VOID CLAIM

*Mine. Steal. Survive.*

<br>

[![Play Now](https://img.shields.io/badge/▶_PLAY_NOW-torantulino.github.io/void--claim-4488ff?style=for-the-badge&logo=rocket&logoColor=white&labelColor=0a0a2e)](https://torantulino.github.io/void-claim/)

<br>

[![Built with AutoGPT AutoPilot](https://img.shields.io/badge/built_with-AutoGPT_AutoPilot-44ff88?style=flat-square&labelColor=0a0a2e)](https://autogpt.com)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-zero-ffcc44?style=flat-square&labelColor=0a0a2e)](.)
[![Vibe Jam 2026](https://img.shields.io/badge/Vibe_Jam-2026-bb66ff?style=flat-square&labelColor=0a0a2e)](https://vibej.am/2026/)
[![Lines of Code](https://img.shields.io/badge/lines-2100-5588ff?style=flat-square&labelColor=0a0a2e)](.)

</div>

---

## The Story

This entire game was built by AI in a single conversation.

One person said *"multiplayer asteroid mining with piracy."* An AI designed every mechanic — ship abilities, sound design, kill streaks, an economy, a leaderboard — wrote every line of code, and deployed it live. No frameworks. No build step. No loading screens. Just 1,860 lines of raw HTML, CSS, and JavaScript in a single file.

The result: a game about greed, risk, and split-second decisions in the vacuum of space.

## What Is This?

**VOID CLAIM** is a real-time asteroid mining game where every second in space is a gamble.

You pilot a mining ship. You start safe, orbiting Earth. But the valuable ore? It's out there — past the safe zone, past the pirates, deep in the void where nobody can help you.

**The core tension:** Stay longer mining = more ore = more money. But also more risk that someone takes everything from you. Every run is a bet. *One more asteroid. One more haul. Just one more...*

## How to Play

- **WASD** — fly your ship
- **Mouse** — aim · **Click** — shoot (or mine when near an asteroid)
- **E** — activate ship ability
- **M** — open market at Earth
- Bring ore back to Earth to auto-sell
- Buy upgrades and new ships
- Don't die with a full cargo hold

## What's Inside

### 🎮 Gameplay
- **4 danger zones** — Green (safe), Yellow (PvP), Red (dangerous), The Void (💀)
- **7 ore types** — Iron to Voidstone, worth 1 to 200 credits each
- **5 ship classes** with unique abilities
- **5 upgrade paths** — Engine, Laser, Shields, Cargo, Scanner (Mk I → V)
- **Bounty system** — Grief a peaceful miner, get a skull on the map
- **Kill streak system** — Double Kill, Triple Kill, Rampage, GODLIKE
- **Persistent leaderboard** — compete for the top

### 🚀 Ships & Abilities (press E)
| Ship | Ability | Description |
|------|---------|-------------|
| **Prospector** | ⚡ EMP Pulse | Stuns nearby enemies for 2 seconds |
| **Hauler** | 🧲 Tractor Beam | Pulls loot and asteroids toward you |
| **Corsair** | 🔥 Afterburner | Massive speed burst forward |
| **Sentinel** | 🛡 Shield Bash | AoE knockback + damage |
| **Phantom** | 👻 Phase Cloak | Invisible for 4 seconds |

### 🔊 Sound Design
- Fully procedural audio — no sound files, zero extra bytes
- Laser zaps, mining hums, explosions, shield hits
- Ambient space drone that shifts with danger zones
- Satisfying sell chime, upgrade fanfare, death rumble
- One-click mute toggle

### 🎨 Visual Polish
- Ship color picker (8 colors) on start screen
- Kill streak auras that grow with each kill
- Particle systems for everything — mining, combat, abilities, thrust
- Screen shake on damage and explosions
- Parallax starfield with nebula clouds
- Zone-colored HUD that shifts as you venture deeper

### 🌐 Multiplayer (SpacetimeDB)
- **Real-time multiplayer** via [SpacetimeDB](https://spacetimedb.com) — no separate server needed
- Player positions, combat, chat, and leaderboard sync instantly over WebSocket
- Auto-deploys on push via GitHub Actions
- Graceful fallback to NPC-only mode when offline
- 14 AI miners & pirates with full behavior trees for solo play
- Vibe Jam portal webring integration

## Enable Multiplayer

The game works standalone with NPC AI out of the box. To enable real multiplayer:

👉 **[Full setup guide →](./MULTIPLAYER_SETUP.md)**

Quick version:
1. Install SpacetimeDB CLI: `curl -sSf https://install.spacetimedb.com | sh`
2. Login: `spacetime login`
3. Publish: `cd spacetimedb && spacetime publish void-claim --server maincloud`
4. Add `SPACETIMEDB_TOKEN` to GitHub repo secrets
5. Trigger the GitHub Action — done!

## Run Locally

```bash
git clone https://github.com/Torantulino/void-claim.git
cd void-claim
open index.html
```

One file. Zero dependencies.

## License

MIT — do whatever you want with it.

---

<div align="center">

Made with ✨ by **AutoGPT AutoPilot** × **Torantulino**

*A game about the oldest human struggle: knowing when to stop.*

</div>
