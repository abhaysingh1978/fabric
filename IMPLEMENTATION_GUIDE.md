# Implementation Guide & Developer Runbook

**Project:** Fabric — Agentic ETL, AI & Reporting Platform
**Version:** 1.0.0
**Date:** April 2026

---

## 1. Repository Structure

```
fabric/
├── README.md                      # Project overview & quick start
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example                   # Template — never commit .env
├── .gitignore
├── Dockerfile
├── docker-compose.yml
│
├── public/
│   └── favicon.svg
│
├── src/
│   ├── main.tsx                   # React entry point
│   ├── App.tsx                    # Root component
│   │
│   ├── data/                      # Static data definitions
│   │   ├── models.ts              # AI model definitions
│   │   ├── usecases.ts            # BFSI / Sales / Economy use case data
│   │   ├── etlLogs.ts             # ETL log message library
│   │   └── presets.ts             # AI query presets per domain
│   │
│   ├── components/
│   │   ├── nav/
│   │   │   ├── TopNavBar.tsx
│   │   │   └── SubNavBar.tsx
│   │   ├── config/
│   │   │   └── ConfigModal.tsx
│   │   ├── pipeline/
│   │   │   ├── ETLPipeline.tsx
│   │   │   └── LogTerminal.tsx
│   │   ├── agents/
│   │   │   └── AgentFrameworkPanel.tsx
│   │   ├── charts/
│   │   │   ├── Sparkline.tsx
│   │   │   ├── DonutChart.tsx
│   │   │   ├── BarChart.tsx
│   │   │   ├── BubblePlot.tsx
│   │   │   ├── BFSICharts.tsx
│   │   │   ├── SalesCharts.tsx
│   │   │   └── EconomyCharts.tsx
│   │   ├── ai/
│   │   │   └── AIQueryPanel.tsx
│   │   └── shared/
│   │       ├── KPICard.tsx
│   │       ├── Badge.tsx
│   │       └── ArchitectureBar.tsx
│   │
│   ├── panels/
│   │   └── DemoPanel.tsx          # Main panel orchestrator
│   │
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── providers.ts       # AI provider abstraction
│   │   │   └── prompts.ts         # System prompts per domain
│   │   ├── pipeline/
│   │   │   └── simulator.ts       # ETL pipeline simulation engine
│   │   └── utils.ts
│   │
│   ├── hooks/
│   │   ├── usePipeline.ts         # Pipeline state & tick logic
│   │   └── useAIQuery.ts          # AI query state & fetch logic
│   │
│   └── types/
│       └── index.ts               # Shared TypeScript interfaces
│
├── docs/
│   ├── BRD.md
│   ├── FRD.md
│   ├── TECH_ARCHITECTURE.md
│   ├── API_SPEC.md
│   ├── IMPLEMENTATION_GUIDE.md    # This file
│   ├── DATA_DICTIONARY.md
│   └── DEMO_SCRIPT.md
│
└── architecture/
    ├── system-diagram.svg
    ├── agent-flow.svg
    └── data-flow.svg
```

---

## 2. Prerequisites

| Tool | Min Version | Install |
|---|---|---|
| Node.js | 20.x LTS | https://nodejs.org |
| npm | 10.x | bundled with Node |
| Git | 2.40+ | https://git-scm.com |
| Docker | 24.x | https://docker.com |
| Docker Compose | v2 | bundled with Docker Desktop |
| Ollama (optional) | 0.5+ | https://ollama.ai |

---

## 3. Local Development Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-org/fabric.git
cd fabric
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```bash
# Required for cloud AI models:
VITE_ANTHROPIC_API_KEY=sk-ant-api03-...
VITE_GOOGLE_API_KEY=AIzaSy...
VITE_OPENAI_API_KEY=sk-proj-...

# Optional for local models (if running Ollama):
VITE_OLLAMA_BASE_URL=http://localhost:11434
```

> **Note:** Demo mode works without any API keys — AI query will show a graceful error message. The ETL pipeline simulation and all dashboards work fully offline.

### Step 4: (Optional) Setup Local Models with Ollama

```bash
# Install Ollama from https://ollama.ai, then:
ollama serve &

# Pull the models you want (pick based on available VRAM):
ollama pull deepseek-r1:7b        # ~4GB VRAM
ollama pull gemma3:27b            # ~16GB VRAM
ollama pull phi4:14b              # ~8GB VRAM
ollama pull mistral-nemo:12b      # ~7GB VRAM
ollama pull llama3.3:70b          # ~40GB VRAM (GPU required)

# Verify models are available:
ollama list
```

### Step 5: Start Development Server

```bash
npm run dev
# Open http://localhost:5173
```

---

## 4. Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Type check without building
npm run type-check

# Lint
npm run lint
```

---

## 5. Docker Deployment

### 5.1 Build and Run with Docker

```bash
# Build image
docker build -t fabric:latest .

# Run (pass API keys as environment variables)
docker run -p 3000:80 \
  -e VITE_ANTHROPIC_API_KEY=sk-ant-... \
  -e VITE_GOOGLE_API_KEY=AIza... \
  fabric:latest

# Open http://localhost:3000
```

### 5.2 Docker Compose (with Ollama)

```bash
# Start full stack (app + local model server)
docker-compose up -d

# View logs
docker-compose logs -f fabric-app

