# 🎮 Pixel Companion Widget

A browser-based animated pixel character that lives on your screen and reacts to what you're doing — music, work, or break.

---

## What It Is

A small interactive widget featuring a pixel art character that changes its animation and scene based on your current activity mode. Switch manually between modes or (eventually) let it react automatically via Spotify.

---

## Modes

| Mode | Character Behavior | Scene |
|------|--------------------|-------|
| `music` | Dancing, bobbing, vibing | Music room |
| `work` | Typing, reading, studying | Work desk |
| `break` | Resting, coffee, stretching | Break room |

---

## Tech Stack

- **Framework:** React + Vite
- **Language:** TypeScript
- **Styling:** CSS Modules
- **Animation:** JavaScript frame cycling (`setInterval` / `requestAnimationFrame`)
- **State:** React state + context
- **Persistence:** `localStorage`
- **Optional (Phase 5):** Spotify Web API

---

## Sprite Sheet Spec

- **Original canvas:** 32×32px per frame
- **Exported at:** 4× scale → 128×128px per sprite
- **Sheet layout:** 2×2 grid → 256×256px total sheet size
- **In code:** `spriteW = 32`, `scale = 4`
  - Reads the sprite sheet at native (32px) coordinates
  - Renders the character at 128×128px on screen

```ts
// How the math works:
// sheet is read at 32px units → frame at (col * 32, row * 32)
// canvas draws at scale 4 → output is 128x128px
ctx.drawImage(sheet, col * 32, row * 32, 32, 32, 0, 0, 128, 128);
```

---

## Project Structure

```
pixel-companion-widget/
├── public/
│   └── assets/
│       ├── characters/
│       │   └── default/
│       │       ├── music/       # frame_01.png, frame_02.png, ...
│       │       ├── work/
│       │       ├── break/
│       │       └── meta.json    # fps + frame count per mode
│       ├── scenes/
│       │   ├── music-room.png
│       │   ├── work-desk.png
│       │   └── break-room.png
│       └── ui/
│           ├── bubble.png
│           └── panel.png
│
├── src/
│   ├── components/
│   │   ├── Companion/           # SpriteAnimator, CompanionScene, SpeechBubble
│   │   ├── Controls/            # ModeSwitcher, InteractionPanel
│   │   ├── Layout/              # WidgetShell
│   │   └── Spotify/             # SpotifyConnectButton, SpotifyStatus
│   ├── data/                    # modes.ts, characterManifest.ts, interactions.ts
│   ├── hooks/                   # useAnimation, useModeState, useLocalStorage
│   ├── lib/                     # sprite.ts, timing.ts, spotify.ts, storage.ts
│   ├── pages/                   # Home.tsx
│   ├── styles/                  # globals.css, variables.css, animations.css
│   ├── types/                   # companion.ts, mode.ts, spotify.ts
│   ├── App.tsx
│   └── main.tsx
```

---

## Character Manifest (`meta.json`)

```json
{
  "name": "default",
  "frameWidth": 32,
  "frameHeight": 32,
  "scale": 4,
  "modes": {
    "music": { "fps": 6, "frames": 4 },
    "work":  { "fps": 4, "frames": 4 },
    "break": { "fps": 2, "frames": 4 }
  }
}
```

---

## Core Types

```ts
export type CompanionMode = 'music' | 'work' | 'break';

export interface CharacterPack {
  name: string;
  frameWidth: number;
  frameHeight: number;
  scale: number;
  modes: {
    music: { fps: number; frames: string[] };
    work:  { fps: number; frames: string[] };
    break: { fps: number; frames: string[] };
  };
}

export interface CompanionState {
  mode: CompanionMode;
  isAnimating: boolean;
  currentFrame: number;
  isHovered: boolean;
  message?: string;
}
```

---

## Component Tree

```
App
└── Home
    └── WidgetShell
        ├── CompanionScene       ← background / room
        │   └── Companion        ← character container
        │       └── SpriteAnimator ← frame cycling
        └── ModeSwitcher         ← music / work / break buttons
```

---

## Build Phases

### ✅ Phase 1 — Static Prototype
Layout, scene areas, mode buttons, placeholder images.

### ✅ Phase 2 — Sprite Animation
Frame-by-frame loop, per-mode animation speed, scene switching.

### 🔲 Phase 3 — Interaction Layer
Click + hover responses, speech bubble, animation toggle.

### 🔲 Phase 4 — Persistence
Save last mode, character pack, and preferences to `localStorage`.

### 🔲 Phase 5 — Spotify Integration
Connect Spotify account, auto-switch to `music` mode on playback.

---

## User Interactions

| Action | Result |
|--------|--------|
| Click `Music` | Switch to music animation + scene |
| Click `Work` | Switch to work animation + scene |
| Click `Break` | Switch to break animation + scene |
| Hover character | Optional speech bubble appears |
| Click character | Emote or animation variation |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## Asset Checklist

Before running, make sure you have:

- [ ] PNG frames in `public/assets/characters/default/{music,work,break}/`
- [ ] `meta.json` configured with correct fps and frame counts
- [ ] Scene backgrounds in `public/assets/scenes/`
- [ ] `.env` file if using Spotify (Phase 5)

---

## Future Ideas

- Multiple character packs
- Draggable floating mini-widget
- Browser corner dock mode
- Pomodoro / task timer mode
- Weather or time-of-day reactions
- Browser extension version
- Unlockable outfits