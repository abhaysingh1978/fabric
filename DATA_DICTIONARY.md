# Data Dictionary

**Project:** Fabric — Agentic ETL, AI & Reporting Platform
**Version:** 1.0.0
**Date:** April 2026

---

## 1. BFSI Domain

### 1.1 Market Data (`market_data`)

| Field | Type | Description | Example |
|---|---|---|---|
| `time` | TIMESTAMPTZ | UTC timestamp of the data point | `2025-04-20 14:30:00+00` |
| `ticker` | VARCHAR(10) | Stock ticker symbol | `AAPL` |
| `open` | DECIMAL(12,4) | Opening price | `175.2300` |
| `high` | DECIMAL(12,4) | Period high price | `177.8900` |
| `low` | DECIMAL(12,4) | Period low price | `174.5100` |
| `close` | DECIMAL(12,4) | Closing price | `176.4400` |
| `volume` | BIGINT | Number of shares traded | `42381920` |
| `vwap` | DECIMAL(12,4) | Volume-weighted average price | `176.0234` |
| `rsi_14` | DECIMAL(6,2) | 14-period Relative Strength Index | `58.42` |
| `macd` | DECIMAL(10,4) | MACD line value | `1.2341` |
| `macd_signal` | DECIMAL(10,4) | MACD signal line | `0.9821` |
| `bb_upper` | DECIMAL(12,4) | Bollinger Band upper | `182.1200` |
| `bb_lower` | DECIMAL(12,4) | Bollinger Band lower | `168.9800` |
| `sentiment` | DECIMAL(4,3) | Aggregated news sentiment (-1 to 1) | `0.342` |
| `source` | VARCHAR(20) | Data source identifier | `NYSE`, `NASDAQ` |

### 1.2 Portfolios (`portfolios`)

| Field | Type | Description | Example |
|---|---|---|---|
| `portfolio_id` | UUID | Unique portfolio identifier | `550e8400-...` |
| `client_id` | UUID | Client reference | `a1b2c3d4-...` |
| `as_of_date` | DATE | Valuation date | `2025-04-20` |
| `total_aum` | DECIMAL(18,2) | Total assets under management (USD) | `2450000.00` |
| `risk_score` | SMALLINT | Risk profile 1 (conservative) to 10 (aggressive) | `6` |
| `sharpe_ratio` | DECIMAL(6,4) | Risk-adjusted return ratio | `1.9400` |
| `benchmark` | VARCHAR(20) | Benchmark index ticker | `SPY` |
| `last_rebal` | DATE | Date of last rebalancing | `2025-03-15` |

### 1.3 Holdings (`holdings`)

| Field | Type | Description | Example |
|---|---|---|---|
| `holding_id` | UUID | Unique holding record | — |
| `portfolio_id` | UUID | Parent portfolio | — |
| `ticker` | VARCHAR(10) | Asset ticker | `MSFT` |
| `weight` | DECIMAL(6,4) | Portfolio weight (0.0–1.0) | `0.0850` |
| `cost_basis` | DECIMAL(12,4) | Average cost basis per share | `248.3300` |
| `esg_score` | DECIMAL(4,1) | ESG rating (0–100) | `82.3` |
| `tax_lot_date` | DATE | Date of acquisition | `2023-11-10` |

### 1.4 Fund Performance (`fund_performance`)

| Field | Type | Description | Example |
|---|---|---|---|
| `fund_id` | VARCHAR(20) | Fund identifier | `FUND_A_GROWTH` |
| `nav_date` | DATE | Net Asset Value date | `2025-04-20` |
| `nav` | DECIMAL(12,4) | Net Asset Value per unit | `142.3400` |
| `aum_total` | DECIMAL(18,2) | Total AUM | `480000000.00` |
| `ytd_return` | DECIMAL(8,4) | Year-to-date return | `0.0812` |
| `alpha` | DECIMAL(8,4) | Jensen's Alpha vs benchmark | `0.0320` |
| `beta` | DECIMAL(6,4) | Systematic risk | `0.9840` |
| `sharpe` | DECIMAL(6,4) | Sharpe ratio | `1.9400` |
| `max_drawdown` | DECIMAL(8,4) | Maximum drawdown (negative) | `-0.0821` |
| `benchmark` | VARCHAR(20) | Benchmark ticker | `MSCI_WORLD` |
| `flows_net` | DECIMAL(18,2) | Net inflows (+) / outflows (-) | `12400000.00` |

---

## 2. Sales Domain

### 2.1 Smartphone Sales (`smartphone_sales`)

| Field | Type | Description | Example |
|---|---|---|---|
| `period` | DATE | Sales period (monthly) | `2025-01-01` |
| `brand` | VARCHAR(20) | Brand name | `Apple`, `Samsung`, `Google` |
| `model_sku` | VARCHAR(50) | Product model identifier | `iPhone 16 Pro 256GB` |
| `region` | VARCHAR(50) | Geographic region | `North America`, `SEA` |
| `units_sold` | BIGINT | Units sold in period | `18400000` |
| `revenue_usd` | DECIMAL(18,2) | Revenue in USD | `18021600000.00` |
| `avg_asp` | DECIMAL(8,2) | Average selling price | `979.43` |
| `channel` | VARCHAR(30) | Sales channel | `Online`, `Carrier`, `Retail` |
| `market_share` | DECIMAL(5,2) | Market share percentage | `18.40` |

