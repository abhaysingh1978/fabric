# Technical Architecture Document

**Project:** Aethon — Agentic ETL, AI & Reporting Platform
**Version:** 1.0.0
**Status:** Approved for Development
**Architect:** Technology Consulting Practice — Architecture Guild
**Date:** April 2026

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Technology Stack](#2-technology-stack)
3. [Frontend Architecture](#3-frontend-architecture)
4. [ETL Engine Architecture](#4-etl-engine-architecture)
5. [Multi-Agent Framework Architecture](#5-multi-agent-framework-architecture)
6. [AI Integration Architecture](#6-ai-integration-architecture)
7. [Data Architecture](#7-data-architecture)
8. [Infrastructure Architecture](#8-infrastructure-architecture)
9. [Security Architecture](#9-security-architecture)
10. [Deployment Architecture](#10-deployment-architecture)
11. [Scalability & Performance](#11-scalability--performance)
12. [Observability & Monitoring](#12-observability--monitoring)
13. [ADRs — Architecture Decision Records](#13-adrs--architecture-decision-records)

---

## 1. Architecture Overview

### 1.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                                  │
│                                                                      │
│   Browser (Chrome / Edge / Firefox / Safari)                        │
│   ┌────────────────────────────────────────────────────────────┐    │
│   │                   Aethon SPA (React)                       │    │
│   │  ┌──────────┐ ┌─────────────┐ ┌───────────┐ ┌──────────┐ │    │
│   │  │ Nav &    │ │ Config      │ │ Demo      │ │ AI Query │ │    │
│   │  │ Routing  │ │ Module      │ │ Panels    │ │ Panel    │ │    │
│   │  └──────────┘ └─────────────┘ └───────────┘ └──────────┘ │    │
│   └────────────────────────────────────────────────────────────┘    │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ HTTPS / REST
           ┌───────────────────┼────────────────────┐
           │                   │                    │
           ▼                   ▼                    ▼
┌──────────────────┐ ┌──────────────────┐ ┌─────────────────┐
│  ANTHROPIC API   │ │   GOOGLE AI API  │ │  OPENAI API     │
│  claude-sonnet   │ │  gemini-2.0-pro  │ │  gpt-4o         │
│  claude-opus     │ │  gemini-flash    │ │                 │
└──────────────────┘ └──────────────────┘ └─────────────────┘
           │
           ▼
┌──────────────────┐
│   LOCAL MODELS   │
│  Ollama Server   │
│  localhost:11434 │
│  DeepSeek R1     │
│  Llama 3.3 70B   │
│  Gemma 3 27B     │
│  Mistral NeMo    │
│  Phi-4 14B       │
└──────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     DATA LAYER (Production Target)                  │
│                                                                      │
│  ┌──────────────┐  ┌────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ Stream Layer │  │ Warehouse  │  │ Vector Store │  │ Cache    │  │
│  │ Kafka/Flink  │  │ Snowflake/ │  │ Pinecone/    │  │ Redis    │  │
│  │ Spark/Pulsar │  │ BigQuery   │  │ Weaviate     │  │          │  │
│  └──────────────┘  └────────────┘  └──────────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Architectural Principles

| Principle | Implementation |
|---|---|
| **Demo-first, production-ready** | Simulated data in v1; identical interfaces to production connectors |
| **Config over code** | All infrastructure choices are runtime config, not hardcoded |
| **Agent-first design** | Every domain operation is modelled as an agent with defined inputs/outputs |
| **AI-model agnostic** | Abstraction layer over all AI providers; swap without code changes |
| **Zero-infrastructure demo** | Full demo runs in a browser with no server required |
| **Progressive enhancement** | Works without live APIs; degrades gracefully to mock responses |

---

## 2. Technology Stack

### 2.1 Frontend

| Layer | Technology | Version | Rationale |
|---|---|---|---|
| UI Framework | React | 18.x | Component model fits modular panel architecture |
| Build Tool | Vite | 5.x | Sub-second HMR, excellent tree-shaking |
| Language | TypeScript | 5.x | Type safety for complex state and models |
| Styling | CSS-in-JS (inline) + CSS vars | — | No build-step dependency, theme-aware |
| Charts | Custom SVG + Canvas | — | Full control, no heavy chart library |
| State Management | React useState / useReducer | — | Sufficient for v1 single-page state |
| Routing | State-based (no router) | — | No URL routing needed for demo |

### 2.2 AI Model Providers

| Provider | Models | Integration Method |
|---|---|---|
| Anthropic | Claude Opus 4.6, Claude Sonnet 4.6 | REST API, `x-api-key` header |
| Google | Gemini 2.0 Pro, Gemini 2.0 Flash | REST API, `key` query parameter |
| OpenAI | GPT-4o | REST API, `Authorization: Bearer` header |
| Local (Ollama) | DeepSeek R1, Llama 3.3, Gemma 3, Mistral NeMo, Phi-4 | Ollama REST API, localhost:11434 |

### 2.3 ETL & Data Infrastructure (Production)

| Category | Primary Option | Alternatives |
|---|---|---|
| Stream Processor | Apache Kafka | Apache Flink, Spark Streaming, Apache Pulsar, AWS Kinesis |
| Data Warehouse | Snowflake | Google BigQuery, Amazon Redshift, DuckDB, Databricks |
| Vector Store | Pinecone | Weaviate, Qdrant, pgvector (PostgreSQL), Chroma |
| Cache Layer | Redis | Memcached, DragonflyDB |
| Orchestration | Apache Airflow | Prefect, Dagster, Temporal |
| Transformation | dbt | SQLMesh |

### 2.4 Infrastructure & DevOps

| Component | Technology |
|---|---|
| Containerisation | Docker + Docker Compose |
| Container Orchestration (prod) | Kubernetes (GKE / EKS / AKS) |
| CI/CD | GitHub Actions |
| Reverse Proxy | Nginx |
| Secret Management | HashiCorp Vault / AWS Secrets Manager |

---

## 3. Frontend Architecture

### 3.1 Component Hierarchy

```
App
├── ConfigModal
│   ├── ModelSelector (Local / Cloud groups)
│   └── ETLConfigPanel (6 dropdowns)
├── TopNavBar
│   ├── AethonLogo
│   ├── CategoryTabs [BFSI | Sales | Economy]
│   ├── ActiveModelBadge
│   └── ConfigButton
├── SubNavBar (conditional)
│   └── SubCaseTabs
├── ArchitectureBar
│   └── ArchCell × 6
└── DemoPanel (dynamic per use case)
    ├── PanelHeader (title, description, datasets, run button)
    ├── KPIGrid
    │   └── KPICard × n
    ├── ETLPipelineVisualiser
    │   └── StageNode × 6
    ├── AgentLogRow
    │   ├── AgentFrameworkPanel
    │   │   └── AgentBubble × n
    │   └── LogTerminal
    ├── DashboardCharts (domain-specific)
    │   └── [Sparkline | DonutChart | BarChart | BubblePlot]
    └── AIQueryPanel
        ├── PresetButtons
        ├── QueryInput
        └── ResponsePanel
```

### 3.2 State Flow

```
User Action
     │
     ▼
Event Handler (selectCat / selectSub / togglePipeline / askAI / etc.)
     │
     ▼
State Mutation (state object update)
     │
     ▼
render() → innerHTML reconstruction (v1 vanilla JS)
     │
     ▼ (React version)
setState() → React reconciliation → DOM update
```

### 3.3 Pipeline Tick Loop

```javascript
function startPipeline() {
  state.running = true;
  state.logIdx = 0;
  
  function tick() {
    if (!state.running || state.logIdx >= ETL_LOGS.length) {
      state.running = false;
      render();
      return;
    }
    
    // Update state
    state.logs.push(ETL_LOGS[state.logIdx]);
    state.activeStage = Math.min(5, Math.floor((state.logIdx / ETL_LOGS.length) * 6));
    updateActiveAgents(state.logIdx);
    updateLiveKPIs(state.logIdx);
    state.logIdx++;
    
    // Partial DOM update (performance optimisation)
    appendLogLine();
    
    // Schedule next tick
    const delay = 160 + Math.random() * 100; // 160–260ms natural variance
    pipelineTimer = setTimeout(tick, delay);
  }
  
  pipelineTimer = setTimeout(tick, 200);
}
```

---

## 4. ETL Engine Architecture

### 4.1 Pipeline Stage Design

Each ETL stage in Aethon corresponds to a real production pattern:

```
┌─────────────────────────────────────────────────────────────┐
│                   ETL PIPELINE STAGES                        │
│                                                             │
│  EXTRACT          VALIDATE         TRANSFORM               │
│  ──────────       ──────────       ──────────              │
│  WebSocket feeds  Schema checks    UTC normalisation        │
│  REST API pulls   Null detection   Feature engineering      │
│  File ingestion   Outlier flags    Type casting             │
│  CDC streams      PK uniqueness    Derived fields           │
│                                                             │
│  AGGREGATE        LOAD             INDEX                    │
│  ──────────       ──────────       ──────────              │
│  Rolling windows  Warehouse upsert Vector embeddings        │
│  Cross-dim agg.   Cache refresh    Semantic index           │
│  Sector rollups   Event publish    Full-text index          │
│  Factor calcs     Audit log        Search optimisation      │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Production ETL Architecture (Target)

```
Data Sources                 Stream Layer              Processing
──────────                   ────────────              ──────────
NYSE WebSocket  ──►          Kafka Topic               Flink Job
SEC EDGAR API   ──►          (raw.events)  ──────────► (validate,
Bloomberg Feed  ──►                                     transform,
Alt Data APIs   ──►          Kafka Topic               aggregate)
                             (processed)   ──────────►
                                                        dbt Models
                                            ──────────► (Snowflake)

Storage                      Vector Layer              Serving
───────                      ────────────              ───────
Snowflake DWH  ◄──           Pinecone      ◄──         REST APIs
Redis Cache    ◄──           (embeddings)              GraphQL
S3 Raw Lake    ◄──                                     gRPC
```

### 4.3 ETL Configuration Matrix

| Config | Demo Impact | Production Impact |
|---|---|---|
| Batch Size | Log message text | Kafka consumer batch config |
| Stream Processor | Architecture bar label | Deployment target |
| Warehouse | Architecture bar label + log messages | Connection string |
| Vector Store | Architecture bar label | Embedding endpoint |
| Refresh Interval | Display only (demo simulates) | Airflow DAG schedule |
| Parallel Agents | Architecture bar label | Agent pool size |

---

## 5. Multi-Agent Framework Architecture

### 5.1 Agent Design Pattern

Each Aethon agent follows the **Observe-Reason-Act** pattern:

```
┌─────────────────────────────────────────────────────┐
│                   AETHON AGENT                       │
│                                                     │
│  ┌─────────┐   ┌──────────┐   ┌──────────────────┐ │
│  │ Observe │──►│  Reason  │──►│      Act         │ │
│  │         │   │          │   │                  │ │
│  │ Consume │   │ LLM Call │   │ Emit to A2A bus  │ │
│  │ from    │   │ (domain  │   │ Write to store   │ │
│  │ pipeline│   │ context) │   │ Trigger report   │ │
│  └─────────┘   └──────────┘   └──────────────────┘ │
│                                                     │
│  State: IDLE → ACTIVE → EMITTING → DONE             │
└─────────────────────────────────────────────────────┘
```

### 5.2 Agent-to-Agent (A2A) Communication

```
A2A Message Bus (in-memory for demo, Kafka for production)

  Market Data Agent
        │
        │ Publishes: { type: "market.update", ticker: [], timestamp }
        ▼
  Technical Analysis Agent ──── Publishes: { type: "signals.generated", count: 12600 }
        │                                           │
        │                                           ▼
        │                                     Risk Agent ──── Publishes: { type: "risk.alert", severity: "HIGH" }
        │                                                              │
        ▼                                                              ▼
  Sentiment Agent                                              Report Agent
        │                                                       (Aggregates all)
        │ Publishes: { type: "sentiment.update", catalysts: [] }
        └─────────────────────────────────────────────────────────────►
```

### 5.3 Agent Orchestration (Production)

```yaml
# agents/orchestration.yaml
orchestrator: temporal  # or Airflow, Prefect

pipelines:
  market_analysis:
    trigger: schedule/30s
    agents:
      - market_data_agent:
          model: deepseek-r1       # or claude-sonnet, configurable
          tools: [fetch_market_data, write_timescale]
      - technical_analysis_agent:
          model: llama3-70b
          tools: [compute_indicators, read_timescale, write_signals]
          depends_on: [market_data_agent]
      - sentiment_agent:
          model: gemma3-27b
          tools: [fetch_news, analyse_sentiment, write_sentiment_db]
      - risk_agent:
          model: claude-sonnet
          tools: [read_portfolios, compute_risk, write_alerts]
          depends_on: [technical_analysis_agent, sentiment_agent]
      - report_agent:
          model: claude-opus
          tools: [read_all, generate_narrative, publish_report]
          depends_on: [risk_agent]
```

---

## 6. AI Integration Architecture

### 6.1 AI Provider Abstraction Layer

```typescript
interface AIProvider {
  name: string;
  complete(params: CompletionParams): Promise<CompletionResult>;
}

interface CompletionParams {
  systemPrompt: string;
  userMessage: string;
  maxTokens: number;
  temperature?: number;
}

interface CompletionResult {
  text: string;
  model: string;
  tokensUsed: number;
}

// Provider implementations
class AnthropicProvider implements AIProvider { ... }
class GoogleProvider implements AIProvider { ... }
class OpenAIProvider implements AIProvider { ... }
class OllamaProvider implements AIProvider { ... }  // local models
```

### 6.2 Model Routing Logic

```typescript
function getProvider(model: AIModel): AIProvider {
  switch (model.provider) {
    case "Anthropic": return new AnthropicProvider(ANTHROPIC_API_KEY);
    case "Google":    return new GoogleProvider(GOOGLE_API_KEY);
    case "OpenAI":    return new OpenAIProvider(OPENAI_API_KEY);
    case "Local":     return new OllamaProvider("http://localhost:11434", model.id);
    default: throw new Error(`Unknown provider: ${model.provider}`);
  }
}
```

### 6.3 Local Model Architecture (Ollama)

```
User's Machine
┌────────────────────────────────────────┐
│                                        │
│  Browser (Aethon SPA)                  │
│  └── fetch("http://localhost:11434")   │
│                │                       │
│                ▼                       │
│  Ollama Server (localhost:11434)       │
│  ├── /api/generate endpoint            │
│  ├── Model: deepseek-r1:7b             │
│  ├── Model: llama3.3:70b               │
│  ├── Model: gemma3:27b                 │
│  ├── Model: mistral-nemo:12b           │
│  └── Model: phi4:14b                   │
│                │                       │
│                ▼                       │
│  GPU / CPU (inference)                 │
└────────────────────────────────────────┘
```

---

## 7. Data Architecture

### 7.1 Domain Data Models

#### BFSI — Stock Analysis
```sql
-- TimescaleDB hypertable
CREATE TABLE market_data (
  time         TIMESTAMPTZ NOT NULL,
  ticker       VARCHAR(10) NOT NULL,
  open         DECIMAL(12,4),
  high         DECIMAL(12,4),
  low          DECIMAL(12,4),
  close        DECIMAL(12,4),
  volume       BIGINT,
  vwap         DECIMAL(12,4),
  rsi_14       DECIMAL(6,2),
  macd         DECIMAL(10,4),
  bb_upper     DECIMAL(12,4),
  bb_lower     DECIMAL(12,4),
  sentiment    DECIMAL(4,3),     -- -1 to 1
  source       VARCHAR(20)
);
SELECT create_hypertable('market_data', 'time');
CREATE INDEX idx_market_ticker_time ON market_data (ticker, time DESC);
```

#### BFSI — Wealth Management
```sql
CREATE TABLE portfolios (
  portfolio_id   UUID PRIMARY KEY,
  client_id      UUID NOT NULL,
  as_of_date     DATE NOT NULL,
  total_aum      DECIMAL(18,2),
  risk_score     SMALLINT,        -- 1-10
  sharpe_ratio   DECIMAL(6,4),
  benchmark      VARCHAR(20),
  last_rebal     DATE
);

CREATE TABLE holdings (
  holding_id     UUID PRIMARY KEY,
  portfolio_id   UUID REFERENCES portfolios,
  ticker         VARCHAR(10),
  weight         DECIMAL(6,4),
  cost_basis     DECIMAL(12,4),
  esg_score      DECIMAL(4,1),
  tax_lot_date   DATE
);
```

#### Sales — Smartphone
```sql
CREATE TABLE smartphone_sales (
  period         DATE NOT NULL,
  brand          VARCHAR(20),
  model_sku      VARCHAR(50),
  region         VARCHAR(50),
  units_sold     BIGINT,
  revenue_usd    DECIMAL(18,2),
  avg_asp        DECIMAL(8,2),
  channel        VARCHAR(30),    -- Online, Carrier, Retail
  market_share   DECIMAL(5,2)
);
```

#### Economy
```sql
CREATE TABLE economy_indicators (
  country_code   CHAR(3) NOT NULL,   -- ISO 3166-1 alpha-3
  indicator      VARCHAR(50) NOT NULL,
  period         DATE NOT NULL,
  value          DECIMAL(20,4),
  unit           VARCHAR(20),
  source         VARCHAR(30),
  PRIMARY KEY (country_code, indicator, period)
);
```

### 7.2 Vector Data Schema

```python
# Pinecone / Weaviate schema
Document = {
  "id": str,                  # Unique document ID
  "vector": List[float],      # 1536-dim embedding (text-embedding-3-small)
  "metadata": {
    "domain": str,            # "stock" | "advisory" | "fund" | ...
    "entity": str,            # Ticker, fund ID, country code
    "doc_type": str,          # "analysis" | "report" | "signal"
    "created_at": datetime,
    "summary": str,           # First 500 chars for display
  }
}
```

---

## 8. Infrastructure Architecture

### 8.1 Demo Environment (Minimal)

```yaml
# docker-compose.yml
services:
  aethon-app:
    build: .
    ports: ["3000:80"]
    environment:
      - VITE_ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - VITE_GOOGLE_API_KEY=${GOOGLE_API_KEY}
      - VITE_OPENAI_API_KEY=${OPENAI_API_KEY}

  # Optional: local model server
  ollama:
    image: ollama/ollama
    ports: ["11434:11434"]
    volumes: ["ollama_data:/root/.ollama"]
    deploy:
      resources:
        reservations:
          devices:
            - capabilities: [gpu]
```

### 8.2 Production Environment (Full Stack)

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION KUBERNETES                      │
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │  Nginx      │  │  Aethon App  │  │  Agent Pods       │  │
│  │  Ingress    │→ │  (3 replicas)│  │  (per-agent       │  │
│  │  + TLS      │  │              │  │   deployments)    │  │
│  └─────────────┘  └──────────────┘  └───────────────────┘  │
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │  Kafka      │  │  Flink       │  │  Airflow          │  │
│  │  Cluster    │  │  (ETL jobs)  │  │  (Orchestration)  │  │
│  │  (3 brokers)│  │              │  │                   │  │
│  └─────────────┘  └──────────────┘  └───────────────────┘  │
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │  Snowflake  │  │  Pinecone    │  │  Redis            │  │
│  │  (managed)  │  │  (managed)   │  │  Sentinel         │  │
│  └─────────────┘  └──────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Security Architecture

### 9.1 API Key Management

| Environment | Storage Method |
|---|---|
| Demo (local) | `.env` file (gitignored), loaded via Vite |
| Demo (hosted) | Environment variables injected at build time |
| Production | HashiCorp Vault or cloud-native secrets manager |

**Critical:** API keys are NEVER committed to source control. `.env` is always in `.gitignore`.

### 9.2 CORS & Browser Security

- All AI API calls are direct from browser to provider APIs
- Providers (Anthropic, Google, OpenAI) support browser-origin CORS
- Local Ollama server requires no CORS configuration for localhost
- Content-Security-Policy headers configured for allowed API origins

### 9.3 Data Security (Production)

```
Encryption at rest:    AES-256 (Snowflake, Pinecone managed)
Encryption in transit: TLS 1.3 mandatory
PII handling:          Column-level masking in Snowflake
API auth:              mTLS for service-to-service, OIDC for user sessions
Secrets rotation:      30-day rotation via Vault
```

---

## 10. Deployment Architecture

### 10.1 Local Development

```bash
git clone https://github.com/your-org/fabric
cd fabric
cp .env.example .env          # Add your API keys
npm install
npm run dev                    # Vite dev server → http://localhost:5173
```

### 10.2 Production Build

```bash
npm run build                  # Outputs to /dist
npm run preview                # Preview production build locally
docker build -t aethon:latest .
docker run -p 3000:80 aethon:latest
```

### 10.3 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
on: [push to main]
jobs:
  build-and-deploy:
    steps:
      - checkout
      - setup-node (v20)
      - npm ci
      - npm run type-check
      - npm run lint
      - npm run test
      - npm run build
      - docker build & push to registry
      - kubectl rollout (GKE / EKS)
```

### 10.4 Environment Matrix

| Environment | URL | AI Models | Data |
|---|---|---|---|
| local-dev | localhost:5173 | All (requires keys) | Simulated |
| demo-hosted | demo.aethon.yourco.com | All (keys in env) | Simulated |
| client-poc | client.aethon.yourco.com | Configured per client | Simulated + optional live |
| production | app.aethon.yourco.com | All | Live |

---

## 11. Scalability & Performance

### 11.1 Frontend Performance Budget

| Metric | Target | Measurement |
|---|---|---|
| First Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 3.0s | Lighthouse |
| Bundle size (gzipped) | < 2MB | webpack-bundle-analyzer / rollup-visualizer |
| Pipeline tick FPS | > 30fps (no jank) | Chrome DevTools |

### 11.2 ETL Scalability (Production)

| Metric | Target |
|---|---|
| Kafka throughput | 10M messages/second (3-broker cluster) |
| Flink parallelism | Auto-scaled 2–32 task managers |
| Snowflake query latency | < 5s for dashboard aggregations |
| Pinecone query latency | < 100ms (p99) |
| End-to-end pipeline latency | < 30s (extract to dashboard update) |

### 11.3 Agent Scalability

- Each agent runs as an independent Kubernetes Deployment
- Agent pods auto-scale (HPA) based on message queue depth
- Agent state stored in Redis (not in-process) for stateless restarts
- Max 32 concurrent agents per pipeline (configurable)

---

## 12. Observability & Monitoring

### 12.1 Frontend Observability

```typescript
// Error boundary + telemetry
window.onerror = (msg, src, line, col, err) => {
  telemetry.captureException(err, { context: "aethon-spa" });
};

// Performance marks
performance.mark("pipeline-start");
// ... pipeline runs ...
performance.measure("pipeline-duration", "pipeline-start");
```

### 12.2 Production Stack

| Tool | Purpose |
|---|---|
| Prometheus | Metrics collection (ETL throughput, agent latency) |
| Grafana | Dashboarding for ops team |
| Jaeger / Tempo | Distributed tracing (agent A2A calls) |
| Loki | Log aggregation |
| PagerDuty | Alert routing |
| Sentry | Frontend error tracking |

### 12.3 Key Metrics to Monitor

```
aethon.pipeline.records_processed    (counter)
aethon.pipeline.stage_latency_ms     (histogram, by stage)
aethon.agent.messages_sent           (counter, by agent)
aethon.agent.a2a_latency_ms          (histogram)
aethon.ai.query_latency_ms           (histogram, by model)
aethon.ai.error_rate                 (gauge)
aethon.ui.page_load_ms               (histogram)
```

---

## 13. ADRs — Architecture Decision Records

### ADR-001: Single-Page Application without URL Routing

**Decision:** Use state-based navigation, not URL/hash routing.
**Context:** Demo environment; back-button navigation is not a user requirement.
**Rationale:** Eliminates router dependency, simplifies deployment (no server-side routing config).
**Consequence:** Deep-linking to specific use cases not possible without URL params (v2 enhancement).

---

### ADR-002: Vanilla JS Render for Demo, React for Production

**Decision:** Demo build uses vanilla JS DOM manipulation; production build uses React.
**Context:** Demo must run as a self-contained HTML artifact without a build step.
**Rationale:** Zero-dependency delivery for demo; React for maintainability at scale.
**Consequence:** Two rendering implementations must be kept in sync. Mitigated by shared data models.

---

### ADR-003: Direct Browser-to-AI-Provider API Calls

**Decision:** AI API calls originate from the browser, not a backend proxy.
**Context:** Demo environment; no server infrastructure available.
**Rationale:** Eliminates need for a backend service in demo mode; all major AI providers support browser CORS.
**Consequence:** API keys visible in network inspector. Acceptable for demo; production must proxy through backend.
**Production mitigation:** All AI calls route through a lightweight FastAPI proxy that holds keys server-side.

---

### ADR-004: Simulated ETL Data for v1

**Decision:** ETL pipeline simulation uses curated log messages and computed chart data, not live API calls.
**Context:** Demo must be reliable and offline-capable.
**Rationale:** Live financial data APIs require licences, latency, and availability guarantees incompatible with a demo.
**Consequence:** Data is illustrative, not real-time. Clearly labelled in UI.

---

### ADR-005: Ollama for Local Model Inference

**Decision:** Use Ollama as the local model server for all open-source models.
**Context:** Clients want to see DeepSeek, Llama, Gemma, Mistral running locally.
**Rationale:** Ollama provides a unified API, easy model management (`ollama pull`), GPU auto-detection.
**Alternatives considered:** LM Studio (no REST API), llama.cpp (too low-level), vLLM (production-only).

---

### ADR-006: No External Charting Library

**Decision:** All charts built with custom SVG and Canvas, no Chart.js or D3.
**Context:** Charts are domain-specific; standard chart libraries add 200–500KB bundle weight.
**Rationale:** Custom charts give precise visual control; bundle stays under 2MB target.
**Consequence:** More implementation code, but zero third-party chart version risk.

---

*Document End — Technical Architecture v1.0.0*