# Stop
docker-compose down
```

### 5.3 Dockerfile

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 6. Adding a New Use Case

### Step 1: Define the Use Case Data

Edit `src/data/usecases.ts`:

```typescript
// Add to the appropriate category's `sub` object
healthcare: {
  label: "Healthcare Analytics",
  icon: "⊕",
  desc: "Patient outcomes ETL, clinical trial analysis, drug performance dashboards",
  datasets: ["EHR Systems", "Clinical Trials DB", "Claims Data", "FDA Feed"],
  agents: ["Outcomes Agent", "Trial Agent", "Claims Agent", "Compliance Agent", "Report Agent"],
  kpis: [
    { l: "Patients Covered", v: "2.4M", d: "+180K" },
    { l: "Trials Tracked", v: "840", d: "+12" },
    { l: "Compliance Score", v: "98.4%", d: "+0.3%" },
    { l: "Reports/Month", v: "320", d: "Auto" },
  ],
  caseKey: "healthcare",
},
```

### Step 2: Add AI Query Presets

Edit `src/data/presets.ts`:

```typescript
healthcare: [
  "What are the top risk factors for readmission?",
  "Summarise trial performance for Drug Cohort A",
  "Flag anomalies in claims data for Q1",
],
```

### Step 3: Add System Prompt

Edit `src/lib/ai/prompts.ts`:

```typescript
healthcare: "You are a healthcare data analyst. Provide concise clinical and operational insights based on the dashboard data (2 short paragraphs).",
```

### Step 4: Build Domain Charts

Create `src/components/charts/HealthcareCharts.tsx` following the pattern of `BFSICharts.tsx`.

### Step 5: Add ETL Log Messages

Edit `src/data/etlLogs.ts` — add a `healthcare` entry following the existing pattern.

### Step 6: Register in the Category Map

Edit `src/data/usecases.ts` — add a new top-level category or append to `Sales`/`BFSI`.

**Estimated time: 2–4 hours per new use case.**

---

## 7. Configuration Reference

### 7.1 AI Models Registry

Edit `src/data/models.ts` to add new models:

```typescript
{
  id: "new-model-id",      // Used for API calls
  name: "Display Name",    // Shown in UI
  provider: "Local",       // "Anthropic" | "Google" | "OpenAI" | "Local"
  tag: "7B",               // Version/size shown in badge
  color: "#FF6B35",        // Hex accent colour for this model
}
```

### 7.2 ETL Configuration Options

Edit `src/data/etlConfig.ts` to add new options to any dropdown:

```typescript
export const ETL_CONFIG_OPTIONS = {
  batchSize: ["1,000", "10,000", "100,000", "1,000,000"],
  refreshInterval: ["5s", "15s", "30s", "1min", "5min"],
  parallelAgents: ["2", "4", "8", "16", "32"],
  vectorStore: ["Pinecone", "Weaviate", "Qdrant", "pgvector", "Chroma"],
  dataWarehouse: ["Snowflake", "BigQuery", "Redshift", "DuckDB", "Databricks"],
  streamProcessor: ["Kafka", "Flink", "Spark Streaming", "Pulsar", "Kinesis"],
};
```

---

## 8. Demo Script (Quick Reference)

### Pre-Demo Checklist

- [ ] Open Fabric in Chrome at full screen (F11)
- [ ] Verify AI API key is set (test one query)
- [ ] If using local models: confirm `ollama serve` is running
- [ ] Set desired model in Config before the meeting starts
- [ ] Have the config panel closed when client enters

### Demo Flow (15 minutes)

| Min | Action | Talking Point |
|---|---|---|
| 0–2 | Overview of Fabric landing | "This is our unified agentic platform — three verticals, one framework" |
| 2–4 | BFSI → Stock Analysis → Run Pipeline | "Watch 200K market records flow through 6 ETL stages in under 3 seconds" |
| 4–5 | Point to Agent Framework | "Five specialised agents, communicating via A2A — Technical Analysis feeding Risk in real time" |
| 5–7 | Click AI preset query | "Now I'll query our AI layer — it's context-aware for this domain" |
| 7–9 | Open Config, switch to DeepSeek | "We can swap to a local model — no API key, your data never leaves your infrastructure" |
| 9–10 | Ask same question with DeepSeek | "Same query, same context, different model — you control the AI stack" |
| 10–12 | Navigate to Economy | "Let's look at our macro intelligence module — 10 economies, 240 indicators" |
| 12–14 | Navigate to Sales → Smartphone | "Apple vs Samsung vs Google Pixel — live market intelligence with sentiment scoring" |
| 14–15 | Return to BFSI → Fund Performance | "For asset managers, automated attribution reporting — monthly board packs generated by agents" |

---

## 9. Troubleshooting

| Issue | Likely Cause | Fix |
|---|---|---|
| AI query returns error | Missing/invalid API key | Check `.env`, update Config panel |
| Local model slow / timeout | Model too large for available RAM | Switch to smaller model (7B/12B) |
| Ollama not reachable | Ollama server not running | Run `ollama serve` in terminal |
| Pipeline doesn't start | JavaScript error in browser | Open DevTools console, report error |
| Blank screen on load | Build error | Run `npm run build` and check for errors |
| Charts not rendering | SVG/Canvas issue | Try Chrome; check browser version |
| CORS error on AI call | Browser blocking request | Ensure API key is valid; check CSP headers |

---

## 10. Testing

```bash
# Unit tests
npm run test

# Component tests (Vitest + Testing Library)
npm run test:components

# E2E tests (Playwright)
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Key Test Cases

- Pipeline starts, ticks, and completes successfully
- All 5 use cases load without errors
- Config modal opens, model changes, closes
- AI query fires and displays response (mock API)
- Category and sub-tab navigation resets pipeline state

---

*Document End — Implementation Guide v1.0.0*
