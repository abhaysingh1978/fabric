# Aethon — Implementation Prompts
**Complete AI-Assisted Development Prompt Library**
Version: 1.0.0 | April 2026

Use these prompts sequentially with Claude, Cursor, GitHub Copilot, or any AI coding assistant.
Each prompt is self-contained and builds on the previous phase.

---

## Table of Contents

- [Phase 1 — Project Scaffold](#phase-1--project-scaffold)
- [Phase 2 — Types & Data Layer](#phase-2--types--data-layer)
- [Phase 3 — AI Provider Abstraction](#phase-3--ai-provider-abstraction)
- [Phase 4 — Custom Hooks](#phase-4--custom-hooks)
- [Phase 5 — Shared Components](#phase-5--shared-components)
- [Phase 6 — Pipeline & Agent Components](#phase-6--pipeline--agent-components)
- [Phase 7 — Chart Components](#phase-7--chart-components)
- [Phase 8 — AI Query Panel](#phase-8--ai-query-panel)
- [Phase 9 — Config Modal](#phase-9--config-modal)
- [Phase 10 — Navigation](#phase-10--navigation)
- [Phase 11 — Demo Panel & App Root](#phase-11--demo-panel--app-root)
- [Phase 12 — Infrastructure & Deployment](#phase-12--infrastructure--deployment)
- [Phase 13 — Testing](#phase-13--testing)
- [Phase 14 — Polish & Production Readiness](#phase-14--polish--production-readiness)

---

## Phase 1 — Project Scaffold

### Prompt 1 — Init

```
Create a new React 18 + TypeScript 5 + Vite 5 project called "aethon".
Install dependencies: react, react-dom, typescript. No CSS frameworks,
no UI libraries. Configure tsconfig with strict mode, path aliases
(@components, @data, @lib, @hooks, @types). Create the folder structure
from this tree:

src/
├── main.tsx
├── App.tsx
├── data/          # static definitions
├── components/    # UI components
├── panels/        # page-level panels
├── lib/           # business logic
├── hooks/         # custom hooks
└── types/         # TypeScript interfaces

Create a Vite config that loads .env variables prefixed with VITE_.
```

---

## Phase 2 — Types & Data Layer

### Prompt 2 — Core Types

```
Create src/types/index.ts with these TypeScript interfaces:

- AIModel { id, name, provider ("Anthropic"|"Google"|"OpenAI"|"Local"), tag, color }
- ETLConfig { batchSize, refreshInterval, parallelAgents, vectorStore, dataWarehouse, streamProcessor }
- KPI { l: label, v: value, d: delta }
- UseCase { label, icon, desc, datasets: string[], agents: string[], kpis: KPI[], caseKey }
- Category { label, icon, color, sub: Record<string, UseCase> }
- AppState { category, sub, configOpen, model: AIModel, etl: ETLConfig,
             running, logs: string[], activeStage: 0-5, activeAgents: number[],
             logIdx, records, throughput, aiResponse, aiLoading, aiQuery }
- PipelineStage enum: Extract | Validate | Transform | Aggregate | Load | Index
- AgentMessage { messageId, fromAgent, toAgent, messageType, payload, createdAt }

Export all from a single index.ts.
```

### Prompt 3 — Use Case Data

```
Create src/data/usecases.ts exporting a DEMOS constant typed as
Record<string, Category> with exactly these entries:

BFSI category (color #00D4FF), 3 sub-cases:
- stock: "Stock Analysis" — agents: [Market Data, Technical Analysis,
  Sentiment, Risk, Report]. KPIs: Tickers Tracked 4200+, Data Points/sec 2.8M,
  Model Accuracy 87.3%, Latency p99 42ms. Datasets: NYSE/NASDAQ Feeds,
  Options Chain, SEC Filings, Sentiment Data, Macro Indicators
- advisory: "Financial Advisory" — agents: [Portfolio, Risk Profiler,
  Rebalance, Tax, Client Report]. KPIs: AUM $2.4B, Portfolios 14800,
  Sharpe 1.94, Signals/Day 890
- fund: "Fund Performance" — agents: [Performance, Attribution, Factor,
  Compliance, Board Report]. KPIs: Funds 382, Alpha 3.2%, Reports/Month 1240,
  Sources 47

Sales category (color #10B981), 1 sub-case:
- smartphone: "Smartphone Sales Research" — agents: [Market Share, Sentiment,
  Pricing, Channel, Forecast]. KPIs: Markets 68, Reviews 12.4M,
  Freshness <4hrs, SKUs 3840

Economy category (color #7C3AED), 1 sub-case:
- economies: "World Top 10 Economies" — agents: [GDP, Trade, Inflation,
  FX, Geopolitical Risk]. KPIs: Economies 10, Indicators 240+,
  Time Series 50yr, Forecast 5yr
```

### Prompt 4 — AI Models & ETL Config

```
Create src/data/models.ts exporting:

AI_MODELS object with two arrays:
- local: DeepSeek R1 (7B, #06B6D4), Llama 3.3 (70B, #8B5CF6),
  Gemma 3 (27B, #10B981), Mistral NeMo (12B, #F59E0B), Phi-4 (14B, #EC4899)
- cloud: Claude Opus (Anthropic, 4.6, #FF6B35), Claude Sonnet (Anthropic, 4.6, #FF8C61),
  Gemini 2.0 Pro (Google, Pro, #4285F4), Gemini Flash (Google, 2.0, #34A853),
  GPT-4o (OpenAI, Latest, #74AA9C)

DEFAULT_MODEL = Claude Sonnet

Create src/data/etlConfig.ts exporting ETL_OPTIONS (all dropdown options)
and DEFAULT_ETL_CONFIG (batch 100000, interval 30s, agents 8,
Pinecone, Snowflake, Kafka).

Create src/data/presets.ts exporting QUERY_PRESETS: Record<caseKey, string[]>
with 3 preset questions per domain (stock, advisory, fund, smartphone, economies).

Create src/data/etlLogs.ts exporting ETL_LOGS: string[] with ~22 log lines
covering all stages. Each line MUST start with one of these exact tags:
[EXTRACT] [VALIDATE] [TRANSFORM] [AGGREGATE] [LOAD] [INDEX] [AGENTS] [A2A]
[REPORT] [PIPELINE]. Include realistic record counts, latency numbers,
and 2-3 [A2A] lines showing agent-to-agent messaging.
```

---

## Phase 3 — AI Provider Abstraction

### Prompt 5 — AI Provider Layer

```
Create src/lib/ai/providers.ts implementing a unified AI abstraction:

Interface AICompletionRequest { systemPrompt, userMessage, maxTokens?: number }
Interface AICompletionResponse { text: string, error?: string }

Async function callAI(model: AIModel, request: AICompletionRequest):
Promise<AICompletionResponse> that routes to:

1. callAnthropic() — POST api.anthropic.com/v1/messages
   Headers: x-api-key from import.meta.env.VITE_ANTHROPIC_API_KEY,
   anthropic-version: 2023-06-01
   Model ID mapping: claude-opus → claude-opus-4-20250514,
   claude-sonnet → claude-sonnet-4-20250514
   Extract: data.content[0].text

2. callGoogle() — POST generativelanguage.googleapis.com/v1beta/models/{id}:generateContent
   Query param: key=VITE_GOOGLE_API_KEY
   Use system_instruction + contents[{role:user}] format
   Extract: data.candidates[0].content.parts[0].text

3. callOpenAI() — POST api.openai.com/v1/chat/completions
   Header: Authorization Bearer VITE_OPENAI_API_KEY
   Use messages: [{role:system},{role:user}] format
   Extract: data.choices[0].message.content

4. callOllama() — POST VITE_OLLAMA_BASE_URL/api/generate
   Body: { model: id, prompt: systemPrompt+"\n\nUser: "+message, stream: false }
   Extract: data.response

Wrap every call in try/catch. Return { text: "", error: "<user-friendly message>" }
on failure. Include formatError(err, provider) that returns helpful messages
for 401 (bad key), 429 (rate limit), and network errors.
```

### Prompt 6 — System Prompts

```
Create src/lib/ai/prompts.ts exporting:

SYSTEM_PROMPTS: Record<string, string> with keys matching caseKeys:
- stock: financial data analyst with NYSE/NASDAQ context, 2 short paragraphs
- advisory: wealth management AI, portfolio + risk focus
- fund: fund performance analyst, attribution focus
- smartphone: consumer electronics researcher, Apple/Samsung/Pixel competitive dynamics
- economies: macroeconomic analyst, top 10 economies comparison

Also export getSystemPrompt(caseKey: string): string with fallback to stock prompt.
```

---

## Phase 4 — Custom Hooks

### Prompt 7 — Pipeline Hook

```
Create src/hooks/usePipeline.ts — a custom React hook managing all ETL
pipeline state and simulation logic.

Returns: { running, logs, activeStage, activeAgents, records, throughput,
           startPipeline, stopPipeline, resetPipeline }

startPipeline() starts a setTimeout tick loop:
- Tick interval: 160 + Math.random() * 100 ms (natural variance)
- Each tick: appends next ETL_LOG entry, advances activeStage
  (Math.min(5, Math.floor(logIdx/totalLogs * 6))), activates agents
  progressively after logIdx > 8, updates records
  (logIdx * 12400 + random variance) and throughput (800 + random 400)
- Stops automatically when all logs consumed; sets running=false
- Uses useRef for timer to prevent memory leaks

stopPipeline() clears the timer immediately.
resetPipeline() resets all state to initial values.

The hook must clean up the timer on unmount via useEffect return.
```

### Prompt 8 — AI Query Hook

```
Create src/hooks/useAIQuery.ts — a custom React hook for AI query state.

Returns: { query, setQuery, response, loading, error, ask, clearResponse }

ask(queryText?: string) function:
- Uses queryText if provided, else current query state
- Sets loading=true, clears previous response/error
- Calls callAI(model, { systemPrompt: getSystemPrompt(caseKey), userMessage: query })
- On success: sets response text, loading=false
- On error: sets error message, loading=false
- Prevents duplicate calls while loading (early return if loading === true)

Accept model: AIModel and caseKey: string as hook parameters.
```

---

## Phase 5 — Shared Components

### Prompt 9 — Design System & Shared Components

```
Create src/lib/theme.ts exporting a COLORS constant:
bg #0A0E1A, bgCard #0F1520, bgPanel #141924, border #1E2A3A,
borderBright #2A3A50, accent #00D4FF, accent2 #7C3AED, accent3 #10B981,
accentWarn #F59E0B, accentDanger #EF4444, text #E2E8F0,
textMuted #64748B, textDim #94A3B8

Create src/components/shared/ with these components (all TypeScript, inline styles only,
no CSS files):

1. Badge.tsx — props: children, color, size ("sm"|"md")
   Renders a monospace pill tag with 22% opacity background of the color

2. KPICard.tsx — props: label, value, delta?
   Dark card, muted uppercase label, large monospace value,
   green delta if starts with + or is "Live"/"Auto"

3. AgentBubble.tsx — props: name, active, color
   Flex row with animated status dot, agent name.
   When active: border glows in color, dot pulses with CSS animation

4. Sparkline.tsx — props: data: number[], color, width?, height?
   Pure SVG sparkline with area fill at 10% opacity.
   Normalise data to fit viewBox. strokeWidth 1.5, strokeLinejoin round

5. DonutChart.tsx — props: segments: {value, color}[], size?
   Pure SVG donut. Compute arc paths from values.
   Inner circle at 52% radius filled with bgCard color.
```

### Prompt 10 — Architecture Bar

```
Create src/components/shared/ArchitectureBar.tsx

Renders a 6-cell grid (CSS grid, repeat(6, 1fr), gap 8px).
Cells: Data Sources | Stream Layer | Warehouse | Vector Store | AI Agents | AI Model

Props: activeCase: UseCase, etlConfig: ETLConfig, model: AIModel

Each cell: dark card, top border accent (each cell has own color),
icon (unicode), muted uppercase label, bold value in cell color.
Values come from: activeCase.datasets.length+"feeds", etlConfig.streamProcessor,
etlConfig.dataWarehouse, etlConfig.vectorStore,
activeCase.agents.length+" agents", model.name

All values truncate with text-overflow ellipsis.
```

---

## Phase 6 — Pipeline & Agent Components

### Prompt 11 — ETL Pipeline Visualiser

```
Create src/components/pipeline/ETLPipeline.tsx

Props: running: boolean, activeStage: number, etlConfig: ETLConfig

Renders the 6 pipeline stages as a horizontal flow:
[1 Extract] —— [2 Validate] —— [3 Transform] —— [4 Aggregate] —— [5 Load] —— [6 Index]

Stage states:
- Idle: muted grey circle with number, muted label below
- Active (running && i === activeStage): accent cyan circle with glow box-shadow,
  animated pulse, accent label
- Done (running && i < activeStage): green circle with ✓ checkmark, green label

Connector lines between stages: grey when idle/upcoming, green when done.
All transitions use CSS transition: all 0.4s.

Below the pipeline: one line showing etlConfig values in muted text.
```

### Prompt 12 — Log Terminal

```
Create src/components/pipeline/LogTerminal.tsx

Props: logs: string[]

Renders a dark terminal panel (background #060A12, monospace font,
border, border-radius 10px, height 190px, overflow-y auto).

Each log line:
- Line number (2-digit, padded, muted)
- Tag (colour-coded): [EXTRACT] cyan, [VALIDATE] amber, [TRANSFORM] purple,
  [AGGREGATE] green, [LOAD] blue, [INDEX] pink, [AGENTS] bright cyan,
  [A2A] orange, [REPORT] lime, [PIPELINE] white
- Message text in textDim colour

New lines animate in with a 0.2s slide-up fade (CSS keyframes).
Auto-scrolls to bottom on every new log entry (useEffect + scrollTop = scrollHeight).
When logs is empty: show blinking cursor placeholder.

Use useRef on the container div for the scroll behaviour.
```

### Prompt 13 — Agent Framework Panel

```
Create src/components/agents/AgentFrameworkPanel.tsx

Props: agents: string[], activeAgents: number[], running: boolean

Renders a dark card with:
- Header: "Multi-Agent Framework · A2A Communication" in muted uppercase
- Grid/flex-wrap of AgentBubble components
- Footer row: amber dot + "A2A messages flowing between active agents"
  + right-aligned count "{n}/{total} active" in accent colour

Agent colours cycle through: [#00D4FF, #7C3AED, #10B981, #F59E0B, #EC4899]
using index modulo 5.

When running prop changes to false, all agents gradually deactivate
(keep activeAgents prop-driven, no local state for activation).
```

---

## Phase 7 — Chart Components

### Prompt 14 — BFSI Charts

```
Create src/components/charts/BFSICharts.tsx

Renders a 2×2 grid of chart cards for all BFSI sub-cases (stock/advisory/fund).
Use the same charts for all three — domain context comes from the AI layer.

Card 1 — Price History (30-day sparkline):
- Generate 30 data points: 150 + sin(i*0.4)*20 + random()*10 (useMemo, stable)
- Sparkline component, accent cyan, show delta "+8.4%" in green

Card 2 — Volume Trend:
- 30 random points around 1.4M, purple sparkline
- "↑ Spike detected" indicator

Card 3 — Sector Allocation donut chart:
- 5 segments: Tech 35% (cyan), Finance 20% (purple), Health 18% (green),
  Energy 15% (amber), Other 12% (pink)
- DonutChart component + inline legend

Card 4 — Risk/Return Bubble Plot:
- Pure SVG, 4 labelled circles at hand-placed coordinates
- Points: Portfolio (small, accent), Benchmark (medium, green),
  Aggressive (large, amber), Conservative (small, purple)
- Minimal x/y axis lines with "Risk →" and "Return" labels
```

### Prompt 15 — Sales Charts

```
Create src/components/charts/SalesCharts.tsx

Renders charts for the Smartphone use case.

Card 1 (top-left) — Market Share Donut:
- 5 segments: Apple 18% (slate), Samsung 22% (blue), Xiaomi 13% (amber),
  Google 4% (green), Others 43% (dark grey)
- DonutChart + inline legend at 9px

Card 2 (top-right) — Brand Sentiment Bars:
- 3 brands: Apple 84/100 (#94A3B8), Samsung 76/100 (#3B82F6),
  Google Pixel 88/100 (#10B981)
- For each: label + score right-aligned, then a CSS progress bar div
  (container: dark border-radius bar, fill: brand color at 85% opacity)

Card 3 (full width, bottom) — Quarterly Sales Trend:
- Grouped bar chart in pure SVG, viewBox 400×110
- 5 quarters (Q1 24 – Q1 25) × 3 brands
- Hard-coded data: Apple [58,52,61,79,62]M, Samsung [72,68,75,82,70]M,
  Google [9,10,11,13,12]M (all millions)
- Bars 16px wide, 2px gap between brands, 8px gap between groups
- X-axis labels below bars, brand colour legend below chart
```

### Prompt 16 — Economy Charts

```
Create src/components/charts/EconomyCharts.tsx

Renders charts for the World Top 10 Economies use case.

Card 1 (full width) — GDP Horizontal Bar Chart:
- 10 countries: USA $27.4T (blue), China $18.6T (red), Germany $4.5T (amber),
  Japan $4.1T (green), India $3.7T (pink), UK $3.1T (indigo),
  France $2.9T (teal), Brazil $2.1T (lime), Italy $2.1T (orange),
  Canada $2.1T (purple)
- Each row: country name (50px min-width), bar (flex:1, max relative to 28T),
  value label right-aligned in country colour
- Bar fills: CSS width % transitions with 1s ease on mount

Card 2 (bottom-left) — Inflation Rate 2024:
Pure SVG bar chart, 10 countries, amber bars.
Data: US 3.4, CN 0.2, DE 2.2, JP 2.8, IN 5.4, UK 3.2, FR 2.4, BR 4.8, IT 1.8, CA 2.9
X-axis labels, bars scale to max value.

Card 3 (bottom-right) — GDP Growth Forecast 2025:
Pure SVG bar chart, same 10 countries sorted by growth desc, green bars.
Data: IN 6.8, CN 4.6, US 2.1, BR 2.3, CA 1.8, UK 1.3, FR 1.1, JP 1.1, IT 0.7, DE 0.2
```

---

## Phase 8 — AI Query Panel

### Prompt 17 — AI Query Panel

```
Create src/components/ai/AIQueryPanel.tsx

Props: model: AIModel, caseKey: string

Uses the useAIQuery hook internally.

Renders:
1. Header row: coloured pulse dot, "AI Query Interface" label,
   model name badge (model.color accent) right-aligned

2. Preset buttons (flex-wrap): 3 buttons from QUERY_PRESETS[caseKey].
   On click: calls ask(presetText).
   Hover: border turns to accent, text brightens.

3. Input row: dark text input (flex:1) + "↗ Ask" button (accent border).
   Input: controlled, onKeyDown Enter triggers ask(), placeholder text.
   Button: disabled and dimmed while loading.

4. Response panel (conditional, appears when loading or response exists):
   Dark background, 1.7 line-height, 180px max-height with overflow-y auto.
   Loading state: "◌ Generating insights from {model.name}..." in accent colour.
   Response: plain text in textDim colour.
   Error: red warning text with ⚠ prefix.

When caseKey changes: call clearResponse() to reset.
```

---

## Phase 9 — Config Modal

### Prompt 18 — Config Modal

```
Create src/components/config/ConfigModal.tsx

Props: open, onClose, model, setModel, etlConfig, setEtlConfig

When open=false: return null.

Renders a fixed overlay (rgba 0,0,0,0.88) with a centred modal card
(600px wide, max-height 85vh, overflow-y auto, accent box-shadow glow).

Section 1 — AI Model Selection:
  Two groups: LOCAL (green badge) and CLOUD (purple badge).
  Each model: a clickable button card showing name (bold, coloured when selected)
  + provider + tag. Selected state: coloured border + 22% opacity background.
  Clicking a model calls setModel immediately and updates the nav bar badge.

Section 2 — ETL Infrastructure (6 rows):
  Each row: label (left) + select dropdown (right).
  Options from ETL_OPTIONS. Current value selected. onChange calls setEtlConfig.
  Row dividers (0.5px border-bottom).

Footer: full-width "✓ Save Configuration" button in accent style.
Clicking Save or clicking outside the modal calls onClose.
```

---

## Phase 10 — Navigation

### Prompt 19 — Navigation Components

```
Create src/components/nav/TopNavBar.tsx

Props: category, setCategory (+ sub reset), configOpen, setConfigOpen, model, categories

Renders sticky top bar (54px height, dark background, border-bottom, z-index 100):
- Left: Aethon logo mark (28px gradient square ◈) + "AETHON" title + subtitle
  "ETL · AI · MULTI-AGENT PLATFORM" in 8px muted uppercase
- Center: Category tab buttons (BFSI, Sales, Economy) with category icons.
  Active tab: coloured bg + coloured border. Hover: subtle bg tint.
  On click: setCategory(key) + reset sub to first sub-key
- Right: Active model badge (model.color pulse dot + name + tag) + Config button

Create src/components/nav/SubNavBar.tsx

Props: category, sub, setSub, subCases

Only renders when Object.keys(subCases).length > 1.
Renders a bar below the top nav (bgPanel background) with sub-use-case tabs.
Same styling pattern as category tabs but smaller (11px font).
```

---

## Phase 11 — Demo Panel & App Root

### Prompt 20 — Demo Panel

```
Create src/panels/DemoPanel.tsx — the main panel orchestrator.

Props: caseKey, useCase, model, etlConfig

Integrates: usePipeline hook, all sub-components.

Renders vertically stacked:
1. PanelHeader: use case title + description + dataset badges (flex-wrap pills)
   + Run/Stop button (green when idle, red when running).
   Button text toggles "▶ Run ETL Pipeline" / "◼ Stop Pipeline".

2. KPI Grid (auto-fit minmax 130px): static KPI cards from useCase.kpis.
   When running: 2 extra live KPI cards: "Records Processed" (from pipeline state)
   and "Pipeline Errors" (random 0-2, red if > 0).

3. ETL Pipeline Visualiser card with config info line below.

4. Two-column grid: AgentFrameworkPanel (left) + LogTerminal (right).

5. Domain Charts section (label + domain-appropriate chart component).
   Route by caseKey: stock/advisory/fund → BFSICharts,
   smartphone → SalesCharts, economies → EconomyCharts.

6. AI Query Panel.

When caseKey or model changes: call resetPipeline().
```

### Prompt 21 — App Root

```
Create src/App.tsx — the root component managing global app state.

State: category (string), sub (string), configOpen (bool),
model (AIModel), etlConfig (ETLConfig).

Initialise from DEFAULT_MODEL and DEFAULT_ETL_CONFIG.

Derived values: cat = DEMOS[category], subCases = cat.sub,
activeCase = subCases[sub] || first value of subCases.

setCategory handler: update category, reset sub to first key of new category's sub.
setSub handler: update sub (DemoPanel handles pipeline reset internally).

Renders (top to bottom):
- ConfigModal (always mounted, open prop controlled)
- TopNavBar
- SubNavBar (conditional)
- Grid background div (full page, subtle 40px grid lines via CSS background-image)
- ArchitectureBar (below nav, above panel, full width)
- DemoPanel (max-width 1400px, centred, padded)

Apply font-family monospace globally via a style tag or CSS variable.
Background: #0A0E1A throughout.
```

---

## Phase 12 — Infrastructure & Deployment

### Prompt 22 — Dockerfile & Nginx

```
Create a production Dockerfile using multi-stage build:
Stage 1 (builder): node:20-alpine, WORKDIR /app, copy package*.json,
npm ci, copy source, npm run build.
Stage 2 (runner): nginx:alpine, copy /app/dist to /usr/share/nginx/html,
copy nginx.conf.

Create nginx.conf:
- server on port 80
- gzip on for text/html, application/javascript, text/css, application/json
- try_files $uri $uri/ /index.html (SPA fallback routing)
- Cache-Control headers: immutable for hashed assets, no-cache for index.html
- Set Content-Security-Policy allowing:
  api.anthropic.com, generativelanguage.googleapis.com, api.openai.com,
  localhost:11434 as connect-src

Create .dockerignore: node_modules, dist, .env, .git
```

### Prompt 23 — GitHub Actions CI/CD

```
Create .github/workflows/ci.yml:

Triggers: push and pull_request to main branch.

Jobs:
1. lint-and-type-check:
   - ubuntu-latest, node 20
   - npm ci, npm run type-check, npm run lint

2. test:
   - npm ci, npm run test (Vitest)
   - Upload coverage artifact

3. build:
   - npm ci, npm run build
   - Upload dist artifact
   - Report bundle size (echo dist size using du -sh dist/)

4. docker-build (only on push to main):
   - Build Docker image
   - Tag as aethon:latest and aethon:{github.sha}
   - Push to GitHub Container Registry (ghcr.io)

All jobs use npm ci (not npm install) for reproducible installs.
Cache node_modules using actions/cache with package-lock.json as key.
```

---

## Phase 13 — Testing

### Prompt 24 — Unit Tests

```
Create test files using Vitest:

src/lib/ai/__tests__/providers.test.ts:
- Mock fetch globally
- Test callAI routes to correct provider based on model.provider
- Test Anthropic: verify correct headers (x-api-key, anthropic-version),
  correct body shape, extracts data.content[0].text
- Test error handling: 401 returns { error: "Invalid API key..." }
- Test error handling: 429 returns { error: "Rate limit..." }
- Test error handling: network failure returns graceful error

src/hooks/__tests__/usePipeline.test.ts:
- Use @testing-library/react renderHook
- Test startPipeline: running becomes true, logs start populating
- Test stopPipeline: running becomes false immediately
- Test resetPipeline: all state returns to initial values
- Test auto-stop: pipeline stops after all ETL_LOGS consumed
- Test cleanup: timer is cleared on unmount (no memory leak)

src/data/__tests__/usecases.test.ts:
- All 3 categories exist in DEMOS
- Each category has correct color and at least 1 sub-case
- Each use case has 5 agents, 4+ kpis, 3+ datasets
- All caseKeys are unique across all use cases
```

### Prompt 25 — Component Tests

```
Create component tests using @testing-library/react + Vitest:

src/components/pipeline/__tests__/LogTerminal.test.tsx:
- Renders placeholder when logs=[]
- Renders each log line with correct tag colour
- New lines have slide-in animation class
- Container auto-scrolls when new log added

src/components/shared/__tests__/KPICard.test.tsx:
- Renders label, value, delta correctly
- Delta starting with "+" renders in green
- Delta "Live" renders in green
- Missing delta: no delta element rendered

src/components/ai/__tests__/AIQueryPanel.test.tsx:
- Mock useAIQuery hook
- Preset buttons render (3 per domain)
- Clicking preset calls ask with correct text
- Enter key in input calls ask
- Loading state shows "◌ Generating insights..."
- Error state shows "⚠" prefix
- Response text displays when provided
```

---

## Phase 14 — Polish & Production Readiness

### Prompt 26 — Performance Optimisation

```
Audit and optimise the Aethon React app for demo performance:

1. Wrap all chart data generation in useMemo with stable seeds
   (not Math.random() on every render — initialise once on mount).

2. Memoize all chart components with React.memo.
   Charts should NOT re-render when pipeline runs — only KPIs and logs update.

3. Extract the log terminal append logic to a direct DOM mutation
   (document.getElementById + appendChild) inside the pipeline tick callback
   INSTEAD of React setState on every tick. This prevents full re-renders
   during the pipeline simulation. Only setState for stage and agent updates.

4. Add React.memo to AgentBubble — it re-renders on every tick otherwise.

5. Use useCallback on all event handlers passed as props (startPipeline,
   stopPipeline, toggleConfig, selectModel, selectCategory, selectSub).

6. Verify bundle size is under 2MB gzipped using rollup-plugin-visualizer.
   Report the 5 largest modules.

Target: zero React re-renders of chart components during active pipeline run.
```

### Prompt 27 — Error Boundaries & Graceful Degradation

```
Add production-quality error handling to Aethon:

1. Create src/components/shared/ErrorBoundary.tsx — a React class component
   error boundary. On error: show a dark card with "Something went wrong" message,
   error details in monospace, and a "Reload" button. Log to console.error.

2. Wrap DemoPanel in ErrorBoundary so a chart crash doesn't kill the whole app.

3. Wrap each chart component (BFSICharts, SalesCharts, EconomyCharts) in
   its own ErrorBoundary with a "Chart unavailable" fallback card.

4. In AIQueryPanel: if VITE_ANTHROPIC_API_KEY is not set in import.meta.env,
   show an inline info banner: "Configure API keys in .env to enable AI queries.
   See .env.example for setup." Don't show this banner after a successful query.

5. In the Ollama provider: before the API call, do a quick HEAD request to
   VITE_OLLAMA_BASE_URL to check if the server is reachable. If not reachable,
   return immediately with error "Local model server offline. Run: ollama serve"
   without waiting for the full timeout.

6. Add a global window.onerror handler in main.tsx that logs errors
   with context { app: "aethon", version: VITE_APP_VERSION }.
```

---

## Quick Reference — Prompt Order

| # | Prompt | File(s) Created |
|---|---|---|
| 1 | Init | Project scaffold, tsconfig, vite.config.ts |
| 2 | Core Types | src/types/index.ts |
| 3 | Use Case Data | src/data/usecases.ts |
| 4 | Models & ETL Config | src/data/models.ts, etlConfig.ts, presets.ts, etlLogs.ts |
| 5 | AI Provider Layer | src/lib/ai/providers.ts |
| 6 | System Prompts | src/lib/ai/prompts.ts |
| 7 | Pipeline Hook | src/hooks/usePipeline.ts |
| 8 | AI Query Hook | src/hooks/useAIQuery.ts |
| 9 | Shared Components | src/components/shared/*.tsx + src/lib/theme.ts |
| 10 | Architecture Bar | src/components/shared/ArchitectureBar.tsx |
| 11 | ETL Pipeline Visualiser | src/components/pipeline/ETLPipeline.tsx |
| 12 | Log Terminal | src/components/pipeline/LogTerminal.tsx |
| 13 | Agent Framework Panel | src/components/agents/AgentFrameworkPanel.tsx |
| 14 | BFSI Charts | src/components/charts/BFSICharts.tsx |
| 15 | Sales Charts | src/components/charts/SalesCharts.tsx |
| 16 | Economy Charts | src/components/charts/EconomyCharts.tsx |
| 17 | AI Query Panel | src/components/ai/AIQueryPanel.tsx |
| 18 | Config Modal | src/components/config/ConfigModal.tsx |
| 19 | Navigation | src/components/nav/TopNavBar.tsx, SubNavBar.tsx |
| 20 | Demo Panel | src/panels/DemoPanel.tsx |
| 21 | App Root | src/App.tsx |
| 22 | Dockerfile & Nginx | Dockerfile, nginx.conf, .dockerignore |
| 23 | GitHub Actions | .github/workflows/ci.yml |
| 24 | Unit Tests | src/lib/ai/__tests__/, src/hooks/__tests__/, src/data/__tests__/ |
| 25 | Component Tests | src/components/**/__tests__/ |
| 26 | Performance | Optimisation pass across all components |
| 27 | Error Handling | ErrorBoundary.tsx + provider resilience |

---

## Tips for Best Results

**Context carry-forward:** Paste the relevant types from `src/types/index.ts`
into each subsequent prompt as a reference block. This prevents type drift.

**Iterating on a single prompt:** If a component isn't right, follow up with:
`"The [ComponentName] renders correctly but [specific issue]. Fix only that,
keep everything else identical."`

**Adding a new use case later:**
```
Using the existing Aethon codebase, add a new use case to the BFSI category:

Key: "insurance"
Label: "Insurance Risk Analytics"
Icon: ⊛
Agents: [Claims Agent, Underwriting Agent, Fraud Agent, Actuarial Agent, Report Agent]
KPIs: [Policies Tracked 840K, Claims/Day 2400, Fraud Detection 94.2%, Loss Ratio 58.3%]
Datasets: [Claims DB, Policy Registry, Weather API, Court Records, Reinsurance Feed]
caseKey: "insurance"

Add to DEMOS.BFSI.sub, add system prompt to prompts.ts,
add 3 preset queries to presets.ts,
create InsuranceCharts.tsx following the BFSICharts pattern,
register in DemoPanel chart routing.
```

**Switching to a different AI coding tool:** All prompts are tool-agnostic.
They work identically in Claude Projects, Cursor Composer, GitHub Copilot Workspace,
and Windsurf. For Cursor, prefix each prompt with `@codebase` to give it full context.

---

*Aethon Implementation Prompts v1.0.0 · April 2026*
*Technology Consulting Practice*
