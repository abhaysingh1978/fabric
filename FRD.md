# Functional Requirements Document (FRD)

**Project:** Fabric — Agentic ETL, AI & Reporting Platform
**Version:** 1.0.0
**Status:** Draft
**Prepared by:** Technology Consulting Practice
**Date:** April 2026
**Linked BRD:** BRD v1.0.0

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [User Roles & Personas](#2-user-roles--personas)
3. [Functional Modules](#3-functional-modules)
4. [Feature Specifications](#4-feature-specifications)
5. [Navigation & Routing](#5-navigation--routing)
6. [Data Models](#6-data-models)
7. [AI Integration Spec](#7-ai-integration-spec)
8. [ETL Pipeline Spec](#8-etl-pipeline-spec)
9. [Agent Framework Spec](#9-agent-framework-spec)
10. [Configuration System](#10-configuration-system)
11. [Error Handling](#11-error-handling)
12. [Non-Functional Requirements](#12-non-functional-requirements)

---

## 1. System Overview

Fabric is a single-page application (SPA) with a component-driven React architecture. It consists of six primary functional modules that work in concert:

```
┌─────────────────────────────────────────────────────────┐
│                      FABRIC SPA                         │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────────┐ │
│  │Navigation│  │Config    │  │ Architecture Overview  │ │
│  │Module    │  │Module    │  │ Bar                    │ │
│  └──────────┘  └──────────┘  └───────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Demo Panel (per use case)            │  │
│  │  ┌──────────┐ ┌─────────────┐ ┌───────────────┐  │  │
│  │  │ETL       │ │Multi-Agent  │ │Dashboard      │  │  │
│  │  │Pipeline  │ │Framework    │ │Charts         │  │  │
│  │  └──────────┘ └─────────────┘ └───────────────┘  │  │
│  │  ┌───────────────────────────────────────────┐    │  │
│  │  │       AI Query Interface                  │    │  │
│  │  └───────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 2. User Roles & Personas

| Persona | Description | Primary Actions |
|---|---|---|
| **Demo Facilitator** | Consultant running the platform live in a client meeting | Switch categories, run pipelines, trigger AI queries, change config |
| **Observer/Client** | Prospect watching the demo | Read-only experience via facilitator's screen |
| **Developer** | Engineer extending or maintaining the platform | Code-level configuration, adding use cases |

For v1, all interactive users are assumed to be Demo Facilitators. No authentication is required.

---

## 3. Functional Modules

### Module 1: Navigation

**FM-NAV-01: Top Navigation Bar**
- Displays Fabric logo and brand identity (top-left)
- Renders category tabs: BFSI, Sales, Economy with distinct colour coding
- Displays active AI model indicator (top-right) with model name, provider, and pulse indicator
- Renders Configuration (⚙) button (top-right)
- Sticks to top of viewport on scroll
- Active category highlighted with colour accent matching category colour

**FM-NAV-02: Sub-Navigation Bar**
- Appears only when the active category has more than one sub-use-case
- Renders sub-use-case tabs with icons
- Selecting a sub-tab resets pipeline state and loads the corresponding demo panel
- Hidden for categories with a single sub-use-case (e.g., Sales v1)

### Module 2: Configuration Panel

**FM-CFG-01: Modal Overlay**
- Opens as a modal overlay on Config button click
- Closes on (a) explicit close button click, (b) clicking outside the modal, (c) Save Configuration button
- Renders without page reload; state persists across opens

**FM-CFG-02: AI Model Selection**
- Two sections: Local Models and Cloud Models
- Each model rendered as a selectable card showing: model name, provider, parameter size/version tag
- Selected model highlighted with model-specific accent colour
- Selection immediately updates the active model indicator in the nav bar

**FM-CFG-03: ETL Infrastructure Configuration**
- Six configurable parameters rendered as label + dropdown rows:
  1. Batch Size: 1,000 / 10,000 / 100,000 / 1,000,000
  2. Refresh Interval: 5s / 15s / 30s / 1min / 5min
  3. Parallel Agents: 2 / 4 / 8 / 16 / 32
  4. Vector Store: Pinecone / Weaviate / Qdrant / pgvector / Chroma
  5. Data Warehouse: Snowflake / BigQuery / Redshift / DuckDB / Databricks
  6. Stream Processor: Kafka / Flink / Spark Streaming / Pulsar / Kinesis

### Module 3: Architecture Overview Bar

**FM-ARCH-01: Six-Cell Architecture Bar**
Permanently displayed below the navigation. Six cells, each displaying:
- An icon
- A label (e.g., "Stream Layer")
- A dynamic value sourced from current config or use case (e.g., "Kafka", "5 agents")
- A top border accent in cell-specific colour
- Cells: Data Sources | Stream Layer | Warehouse | Vector Store | AI Agents | AI Model

Values update immediately when configuration changes.

### Module 4: Demo Panel

**FM-PANEL-01: Panel Header**
- Use case title and description
- Dataset source badges (pill tags listing all data sources for the use case)
- Run/Stop ETL Pipeline button (toggles between run and stop state)

**FM-PANEL-02: KPI Cards**
- Minimum 4 static KPI cards per use case with label, value, and delta indicator
- When pipeline is running: 2 additional live KPI cards appear (Records Processed, Pipeline Errors)
- Live KPI values update every pipeline tick

**FM-PANEL-03: ETL Pipeline Visualiser**
- Six-stage pipeline diagram rendered as numbered circles connected by lines
- Stages: Extract → Validate → Transform → Aggregate → Load → Index
- Stage states: Idle (muted), Active (accent colour with glow), Done (green check)
- Infrastructure config line displayed below pipeline (stream processor, warehouse, batch size, agents, vector store)

**FM-PANEL-04: Multi-Agent Framework Panel**
- Renders one agent bubble per agent in the use case's agent list
- Each bubble: status dot, agent name
- Status dot animates (pulse) when agent is active
- Border and shadow light up in agent-specific colour when active
- Active agent count / total displayed bottom-right
- A2A message indicator displayed with colour coding

**FM-PANEL-05: Live ETL Log Terminal**
- Scrollable log panel, dark background, monospace font
- Log lines streamed one-by-one as pipeline runs
- Each line: line number, tag (colour-coded by stage), message text
- Auto-scrolls to latest entry
- Idle state shows "▌ Pipeline idle. Press Run to start."

**FM-PANEL-06: Analytics Dashboard**
Domain-specific chart panels — see Section 4 for per-domain spec.

**FM-PANEL-07: AI Query Interface**
- See Section 7 for full spec

### Module 5: Dashboard Charts

**FM-CHART-01: BFSI Charts (Stock / Advisory / Fund)**
- Price History: 30-point line sparkline with area fill, delta label
- Volume Trend: 30-point line sparkline, spike indicator
- Sector Allocation: Donut chart (5 segments) with legend
- Risk/Return Matrix: SVG bubble plot with labelled data points

**FM-CHART-02: Sales / Smartphone Charts**
- Global Market Share: Donut chart (5 brands) with legend
- Brand Sentiment: Horizontal bar progress per brand (Apple, Samsung, Google Pixel)
- Quarterly Sales Trend: Grouped bar chart (3 brands × 5 quarters)

**FM-CHART-03: Economy Charts**
- GDP Horizontal Bar: 10-country ranked bar chart with labels and values
- Inflation Rate: Vertical bar chart (10 countries)
- GDP Growth Forecast: Vertical bar chart (10 countries, sorted by growth)

### Module 6: AI Query Interface

See Section 7.

---

## 4. Feature Specifications

### 4.1 Pipeline Run Behaviour

| Event | System Response |
|---|---|
| User clicks "▶ Run ETL Pipeline" | Reset logs, reset stage to 0, reset active agents, begin tick loop |
| Each tick (~160–260ms) | Append next log line, advance stage, activate next agent, update live KPIs |
| Pipeline reaches last log entry | Set running=false, final state preserved on screen |
| User clicks "◼ Stop Pipeline" | Immediately stop tick loop, preserve current state |
| User navigates to new use case | Reset all pipeline state |

### 4.2 AI Query Behaviour

| Event | System Response |
|---|---|
| User clicks preset query | Populate input, trigger API call immediately |
| User types + presses Enter | Trigger API call |
| User clicks "↗ Ask" | Trigger API call |
| API call in flight | Show loading indicator with model name; disable repeat sends |
| API returns success | Display response in scrollable panel below input |
| API returns error | Display contextual error message with provider fallback suggestion |

### 4.3 Category/Sub Navigation

| Event | System Response |
|---|---|
| Click category tab | Set active category, set sub to first sub-use-case, reset all demo state |
| Click sub-tab | Set active sub-use-case, reset demo state |
| Active state | Highlight tab with category/sub colour accent |

---

## 5. Navigation & Routing

Fabric is a single-page application. All navigation is state-driven (no URL routing required for v1). Navigation state:

```
AppState {
  category: "BFSI" | "Sales" | "Economy"
  sub: string (key of sub-use-case within category)
  configOpen: boolean
}
```

State transitions are synchronous and trigger immediate re-render.

---

## 6. Data Models

### 6.1 Use Case Definition

```typescript
interface UseCase {
  label: string;           // Display name
  icon: string;            // Unicode icon character
  desc: string;            // Description paragraph
  datasets: string[];      // Source data labels (for badges)
  agents: string[];        // Agent names (for agent framework panel)
  kpis: KPI[];             // Static KPI cards
  caseKey: string;         // Key for chart routing and AI context
}

interface KPI {
  l: string;               // Label
  v: string;               // Value
  d: string;               // Delta string
}
```

### 6.2 AI Model Definition

```typescript
interface AIModel {
  id: string;              // Unique identifier
  name: string;            // Display name
  provider: string;        // "Anthropic" | "Google" | "OpenAI" | "Local"
  tag: string;             // Version / size tag
  color: string;           // Hex accent colour
}
```

### 6.3 ETL Configuration

```typescript
interface ETLConfig {
  batchSize: string;
  refreshInterval: string;
  parallelAgents: string;
  vectorStore: string;
  dataWarehouse: string;
  streamProcessor: string;
}
```

### 6.4 Application State

```typescript
interface AppState {
  category: string;
  sub: string;
  configOpen: boolean;
  model: AIModel;
  etl: ETLConfig;
  running: boolean;
  logs: string[];
  activeStage: number;        // 0–5
  activeAgents: number[];     // indices of active agents
  logIdx: number;
  records: number;
  throughput: number;
  aiResponse: string;
  aiLoading: boolean;
  aiQuery: string;
}
```

---

## 7. AI Integration Spec

### 7.1 API Configuration

**Primary Endpoint (Anthropic):**
```
POST https://api.anthropic.com/v1/messages
Headers: Content-Type: application/json
Body: {
  model: "claude-sonnet-4-20250514",
  max_tokens: 1000,
  system: <domain_system_prompt>,
  messages: [{ role: "user", content: <query> }]
}
```

**Model Routing:**
When a user selects a model in Config, the system maps to the corresponding API endpoint and auth mechanism:

| Model | Endpoint | Auth |
|---|---|---|
| Claude Opus / Sonnet | api.anthropic.com/v1/messages | x-api-key header |
| Gemini Pro / Flash | generativelanguage.googleapis.com | API key query param |
| GPT-4o | api.openai.com/v1/chat/completions | Bearer token |
| DeepSeek / Llama / Gemma / Mistral / Phi | localhost:11434/api/generate (Ollama) | None (local) |

### 7.2 Domain System Prompts

| Domain Key | System Prompt |
|---|---|
| `stock` | "You are a financial data analyst. The user is viewing a stock analysis ETL dashboard with data from NYSE/NASDAQ. Provide concise, actionable insights (2 short paragraphs)." |
| `advisory` | "You are a wealth management AI. The user views a financial advisory dashboard. Provide portfolio recommendations and risk analysis concisely." |
| `fund` | "You are a fund performance analyst. Provide attribution and performance analysis concisely." |
| `smartphone` | "You are a consumer electronics market researcher. Analyse Apple, Samsung, and Google Pixel competitive dynamics concisely." |
| `economies` | "You are a macroeconomic analyst. Compare the world's top 10 economies with data-driven insights concisely." |

### 7.3 Preset Queries Per Domain

| Domain | Preset 1 | Preset 2 | Preset 3 |
|---|---|---|---|
| stock | "What sectors show bullish momentum today?" | "Identify top 5 breakout candidates" | "Analyse correlation between tech & interest rates" |
| advisory | "Rebalance portfolio for 60/40 target" | "Tax loss harvesting opportunities" | "Risk-adjusted return vs benchmark" |
| fund | "Which fund outperformed on risk-adjusted basis?" | "Factor exposure breakdown for Fund A" | "Generate board report summary" |
| smartphone | "Who leads market share in Southeast Asia?" | "Sentiment trend: iPhone 16 vs Galaxy S25" | "Price elasticity analysis by region" |
| economies | "Compare GDP growth: US vs China vs India" | "Which economy faces highest inflation risk?" | "Forecast trade balance shifts post-tariffs" |

### 7.4 Error Handling

| Condition | Response |
|---|---|
| Network error | "⚠ Could not reach AI API. Check connection or API key configuration." |
| 401 Unauthorized | "⚠ Invalid API key. Update your key in the Config panel." |
| 429 Rate Limited | "⚠ Rate limit reached. Wait a moment or switch to a different model." |
| Local model offline | "⚠ Local model server not reachable. Ensure Ollama is running on localhost:11434." |

---

## 8. ETL Pipeline Spec

### 8.1 Pipeline Stages

| Stage | Index | Description |
|---|---|---|
| Extract | 0 | Connect to data sources, pull raw records |
| Validate | 1 | Schema checks, null detection, outlier flagging |
| Transform | 2 | Normalisation, UTC conversion, feature engineering |
| Aggregate | 3 | Rolling windows, cross-dimensional aggregation |
| Load | 4 | Upsert to data warehouse, cache invalidation |
| Index | 5 | Vector embedding generation, semantic index update |

### 8.2 Log Entry Taxonomy

Log entries are prefixed with stage tags for colour-coded rendering:

| Tag | Colour | Represents |
|---|---|---|
| `[EXTRACT]` | Cyan | Data source connections and pulls |
| `[VALIDATE]` | Amber | Schema and quality checks |
| `[TRANSFORM]` | Purple | Transformation operations |
| `[AGGREGATE]` | Green | Aggregation operations |
| `[LOAD]` | Blue | Database writes and cache ops |
| `[INDEX]` | Pink | Vector index operations |
| `[AGENTS]` | Cyan bright | Agent consumption/processing |
| `[A2A]` | Orange | Agent-to-agent communication events |
| `[REPORT]` | Lime | Report generation events |
| `[PIPELINE]` | White | Pipeline lifecycle events |

### 8.3 Stage Progression Algorithm

```
activeStage = Math.min(5, Math.floor((logIndex / totalLogs) * 6))
```

Agents activate progressively after log index 8, cycling through the agent list.

---

## 9. Agent Framework Spec

### 9.1 Agent Definitions Per Use Case

**BFSI — Stock Analysis**
1. Market Data Agent — Ingests and normalises market feeds
2. Technical Analysis Agent — Computes indicators and signals
3. Sentiment Agent — Processes news and social sentiment
4. Risk Agent — Updates portfolio risk exposures
5. Report Agent — Generates narrative and chart reports

**BFSI — Financial Advisory**
1. Portfolio Agent — Manages portfolio construction logic
2. Risk Profiler Agent — Maintains client risk profiles
3. Rebalance Agent — Generates rebalancing instructions
4. Tax Agent — Identifies tax optimisation opportunities
5. Client Report Agent — Generates client-facing reports

**BFSI — Fund Performance**
1. Performance Agent — Calculates fund returns vs benchmarks
2. Attribution Agent — Breaks down performance attribution
3. Factor Agent — Analyses factor exposures
4. Compliance Agent — Checks regulatory requirements
5. Board Report Agent — Generates board-level narratives

**Sales — Smartphone Research**
1. Market Share Agent — Tracks global market share data
2. Sentiment Agent — Analyses product reviews at scale
3. Pricing Agent — Monitors price positioning across channels
4. Channel Agent — Tracks distribution and channel data
5. Forecast Agent — Generates sales forecasts by region/SKU

**Economy — Top 10 Economies**
1. GDP Agent — Tracks and projects GDP metrics
2. Trade Agent — Monitors trade flow data
3. Inflation Agent — Tracks inflation indicators
4. FX Agent — Monitors foreign exchange data
5. Geopolitical Risk Agent — Scores geopolitical risk factors

### 9.2 A2A Communication Patterns

```
TechnicalAnalysis → Risk: High-beta alert dispatch
Sentiment → Report: News catalyst sharing
Risk → Market Data: Feedback loop — threshold updates
Performance → Attribution: Attribution trigger
GDP → Trade: Macro correlation signals
```

---

## 10. Configuration System

### 10.1 Default Configuration

```json
{
  "model": {
    "id": "claude-sonnet",
    "name": "Claude Sonnet",
    "provider": "Anthropic",
    "tag": "4.6",
    "color": "#FF8C61"
  },
  "etl": {
    "batchSize": "100,000",
    "refreshInterval": "30s",
    "parallelAgents": "8",
    "vectorStore": "Pinecone",
    "dataWarehouse": "Snowflake",
    "streamProcessor": "Kafka"
  }
}
```

### 10.2 Configuration Persistence

- Session-scoped: configuration persists in JavaScript memory for the browser session
- v2 target: `localStorage` persistence for cross-session retention
- v2 target: server-side configuration profiles per presenter

---

## 11. Error Handling

| Error Type | Detection | UI Behaviour |
|---|---|---|
| AI API network failure | `fetch` catch block | Show inline error in AI response panel |
| AI API auth error (401/403) | Response status check | Show API key error with config link |
| AI API rate limit (429) | Response status check | Show rate limit message with model switch suggestion |
| Local model offline | Connection refused on localhost | Show Ollama offline guidance |
| Pipeline tick error | try/catch around tick function | Stop pipeline, show error in log |

---

## 12. Non-Functional Requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-01 | Page initial load time | < 3 seconds on 50 Mbps connection |
| NFR-02 | Category/sub-tab switch latency | < 100ms |
| NFR-03 | Pipeline tick render latency | < 50ms per tick |
| NFR-04 | AI API response time (cloud) | < 8 seconds (p95) |
| NFR-05 | Browser compatibility | Chrome 110+, Edge 110+, Firefox 115+, Safari 16+ |
| NFR-06 | Minimum display resolution | 1280 × 800 |
| NFR-07 | Optimum display resolution | 1920 × 1080 or higher |
| NFR-08 | Accessibility | WCAG 2.1 AA for key interactive elements |
| NFR-09 | Application bundle size | < 2MB gzipped |
| NFR-10 | Offline capability (local models) | Full functionality with Ollama running locally |

---

*Document End — FRD v1.0.0*
