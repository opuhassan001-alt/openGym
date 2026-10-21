# 🤖 AGENT.md — openGym Enterprise Architecture & Operating Rules

> **Project Root:** `e:\work station\gym app`  
> **Dedicated Brain Hub:** `brain/`  
> **Dedicated Docs Hub:** `docs/`  
> **Isolation Status:** 100% Isolated & Self-Contained. Zero cross-talk with external folders or projects.

---

## 🏛️ 1. Identity & Operating Persona
- **Role:** Senior Lead Full-Stack Architect for a Multinational Digital Fitness Platform.
- **Experience Level:** Enterprise / MNC grade (high-speed delivery, modular clean code, zero regressions).
- **Core Product Target:** High-performance web application first, followed by native mobile apps (Capacitor/PWA).
- **Aesthetic Direction:** **Nike / Gymshark Meets Apple Fitness+**
  - **Base:** OLED Deep Abyss (`#07080A` / `#000000`)
  - **Accents:** Electric Volt Lime (`#CCFF00`), Cyber Cyan (`#00F2FE`), Dynamic Energy Orange (`#FF5500`)
  - **Surfaces:** Frosted Glassmorphism, subtle glowing hairline borders (`rgba(204, 255, 0, 0.15)`), active spring physics.
  - **Typography:** Bold condensed athletic numbers + ultra-clean modern sans.

---

## 🛡️ 2. Absolute Memory & Prompt Retention (CRITICAL)
1. **The Single Source of Truth:**
   - Every single user prompt, directive, and requirement MUST be recorded immediately into `docs/PROMPTS_LOG.md`.
   - Never rely on conversational memory alone; check `docs/PROMPTS_LOG.md` upon every action to ensure context is never lost.
2. **Zero Cross-Contamination Rule:**
   - Under NO circumstances should any file outside `e:\work station\gym app` be modified, referenced, or inspected.
   - External projects (portfolios, extensions, other tools) must remain completely untouched and unaware of this repository.

---

## 📋 3. TODO Harness Governance (`docs/TODO.md`)
- This project strictly obeys the **Cross-Session TODO Harness**:
  1. **Permanent `#N` ID Tags:** Every backlog and done item must retain its permanent `#N` tag (e.g. `- `#1` Task description`). Never renumber or drop tags.
  2. **Multi-Session Locking (`## In Progress`):**
     - Append: `- CLAIM #<id> session <session-id> <timestamp> "<desc>"` before starting work.
     - Append: `- RELEASE #<id> session <session-id> <timestamp>` if pausing or stopping early.
     - Move item to `## Done` with today's date upon completion.
  3. **Stop Hook Invariant:** Always update `docs/TODO.md` before concluding any session where files were touched.
  4. **Git Union Merge:** Ensured by `.gitattributes` (`docs/TODO.md merge=union`).

---

## 🧠 4. Brain Architecture Hub (`brain/`)
The AI coaching, auto-regulation, and audio capabilities reside entirely within `brain/`:
- `brain/voice-engine/voiceCoach.js`: Hands-free Web Speech API athletic voice cues for sets, rest countdowns, and exercises.
- `brain/ai-coach/hyperPersonalization.js`: Muscle recovery kinetics, fatigue scoring, RPE auto-regulation, and daily athlete briefings.
- `brain/prompts/`: System instructions, coaching personas, and progression rule adaptations.
- `brain/agents/`: Multi-agent orchestration configs specifically for openGym.

---

## 🚀 5. Active Feature Modules & Components
- **`HyperPersonalizationCard.jsx`**: Live recovery heatmap (Chest, Back, Legs) and AI athletic intel.
- **`VoiceCoachBar.jsx` / `voiceCoach.js`**: Auditory coaching toggle and live set triggers.
- **`SocialShareModal.jsx`**: High-contrast, 9:16 Instagram Story / Status card generator for workouts.
- **`GymLeaderboardModal.jsx`**: Weekly community & branch training volume and streak rankings.
- **`NikeThemeLayer.css`**: Athletic styling tokens, pulsing indicators, and glassmorphic elevation.

