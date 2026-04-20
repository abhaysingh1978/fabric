# Fabric

**Agentic ETL, AI & Reporting Platform**

> A flagship client demonstration and production-ready platform showcasing enterprise-grade multi-agent AI pipelines, high-volume ETL, modern dashboarding, and configurable AI inference across leading models.

---

## Overview

Fabric is built by our Technology Consulting Practice to showcase capabilities across three enterprise verticals with live, interactive demonstrations.

| Vertical | Use Cases |
|---|---|
| **BFSI** | Stock Analysis · Financial Advisory (Wealth Management) · Fund Performance |
| **Sales** | Smartphone Sales Research (Apple vs Samsung vs Google Pixel) |
| **Economy** | World Top 10 Economies Comparison |

---

## Core Capabilities Demonstrated

| Capability | Details |
|---|---|
| **Complex ETL Pipelines** | 6-stage pipeline: Extract → Validate → Transform → Aggregate → Load → Index |
| **Multi-Agent Framework** | 5 domain-specific agents per use case with real A2A communication |
| **Live Dashboards** | Domain-specific charts: sparklines, donut charts, bar charts, bubble plots |
| **AI Query Interface** | Natural language queries with full domain context awareness |
| **10 AI Models** | 5 local (DeepSeek, Llama, Gemma, Mistral, Phi) + 5 cloud (Claude, Gemini, GPT-4o) |
| **Configurable Infrastructure** | Kafka/Flink/Spark · Snowflake/BigQuery · Pinecone/Weaviate — all runtime-configurable |

---

## Quick Start

```bash
# Clone
git clone https://github.com/your-org/fabric.git
cd fabric

# Install
npm install

# Configure (add your AI API keys)
cp .env.example .env
# Edit .env with your keys

# Run
npm run dev
# → http://localhost:5173
```

For Docker: `docker-compose up -d` → http://localhost:3000

For local AI models: Install [Ollama](https://ollama.ai), then `ollama pull deepseek-r1:7b`

---

## Documentation

| Document | Description |
|---|---|
| [BRD.md](docs/BRD.md) | Business Requirements Document |
| [FRD.md](docs/FRD.md) | Functional Requirements Document |
| [TECH_ARCHITECTURE.md](docs/TECH_ARCHITECTURE.md) | Technical Architecture (system design, ADRs) |
| [API_SPEC.md](docs/API_SPEC.md) | AI Provider API integration specifications |
| [IMPLEMENTATION_GUIDE.md](docs/IMPLEMENTATION_GUIDE.md) | Developer runbook, setup, adding use cases |
| [DATA_DICTIONARY.md](docs/DATA_DICTIONARY.md) | All data models and schema definitions |

---

## Tech Stack

**Frontend:** React 18 · TypeScript 5 · Vite 5 · Custom SVG Charts
**ETL (Production):** Apache Kafka · Apache Flink · dbt · Apache Airflow
**Storage:** Snowflake · Pinecone · Redis
**AI Models:** Anthropic Claude · Google Gemini · OpenAI GPT-4o · Ollama (local)
**Infra:** Docker · Kubernetes · GitHub Actions · Nginx

---

## Project Structure

```
fabric/
├── src/              # Application source
├── docs/             # All documentation
├── architecture/     # Architecture diagrams
├── .env.example      # Environment variable template
└── docker-compose.yml
```

---

## License

Proprietary — Technology Consulting Practice. All rights reserved.

---

*Fabric v1.0.0 · April 2026*
