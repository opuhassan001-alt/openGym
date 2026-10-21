# 🛡️ Project Isolation & Security Manifest

## 1. Scope Boundary
- **Project Root Directory:** `e:\work station\gym app`
- **Internal Ecosystem:**
  - `brain/` — Dedicated AI coach logic, voice models, prompts, and agent state.
  - `docs/` — Dedicated documentation, TODO tracking, prompt history, and technical specs.
  - `frontend/` — React 19 + Vite web client.
  - `api/` — Node.js backend.
  - `data/` — Isolated local database.

## 2. Strict Isolation Invariants
1. **No Outbound Leakage:** No files, configurations, scripts, or agents from this project may write to, reference, or alter any directory outside `e:\work station\gym app`.
2. **No Inbound Contamination:** External files, MCP definitions, or assets from other repositories (e.g. `opu-portfolio`, browser extensions, etc.) must NEVER be imported or mixed into this repository.
3. **Session Independent Memory:** Every critical user instruction, prompt, and requirement is permanently recorded into `docs/PROMPTS_LOG.md` and `docs/TODO.md` so that future sessions or restarts never lose context.
4. **Clean Git Tracking:** All documentation and code changes are committed and maintained inside this repository's git tree only.
