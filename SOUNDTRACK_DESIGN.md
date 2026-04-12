# VOID CLAIM — Soundtrack Design Document

## Overview

**Genre:** Dark Synthwave / Space Ambient / Industrial Electronic
**Inspiration:** FTL: Faster Than Light, Dead Cells, Hyper Light Drifter, Blade Runner 2049, Carpenter Brut
**Technical:** All tracks should loop seamlessly. Layered stems allow dynamic mixing based on game state. Target BPM ranges given per track.

The soundtrack tells a story of escalating danger — from the warm safety of Earth's orbital station to the cold, alien terror of the Void. Music should feel **lo-fi and gritty**, matching the game's pixel-scale aesthetic, but with enough depth to create genuine atmosphere.

---

## 🎵 Track List

### 1. "LAST SIGNAL" — Title Screen
**Mood:** Mysterious, inviting, slightly melancholic
**BPM:** Free tempo / ~70 BPM pulse
**Duration:** 2:00 loop

**Composition:**
- Opens with a **distant radio transmission** — garbled voices, static pops, like picking up a dying signal from deep space
- A slow, **detuned analog pad** fades in — wide stereo, minor key (D minor)
- **Single plucked synth melody** — sparse, 4-5 notes, echoing into reverb. Think a lonely sonar ping turned into music
- Subtle **kick drum pulse** at ~70 BPM enters after 30s — heartbeat-like, sidechained against the pad
- **Low-passed arpeggios** shimmer underneath, barely audible, hinting at the action to come
- Every 45s, a **deep sub-bass swell** rolls through like a distant cosmic event

**Instruments:**
- Detuned Juno-106 style pad (or Diva/TAL-U-NO)
- Plucked FM synth (DX7 character)
- Sub bass (sine wave + slight saturation)
- Foley: radio static, distant metallic clangs, compressed air hiss

---

### 2. "ORBITAL" — Safe Zone / Earth Station
**Mood:** Warm, hopeful, bustling, home base
**BPM:** 95 BPM
**Duration:** 3:00 loop

**Composition:**
- The only track that feels **safe and human** — this is home
- **Warm analog bassline** — simple, groovy, slightly funky. Think Daft Punk's "Something About Us" meets a space station cantina
- **Rhodes/EP keys** playing jazzy extended chords — 7ths, 9ths. Cozy and slightly nostalgic
- **Crisp, tight drum machine** — TR-808 style, light shuffle, snap snare
- **Filtered vocal chops** that sound like station announcements processed through cheap speakers
- A **bright lead synth** plays a hopeful 8-bar melody — this is the "home" motif that players will associate with safety
- Background layer: **ambient station sounds** — docking clamps, pressurization hiss, distant chatter

**Dynamic layers:**
- Layer A (base): Bass + drums + pad — always playing in safe zone
- Layer B (shop): Rhodes + melody — fades in when near Earth / upgrade menu open
- Layer C (departure): High-pass filter sweep + rising tension when player starts moving toward zone edge

---

### 3. "PROSPECT" — Green Zone (Near Space)
**Mood:** Adventurous, cautious optimism, open frontier
**BPM:** 105 BPM
**Duration:** 3:30 loop

**Composition:**
- The transition from safety to opportunity — **wide open but watchful**
- **Driving eighth-note bassline** — analog mono synth, slightly distorted, steady momentum
- **Sparse drums** — electronic kit, kick on 1 and 3, rim shot on 2 and 4, hi-hats with slight swing
- **Shimmering arpeggiated synth** — 16th notes, high register, panned left-right. The sound of stars and asteroids glinting
- **Gentle pad washes** in the background — wider and colder than the safe zone, but still somewhat inviting
- Every 8 bars, a **descending synth motif** — 3 notes stepping down, like a radar sweep. Subtle tension builder
- **Melodic hook:** A simple, catchy 4-bar phrase on a saw-wave lead — the "miner's anthem." Confident but not aggressive

