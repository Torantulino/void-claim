# 🌐 VOID CLAIM — Multiplayer Setup Guide

> **One-time setup to enable real-time multiplayer via SpacetimeDB.**
> Takes ~10 minutes. No server management needed — SpacetimeDB hosts everything for free.

---

## How It Works

```
┌─────────────┐     WebSocket      ┌──────────────────────┐
│  Browser     │ ◄──────────────► │  SpacetimeDB Cloud    │
│  (index.html)│    real-time      │  (Maincloud)          │
│              │    sync           │                       │
│  Player A    │                   │  ┌─────────────────┐  │
│  Player B    │                   │  │ Your Game Module │  │
│  Player C    │                   │  │ (tables+reducers)│  │
└─────────────┘                   │  └─────────────────┘  │
                                  └──────────────────────┘
```

- **No separate server** to manage — SpacetimeDB is both database and server
- **Real-time sync** — player positions, kills, chat, leaderboard all update instantly
- **Free tier** — more than enough for game jams and small games
- **Auto-deploys** — push to GitHub → module updates automatically

---

## Step-by-Step Setup

### 1️⃣ Install SpacetimeDB CLI (your computer)

```bash
curl -sSf https://install.spacetimedb.com | sh
```

### 2️⃣ Create a SpacetimeDB account

```bash
spacetime login
```

This opens your browser for GitHub OAuth. After login, your CLI is authenticated.

### 3️⃣ Get your auth token

After logging in, your token is stored locally. Extract it for GitHub Actions:

```bash
# The token is stored in ~/.spacetime/config.toml
cat ~/.spacetime/config.toml
```

Look for the `token = "..."` value. Copy it — you'll need it in step 5.

### 4️⃣ First-time publish (manual)

Publish the game module to SpacetimeDB cloud:

```bash
cd spacetimedb
spacetime publish void-claim --server maincloud
```

> **Note:** Change `void-claim` to a unique name if it's taken. Then update `STDB_DATABASE` in both `index.html` (the `CFG` object) and `.github/workflows/deploy-spacetimedb.yml`.

### 5️⃣ Add GitHub Secret for auto-deploy

1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `SPACETIMEDB_TOKEN`
4. Value: paste the token from step 3
5. Click **Add secret**

### 6️⃣ Trigger the first CI build

Either:
- Push any change to the `spacetimedb/` directory, OR
- Go to **Actions** → **Deploy SpacetimeDB Module** → **Run workflow**

This will:
1. ✅ Publish the module to Maincloud
2. ✅ Generate TypeScript client bindings
3. ✅ Build `dist/bindings.iife.js` for the browser
4. ✅ Commit the bindings back to the repo

### 7️⃣ Done! 🎉

Your game is now multiplayer. Open it in two browser tabs to test.

---

## Configuration

In `index.html`, the multiplayer config is in the `CFG` object:

```javascript
STDB_HOST: 'wss://maincloud.spacetimedb.com',  // SpacetimeDB server
STDB_DATABASE: 'void-claim',                     // Your database name
STDB_ENABLED: true                                // Set false for NPC-only
```

## Fallback Behavior

The game gracefully handles missing multiplayer:

| Scenario | Behavior |
|---|---|
| `dist/bindings.iife.js` not loaded | NPC-only mode (no errors) |
| SpacetimeDB server unreachable | NPC-only mode, auto-reconnects |
| `STDB_ENABLED: false` | Forces NPC-only mode |
| Legacy `WS_URL` configured | Falls back to old WebSocket relay |

---

## For Non-Technical Users (Fork & Play)

Want to make **your own** game multiplayer using this same system?

1. **Fork this repo** on GitHub
2. **Install SpacetimeDB CLI** (step 1 above)
3. **Login**: `spacetime login`
4. **Publish**: `spacetime publish my-game-name --server maincloud`
5. **Update config** in `index.html`: change `STDB_DATABASE` to `my-game-name`
6. **Add GitHub Secret** (step 5 above)
7. **Trigger CI** (step 6 above)

That's it! Your fork now has its own independent multiplayer server.

### Customizing the Game Module

The server logic lives in `spacetimedb/src/index.ts`. Key things you can customize:

| What | Where | Example |
|---|---|---|
| Player data fields | `player` table | Add `level`, `xp`, `team` |
| Game events | `kill_event` table | Add `weapon_used`, `distance` |
| Chat features | `send_chat` reducer | Add profanity filter, rate limit |
| Leaderboard rules | `submit_score` reducer | Change ranking criteria |
| New game actions | New reducers | Add `trade_item`, `form_alliance` |

After editing, just push to GitHub — the CI auto-deploys.

---

## Troubleshooting

### "Connecting to multiplayer..." but never connects
- Check browser console for errors
- Verify `STDB_DATABASE` name matches what you published
- Ensure `dist/bindings.iife.js` exists (run CI workflow)

### Module publish fails in CI
- Check that `SPACETIMEDB_TOKEN` secret is set correctly
- Try re-running `spacetime login` locally and updating the secret

### Players don't see each other
- Both players must be using the same `STDB_DATABASE` name
- Check that the module is published: `spacetime sql "SELECT * FROM player" void-claim`

### Breaking schema changes
- The CI uses `--delete-data on-conflict` — this wipes data if the schema changes incompatibly
- For non-breaking changes (adding fields), data is preserved

---

## Architecture

```
void-claim/
├── index.html              # Game client (single file, zero deps)
├── dist/
│   └── bindings.iife.js    # Auto-generated SpacetimeDB client (by CI)
├── spacetimedb/
│   ├── src/
│   │   └── index.ts        # Server module (tables + reducers)
│   ├── package.json
│   └── tsconfig.json
├── .github/
│   └── workflows/
│       └── deploy-spacetimedb.yml  # Auto-deploy on push
└── MULTIPLAYER_SETUP.md    # This file
```

---

Built with ❤️ for [Vibe Jam 2026](https://vibejam.com) using [SpacetimeDB](https://spacetimedb.com)