### 2.2 Product Reviews (`product_reviews`)

| Field | Type | Description | Example |
|---|---|---|---|
| `review_id` | UUID | Review identifier | — |
| `brand` | VARCHAR(20) | Brand name | `Samsung` |
| `model_sku` | VARCHAR(50) | Product model | `Galaxy S25 Ultra` |
| `platform` | VARCHAR(30) | Review platform | `Amazon`, `Reddit`, `Twitter` |
| `review_date` | DATE | Date of review | `2025-03-15` |
| `rating` | SMALLINT | Star rating 1–5 | `4` |
| `sentiment_score` | DECIMAL(4,3) | ML sentiment (-1 to 1) | `0.721` |
| `region` | VARCHAR(50) | Reviewer region | `Europe` |
| `topics` | TEXT[] | Extracted topics | `["camera", "battery", "price"]` |
| `embedding_id` | UUID | Vector store reference | — |

---

## 3. Economy Domain

### 3.1 Economy Indicators (`economy_indicators`)

| Field | Type | Description | Example |
|---|---|---|---|
| `country_code` | CHAR(3) | ISO 3166-1 alpha-3 code | `USA`, `CHN`, `DEU` |
| `country_name` | VARCHAR(50) | Full country name | `United States` |
| `indicator` | VARCHAR(50) | Indicator name | `gdp_usd_bn`, `inflation_pct` |
| `period` | DATE | Period start date | `2024-01-01` |
| `value` | DECIMAL(20,4) | Indicator value | `27400.0000` |
| `unit` | VARCHAR(20) | Unit of measurement | `USD_BN`, `PCT`, `INDEX` |
| `source` | VARCHAR(30) | Data source | `World Bank`, `IMF`, `OECD` |

**Indicator Catalogue:**

| Indicator Key | Description | Unit |
|---|---|---|
| `gdp_usd_bn` | GDP in USD billions | USD_BN |
| `gdp_growth_pct` | Annual GDP growth rate | PCT |
| `inflation_pct` | Consumer Price Index inflation | PCT |
| `unemployment_pct` | Unemployment rate | PCT |
| `current_account_gdp` | Current account balance as % GDP | PCT |
| `govt_debt_gdp` | Government debt as % GDP | PCT |
| `fx_usd_rate` | Exchange rate vs USD | RATE |
| `pmi_manufacturing` | Manufacturing PMI | INDEX |
| `trade_balance_usd_bn` | Trade balance | USD_BN |
| `fdi_inflow_usd_bn` | FDI inflows | USD_BN |
| `geopolitical_risk_score` | GPR Index score | INDEX |
| `gdp_forecast_1yr` | 1-year GDP growth forecast | PCT |
| `gdp_forecast_5yr` | 5-year GDP growth forecast | PCT |

---

## 4. Agent Framework Data

### 4.1 Agent Messages (`agent_messages` — A2A Bus)

| Field | Type | Description | Example |
|---|---|---|---|
| `message_id` | UUID | Unique message identifier | — |
| `from_agent` | VARCHAR(50) | Sending agent name | `technical_analysis_agent` |
| `to_agent` | VARCHAR(50) | Receiving agent name | `risk_agent` |
| `message_type` | VARCHAR(50) | Message type enum | `signals.generated` |
| `payload` | JSONB | Message payload | `{"count": 142, "severity": "HIGH"}` |
| `created_at` | TIMESTAMPTZ | Message timestamp | — |
| `pipeline_run_id` | UUID | Associated pipeline run | — |

### 4.2 Pipeline Runs (`pipeline_runs`)

| Field | Type | Description | Example |
|---|---|---|---|
| `run_id` | UUID | Unique run identifier | — |
| `domain` | VARCHAR(30) | Domain key | `stock`, `advisory` |
| `started_at` | TIMESTAMPTZ | Pipeline start time | — |
| `completed_at` | TIMESTAMPTZ | Pipeline end time | — |
| `status` | VARCHAR(20) | `RUNNING`, `COMPLETED`, `FAILED` | `COMPLETED` |
| `records_processed` | BIGINT | Total records in this run | `201600` |
| `throughput_rps` | INT | Records per second | `1240` |
| `errors` | INT | Error count | `0` |
| `config_snapshot` | JSONB | ETL config at time of run | — |

---

## 5. Configuration Data

### 5.1 AI Model Registry

| Field | Type | Description |
|---|---|---|
| `model_id` | VARCHAR(50) | Unique model identifier |
| `model_name` | VARCHAR(100) | Display name |
| `provider` | VARCHAR(30) | Provider enum |
| `model_type` | VARCHAR(10) | `local` or `cloud` |
| `parameter_tag` | VARCHAR(20) | Size/version tag |
| `api_endpoint` | VARCHAR(200) | API endpoint URL |
| `active` | BOOLEAN | Whether model is enabled |

---

*Document End — Data Dictionary v1.0.0*