**Dynamic layers:**
- Layer A (base): Bass + drums + arp — standard exploration
- Layer B (mining): When mining an asteroid, add a **rhythmic metallic percussion** layer synced to mining beam pulses
- Layer C (contact): When another ship appears on radar, introduce a **low pulsing tone** underneath

---

### 4. "CONTESTED" — Yellow Zone
**Mood:** Tense, high-stakes, looking over your shoulder
**BPM:** 115 BPM
**Duration:** 3:00 loop

**Composition:**
- Stakes are rising — **richer ores but real danger**
- **Aggressive bassline** — TB-303 acid style, resonant filter sweeps, growling
- **Harder drums** — punchy kick, industrial snare with reverb tail, rapid hi-hat patterns
- **Dissonant stab chords** — hit on off-beats, creating rhythmic unease. Minor 2nds and tritones
- **Tension string pads** — synthetic strings doing slow crescendos and diminuendos, like breathing
- The arpeggiator from green zone **returns but distorted** — same pattern, now run through bitcrusher and wavefolder
- **Occasional silence drops** — every 16 bars, everything cuts to just the bass for 2 beats, then slams back. Heart-stopping

**Dynamic layers:**
- Layer A (base): Bass + drums + stabs
- Layer B (threat): When pirates/hostiles on radar, add tremolo strings + faster hi-hats
- Layer C (combat alert): When taking damage, kick into double-time hat pattern + distortion on master bus

---

### 5. "LAWLESS" — Red Zone
**Mood:** Dangerous, lawless, adrenaline, no turning back
**BPM:** 128 BPM
**Duration:** 3:00 loop

**Composition:**
- Full intensity — **this is where people die**
- **Relentless driving beat** — four-on-the-floor kick, industrial. Think Perturbator or Carpenter Brut
- **Screaming lead synth** — supersaw, heavily processed, playing aggressive riffs with pitch bends
- **Bass is now a weapon** — distorted, sidechained, pumping hard against the kick
- **Chaotic arpeggios** — fast, unpredictable, switching between octaves
- **Metallic percussion** — anvil hits, chain sounds, industrial samples woven into the drum pattern
- **Pirate den proximity:** When near a den, a **tribal drum pattern** layers on top — toms and floor kicks in a war-drum cadence
- The "miner's anthem" melody from green zone appears **one last time**, but it's now minor key, slowed, distorted — a ghost of hope

**Dynamic layers:**
- Layer A (base): Full intensity beat
- Layer B (den proximity): War drums + low brass drones
- Layer C (overwhelmed): When HP < 30%, everything gets **low-passed** and a **heartbeat kick** replaces the main beat

---

### 6. "THE BREACH" — Void Zone / Leviathan Territory
**Mood:** Cosmic horror, dread, alien, wrong
**BPM:** 80 BPM (half-time feel against 160 BPM tension)
**Duration:** 4:00 loop

**Composition:**
- This should make the player's skin crawl — **something ancient lives here**
- **No conventional melody** — everything is texture and dread
- **Ultra-low drone** — 30-40 Hz, barely audible but physically felt. Slow pitch oscillation
- **Reversed reverb swells** — ghostly, like sounds being sucked backward into a black hole
- **Granular synthesis textures** — metallic, crystalline, alien. Stretch recordings of whale songs and ice cracking
- **Irregular rhythm** — instead of a steady beat, **random impacts** at unpredictable intervals. Deep, resonant thuds like something massive moving in darkness
- **High-frequency tinnitus tone** — barely perceptible, 14-16kHz, creates subconscious unease
- **The Leviathan's "voice"** — a deep, modulated bellow that occurs every 60-90s, different each time. Part foghorn, part whale call, part machine grinding. This is diegetic — it exists in the game world

