# Business Requirements Document (BRD)

**Project:** Fabric — Agentic ETL, AI & Reporting Platform
**Version:** 1.0.0
**Status:** Draft for Review
**Prepared by:** Technology Consulting Practice
**Date:** April 2026
**Classification:** Confidential

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Context & Problem Statement](#2-business-context--problem-statement)
3. [Stakeholders](#3-stakeholders)
4. [Business Objectives](#4-business-objectives)
5. [Scope](#5-scope)
6. [Use Case Domains](#6-use-case-domains)
7. [Business Requirements](#7-business-requirements)
8. [Constraints & Assumptions](#8-constraints--assumptions)
9. [Success Criteria](#9-success-criteria)
10. [Risks](#10-risks)
11. [Approval & Sign-off](#11-approval--sign-off)

---

## 1. Executive Summary

**Fabric** is a flagship client-facing demonstration and production-ready platform built by our Technology Consulting Practice to showcase enterprise-grade capabilities across:

- **High-volume, complex ETL pipelines** with multi-stage orchestration
- **Modern real-time dashboarding** and reporting
- **Multi-Agent AI frameworks** with Agent-to-Agent (A2A) communication
- **Configurable AI inference** supporting both local open-source models (DeepSeek, Llama, Gemma, Mistral, Phi) and cloud-hosted models (Anthropic Claude, Google Gemini, OpenAI GPT-4o)

The platform is designed as a **live, interactive demonstration environment** to be presented to prospective and existing clients across three verticals: **Banking, Financial Services & Insurance (BFSI)**, **Sales**, and **Economics**. It doubles as a production blueprint that can be instantiated for client engagements.

---

## 2. Business Context & Problem Statement

### 2.1 Business Context

The Technology Consulting Practice is experiencing increased demand from enterprise clients seeking:

1. Proof-of-concept environments for AI-driven data platforms before committing to full implementations
2. Real demonstrations of multi-agent orchestration, not slide-deck promises
3. Configurable AI stacks that allow them to evaluate open-source vs. proprietary models in the context of their own data
4. Integrated ETL + AI + Dashboarding solutions rather than point-solution assemblies

### 2.2 Problem Statement

Currently, sales and pre-sales cycles suffer from:

| Pain Point | Impact |
|---|---|
| No unified demo environment | Engineers rebuild demos for every prospect — high cost, inconsistent quality |
| Abstract AI capability claims | Clients demand working prototypes, not whiteboards |
| No model comparison capability | Clients cannot evaluate DeepSeek vs Claude vs Gemini side-by-side |
| Domain-agnostic demos | Generic demos fail to resonate with BFSI, Sales, or Economics buyers |
| Long time-to-demo | Current setup takes 2–3 weeks per engagement |

### 2.3 Opportunity

A single, high-quality, configurable demo platform — **Fabric** — addresses all of the above, compresses pre-sales cycles, and directly demonstrates the technical depth the Practice can deliver.

---

## 3. Stakeholders

| Role | Name/Team | Interest |
|---|---|---|
| Executive Sponsor | Managing Director, Tech Practice | Revenue, competitive positioning |
| Product Owner | VP Consulting | Demo quality, win rates |
| Pre-Sales Team | Solutions Engineers | Ease of use, client customisation |
| Delivery Team | Principal Engineers | Buildability, maintainability |
| End Clients (Prospects) | BFSI / Sales / Economy buyers | Trust, technical credibility |
| Data Engineering Team | Data Practice Lead | ETL architecture standards |
| AI/ML Team | AI Practice Lead | Model integration, agent design |

---

## 4. Business Objectives

| # | Objective | Metric | Target |
|---|---|---|---|
| BO-01 | Reduce demo preparation time | Hours per engagement | ≤ 4hrs (from ~60hrs) |
| BO-02 | Increase demo-to-proposal conversion | % conversion | +25% vs baseline |
| BO-03 | Showcase ETL throughput capability | Records/second demonstrated | ≥ 1M records/cycle |
| BO-04 | Enable AI model switching | # models configurable | ≥ 10 (5 local + 5 cloud) |
| BO-05 | Cover target verticals | # verticals with use cases | 3 (BFSI, Sales, Economy) |
| BO-06 | Reduce time-to-new-use-case | Days to add a new demo domain | ≤ 2 business days |

---

## 5. Scope

### 5.1 In Scope

- Interactive demo application (web-based, single-page application)
- Three vertical domains with live sub-use-cases (see Section 6)
- Live ETL pipeline simulation with step-by-step visualisation
- Multi-agent framework with A2A communication display
- Real-time AI query interface connected to live model APIs
- Configuration panel for model and infrastructure selection
- Analytics dashboards per use case domain
- Supporting documentation (BRD, FRD, Tech Architecture, API Spec, Runbook)
- Local deployment guide and Docker setup

### 5.2 Out of Scope (v1.0)

- Production data integration with real client systems
- User authentication and access management (v2)
- Multi-tenant client isolation (v2)
- Mobile native application
- Offline/kiosk mode

---

## 6. Use Case Domains

### 6.1 BFSI — Banking, Financial Services & Insurance

| Sub-Domain | Description | Key Audience |
|---|---|---|
| **Stock Analysis** | Real-time market data ETL, technical analysis, AI-driven pattern detection, anomaly alerts, predictive analytics | Capital Markets, Quant Teams |
| **Financial Advisory (Wealth Management)** | Portfolio construction, risk profiling, rebalancing signals, tax optimisation, ESG scoring | Private Banking, Wealth Managers |
| **Fund Performance** | Multi-fund benchmarking, attribution analysis, factor exposure, institutional reporting automation | Asset Management, CIOs |

### 6.2 Sales — Consumer & Retail Intelligence

| Sub-Domain | Description | Key Audience |
|---|---|---|
| **Smartphone Sales Research** | Apple vs Samsung vs Google Pixel global sales intelligence, market share, review sentiment analysis, trend forecasting | CMOs, Product Strategy, Sales Ops |

### 6.3 Economy — Macroeconomic Intelligence

| Sub-Domain | Description | Key Audience |
|---|---|---|
| **World Top 10 Economies** | Comparative GDP, inflation, trade flows, debt levels, growth forecasts, geopolitical risk scoring | Strategy, Policy Research, PE/VC |

---

## 7. Business Requirements

### 7.1 ETL & Data Pipeline Requirements

| ID | Requirement | Priority |
|---|---|---|
| BR-ETL-01 | The platform MUST simulate and visualise a multi-stage ETL pipeline (Extract, Validate, Transform, Aggregate, Load, Index) | Must Have |
| BR-ETL-02 | The pipeline MUST show real-time progress with per-stage status and log streaming | Must Have |
| BR-ETL-03 | The system MUST support configurable batch sizes (1K to 1M records) | Must Have |
| BR-ETL-04 | The system MUST support configurable stream processors (Kafka, Flink, Spark, Pulsar, Kinesis) | Must Have |
| BR-ETL-05 | The system MUST support configurable data warehouses (Snowflake, BigQuery, Redshift, DuckDB, Databricks) | Must Have |
| BR-ETL-06 | ETL throughput metrics (records/sec, latency, errors) MUST be displayed live | Must Have |
| BR-ETL-07 | The pipeline MUST be stoppable and re-runnable at any time | Must Have |

### 7.2 Multi-Agent & A2A Requirements

| ID | Requirement | Priority |
|---|---|---|
| BR-AGT-01 | Each use case MUST have a defined set of domain-specific AI agents (min. 5 per use case) | Must Have |
| BR-AGT-02 | Agent activation status MUST be visually displayed during pipeline runs | Must Have |
| BR-AGT-03 | A2A communication events MUST be visible in the ETL log stream | Must Have |
| BR-AGT-04 | Agent count and active ratio MUST be shown in the UI | Must Have |
| BR-AGT-05 | Agent framework MUST be extensible to support new agent types without core changes | Should Have |

### 7.3 AI Model Requirements

| ID | Requirement | Priority |
|---|---|---|
| BR-AI-01 | The system MUST support at minimum 5 local/open-source models | Must Have |
| BR-AI-02 | The system MUST support at minimum 5 cloud-hosted models | Must Have |
| BR-AI-03 | The user MUST be able to switch models without page reload | Must Have |
| BR-AI-04 | The selected model MUST be visually identified at all times | Must Have |
| BR-AI-05 | AI query responses MUST be contextually aware of the active use case domain | Must Have |
| BR-AI-06 | Pre-set domain-relevant query suggestions MUST be available per use case | Must Have |
| BR-AI-07 | The system SHOULD support streaming AI responses | Should Have |

### 7.4 Dashboard & Reporting Requirements

| ID | Requirement | Priority |
|---|---|---|
| BR-DASH-01 | Each use case MUST have a domain-specific analytics dashboard with minimum 4 chart types | Must Have |
| BR-DASH-02 | KPI cards MUST be displayed per domain with delta/trend indicators | Must Have |
| BR-DASH-03 | Architecture overview bar MUST display active infrastructure components | Must Have |
| BR-DASH-04 | Dashboards MUST update to reflect use case context on navigation | Must Have |

### 7.5 Configuration Requirements

| ID | Requirement | Priority |
|---|---|---|
| BR-CFG-01 | A configuration panel MUST allow selection of AI model (local and cloud) | Must Have |
| BR-CFG-02 | ETL infrastructure parameters MUST be configurable (batch size, interval, agents, stores) | Must Have |
| BR-CFG-03 | Configuration MUST persist within a session | Must Have |
| BR-CFG-04 | Configuration changes MUST immediately reflect in the active dashboard | Must Have |

### 7.6 UX & Presentation Requirements

| ID | Requirement | Priority |
|---|---|---|
| BR-UX-01 | The application MUST be performant with no perceptible lag during demo | Must Have |
| BR-UX-02 | The visual design MUST be distinctive, professional, and tech-forward | Must Have |
| BR-UX-03 | Navigation between verticals and sub-use-cases MUST be instant | Must Have |
| BR-UX-04 | The app MUST be runnable in a standard web browser with no plugins | Must Have |
| BR-UX-05 | The app MUST be responsive and presentable on 1080p and 4K screens | Must Have |

---

## 8. Constraints & Assumptions

### 8.1 Constraints

- Initial deployment is a demonstration/pilot environment — not connected to live financial data feeds
- AI API calls require valid API keys (Anthropic, Google, OpenAI) for cloud models
- Local model inference requires appropriate hardware (GPU recommended for 70B models)
- Browser security policies (CORS) apply to all external API calls

### 8.2 Assumptions

- Demo is primarily facilitated by a consultant/engineer for client walkthroughs
- Client browsers support modern ES2022+ JavaScript
- Internet connectivity is available during demos for cloud AI model calls
- Simulated data is sufficient for demonstrating ETL and dashboarding capabilities in v1

---

## 9. Success Criteria

| Criterion | Measurement |
|---|---|
| Demo readiness | Platform can be launched and demoed within 15 minutes of setup |
| Use case coverage | All 5 use cases fully functional with live ETL + AI + Dashboards |
| Model switching | Any of 10 models can be selected and used for AI queries |
| Pipeline simulation | ETL pipeline completes a full cycle with visible log streaming |
| Client feedback | ≥ 80% "impressive / credible" rating in post-demo surveys |
| Developer velocity | A new use case domain can be added in ≤ 2 business days |

---

## 10. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| AI API rate limits during live demo | Medium | High | Implement response caching; fallback mock responses |
| Browser compatibility issues | Low | Medium | Test on Chrome, Edge, Firefox; lock to tested versions |
| Data realism concerns from clients | Medium | Medium | Use clearly labelled simulated data; offer live integration path |
| Scope creep from pre-sales requests | High | Medium | Lock v1 scope; maintain a v2 backlog |
| Local model latency (large models) | Medium | Low | Offer cloud fallback; tune default to faster models |

---

## 11. Approval & Sign-off

| Role | Name | Signature | Date |
|---|---|---|---|
| Executive Sponsor | | | |
| Product Owner | | | |
| Technology Lead | | | |
| Pre-Sales Lead | | | |

---

*Document End — BRD v1.0.0*