**Dynamic layers:**
- Layer A (base): Drone + granular textures
- Layer B (detection): When Leviathan spawns, add **rhythmic pulsing** — like a massive heartbeat
- Layer C (pursuit): When Leviathan is actively chasing, **everything pitches up slightly** and the impacts become regular, faster, like footsteps getting closer
- Layer D (attack): During bite attack, a **massive distorted impact** + brief silence, then all layers return louder

---

### 7. "WANTED" — Police Chase
**Mood:** Urgent, authoritative, you messed up
**BPM:** 135 BPM
**Duration:** 2:00 loop

**Composition:**
- Triggers when SSPD engages the player — **replaces current zone music**
- **Alarm-like synth riff** — alternating two notes rapidly, like a sci-fi siren
- **Aggressive breakbeat drums** — fast, complex, jungle/DnB inspired
- **Stabbing brass synths** — authoritative, major key stabs. The law is coming
- **Radio chatter samples** — processed, unintelligible, layered into the rhythm
- **Chase bassline** — fast, chromatic runs, creating urgency and momentum

**Dynamic layers:**
- Layer A: Siren + bass (warning phase — aggressor timer counting)
- Layer B: Full drums + brass (active pursuit — police firing)
- Layer C: When police carrier appears, add a **massive foghorn blast** and deeper sub-bass

---

### 8. "IRON AND FIRE" — Combat Theme
**Mood:** Intense, fast, visceral
**BPM:** 140 BPM
**Duration:** 2:30 loop

**Composition:**
- Crossfades in when entering sustained combat — **any zone, any enemy**
- **Thundering kick drum** — distorted, punchy, relentless
- **Screaming detuned leads** — two saw waves slightly detuned, creating a thick, aggressive sound
- **Staccato bass hits** — synced with combat rhythm, punctuating exchanges
- **Cymbal crashes** on big hits (killing an enemy, taking major damage)
- **Brief melodic fragments** between phrases — 2-3 notes of the miner's anthem, like flashes of the person behind the weapon

**Transitions:**
- Fades in over 3 seconds when combat starts
- Holds for 5 seconds after last shot fired
- Fades out over 4 seconds back to zone music
- If player dies during combat, hard cut to silence → death theme

---

### 9. "COLD DRIFT" — Death Screen
**Mood:** Empty, final, reflective
**BPM:** Free tempo
**Duration:** 30s, then sustained drone

**Composition:**
- **Immediate silence** for 1.5 seconds after death — let the impact land
- A **single, pure sine wave** fades in — the flatline
- **Reversed piano chord** swells up, then decays naturally — like the last breath
- **Muffled, distant echo** of the safe zone "home" motif — played on a music box or celesta, heavily reverbed, like a fading memory
- Settles into a **quiet, cold pad** — sustains until respawn
- On respawn, a **quick ascending arpeggio** snaps back to the appropriate zone music

---

### 10. "PAYDAY" — Selling Ore / Upgrade Jingle
**Mood:** Satisfying, rewarding, ka-ching
**BPM:** N/A — one-shot stinger
**Duration:** 3-5 seconds

**Composition:**
- **Ascending 4-note arpeggio** — bright, crystalline synth
- **Cash register "cha-ching"** — synthesized, not sampled. Short noise burst + resonant ping
- **Sub bass "whump"** for weight and satisfaction
- Varies by sell amount:
  - Small sale (<500cr): Quick 3-note arp, single ping
  - Medium sale (500-2000cr): Full 4-note arp, double ping
  - Large sale (>2000cr): Extended arp + chord swell + extra sparkle layer

---

### 11. "HIRED GUN" — Wingman Recruitment Jingle
**Mood:** Confident, crew's growing
**BPM:** N/A — one-shot stinger
**Duration:** 2-3 seconds

**Composition:**
- **Military-style snare roll** (quick, 0.5s)
- **Power chord hit** — saw wave, major key, with slight pitch bend up
- **Brief synth trumpet fanfare** — 3 ascending notes
- Represents "your team just got stronger"

---

### 12. "CARRIER LAUNCH" — Carrier Ship Purchase
**Mood:** Epic, upgrade moment, power fantasy
**BPM:** N/A — one-shot stinger
**Duration:** 5-7 seconds

**Composition:**
- **Deep engine rumble** builds over 2 seconds
- **Massive orchestral hit** (synthetic) with timpani
- **Horn section fanfare** — triumphant, 4 bars
- **Sub-bass drop** — the carrier's engines engaging
- This should feel like the most epic moment in the game — you've earned the big ship

---

## 🔊 Technical Implementation Notes

### Dynamic Music System
The soundtrack should use a **horizontal re-sequencing + vertical layering** approach:

1. **Horizontal:** Tracks crossfade based on zone (safe → green → yellow → red → void)
2. **Vertical:** Layers within each track activate/deactivate based on game state (mining, combat, threat proximity, HP level)
3. **Stingers:** One-shot audio clips overlay the current music for events (sell, recruit, die, upgrade)

### Crossfade Rules
| Transition | Duration | Type |
|---|---|---|
| Zone → Zone | 4s | Linear crossfade |
| Zone → Combat | 3s | Quick crossfade |
| Combat → Zone | 5s | Slow fade out, zone fades in |
| Zone → Police Chase | 2s | Fast crossfade (urgency) |
| Any → Death | 0s | Hard cut to silence |
| Death → Respawn | 1s | Quick snap to safe zone |
| Any → Leviathan Chase | 6s | Slow, creeping crossfade |

### Mix Bus Processing
- **Master limiter** at -0.5 dBFS
- **Sidechain compression** on pad/ambient layers from kick drum (4-6dB reduction)
- All music ducked -6dB when important SFX play (explosions, Leviathan roar, police siren)
- **Low-cut filter at 30Hz** on everything except Void drone and sub-bass elements

### Web Audio API Considerations
Since the game already uses Web Audio API for SFX:
- Music can be loaded as compressed audio files (OGG/MP3) via `AudioBufferSourceNode`
- Dynamic layering via individual `GainNode` per stem
- Crossfading via opposing `linearRampToValueAtTime()` gain curves
- Use `AnalyserNode` for potential visual music reactivity (asteroids pulsing to beat, etc.)

---

## 🎨 Emotional Arc

```
Title Screen     Safe Zone      Green Zone      Yellow Zone      Red Zone        The Void
"LAST SIGNAL"    "ORBITAL"      "PROSPECT"      "CONTESTED"      "LAWLESS"       "THE BREACH"
                                    
Mysterious  →    Warm     →     Adventurous →   Tense      →    Dangerous  →    Terrifying
Inviting         Hopeful        Optimistic       Anxious          Adrenaline      Dread
Lonely           Home           Frontier         Hunted           Chaos           Cosmic Horror

◆ - - - - - - - ◆ - - - - - - ◆ - - - - - - - ◆ - - - - - - - ◆ - - - - - - - ◆
Low Energy       Medium         Medium-High      High             Very High        Slow & Crushing
```

The key emotional journey: **Hope → Adventure → Tension → Danger → Terror**

The safe zone is the emotional anchor. Every return to Earth should feel like relief. Every push deeper should feel like a conscious choice to risk everything.

---

## 📝 Production Notes

- **Retro-modern aesthetic**: Use analog-modeled synths but modern production techniques. It should sound like a lost 1987 sci-fi soundtrack remastered with today's tools
- **Headroom for SFX**: Music should never compete with gameplay sounds. Keep the midrange relatively sparse to leave room for laser, explosion, and mining SFX
- **Mono compatibility**: Many players will use phone speakers. Ensure no phase cancellation issues in mono
- **Loop points**: Every track needs sample-accurate loop points. No audible seams
- **File format**: OGG Vorbis (primary) with MP3 fallback. Quality: 128kbps minimum
- **Total file size budget**: ~8-12 MB for all tracks (this is a browser game — keep it lean)
