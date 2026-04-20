import { useState, useEffect, useRef, useCallback } from "react";

// ─── PALETTE ───────────────────────────────────────────────────────────────
const C = {
  bg: "#0A0E1A", bgCard: "#0F1520", bgPanel: "#141924",
  border: "#1E2A3A", borderBright: "#2A3A50",
  accent: "#00D4FF", accent2: "#7C3AED", accent3: "#10B981",
  accentWarn: "#F59E0B", accentDanger: "#EF4444",
  text: "#E2E8F0", textMuted: "#64748B", textDim: "#94A3B8",
  gridLine: "rgba(255,255,255,0.03)",
};

// ─── AI MODELS CONFIG ──────────────────────────────────────────────────────
const AI_MODELS = {
  local: [
    { id: "deepseek-r1", name: "DeepSeek R1", provider: "Local", tag: "7B", color: "#06B6D4" },
    { id: "llama3-70b", name: "Llama 3.3", provider: "Local", tag: "70B", color: "#8B5CF6" },
    { id: "gemma3-27b", name: "Gemma 3", provider: "Local", tag: "27B", color: "#10B981" },
    { id: "mistral-7b", name: "Mistral NeMo", provider: "Local", tag: "12B", color: "#F59E0B" },
    { id: "phi4", name: "Phi-4", provider: "Local", tag: "14B", color: "#EC4899" },
  ],
  cloud: [
    { id: "claude-opus-4-6", name: "Claude Opus", provider: "Anthropic", tag: "4.6", color: "#FF6B35" },
    { id: "claude-sonnet-4-6", name: "Claude Sonnet", provider: "Anthropic", tag: "4.6", color: "#FF8C61" },
    { id: "gemini-2.0-pro", name: "Gemini 2.0 Pro", provider: "Google", tag: "Pro", color: "#4285F4" },
    { id: "gemini-2.0-flash", name: "Gemini Flash", provider: "Google", tag: "2.0", color: "#34A853" },
    { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", tag: "Latest", color: "#74AA9C" },
  ],
};

const ETL_PIPELINE_STAGES = ["Extract", "Validate", "Transform", "Aggregate", "Load", "Index"];

// ─── DEMO USE CASES ────────────────────────────────────────────────────────
const DEMO_CASES = {
  BFSI: {
    label: "BFSI", icon: "◈", color: "#00D4FF",
    sub: {
      stock: {
        label: "Stock Analysis", icon: "▲",
        desc: "Real-time multi-source stock ETL with AI-driven pattern detection, anomaly alerts & predictive analytics",
        datasets: ["NYSE/NASDAQ Feeds", "Options Chain", "SEC Filings", "Sentiment Data", "Macro Indicators"],
        agents: ["Market Data Agent", "Technical Analysis Agent", "Sentiment Agent", "Risk Agent", "Report Agent"],
        kpis: [
          { label: "Tickers Tracked", value: "4,200+", delta: "+12%" },
          { label: "Data Points/sec", value: "2.8M", delta: "+8%" },
          { label: "Model Accuracy", value: "87.3%", delta: "+1.2%" },
          { label: "Latency (p99)", value: "42ms", delta: "-18%" },
        ],
        charts: ["price_history", "volume_heatmap", "sector_rotation", "correlation_matrix"],
      },
      advisory: {
        label: "Financial Advisory", icon: "⬡",
        desc: "AI wealth management platform: portfolio construction, risk profiling, rebalancing signals & tax optimization",
        datasets: ["Portfolio Holdings", "Risk Profiles", "Market Benchmarks", "Tax Lots", "ESG Scores"],
        agents: ["Portfolio Agent", "Risk Profiler Agent", "Rebalance Agent", "Tax Agent", "Client Report Agent"],
        kpis: [
          { label: "AUM Managed", value: "$2.4B", delta: "+23%" },
          { label: "Portfolios", value: "14,800", delta: "+340" },
          { label: "Sharpe Ratio", value: "1.94", delta: "+0.12" },
          { label: "Rebal. Signals/Day", value: "890", delta: "+110" },
        ],
        charts: ["allocation_pie", "risk_return", "performance_attribution", "drawdown_analysis"],
      },
      fund: {
        label: "Fund Performance", icon: "◉",
        desc: "Multi-fund benchmarking, attribution analysis, factor exposure & institutional reporting automation",
        datasets: ["Fund NAVs", "Benchmark Indices", "Factor Models", "Holdings", "Flows"],
        agents: ["Performance Agent", "Attribution Agent", "Factor Agent", "Compliance Agent", "Board Report Agent"],
        kpis: [
          { label: "Funds Analyzed", value: "382", delta: "+28" },
          { label: "Alpha Generated", value: "3.2%", delta: "+0.4%" },
          { label: "Reports/Month", value: "1,240", delta: "Auto" },
          { label: "Data Sources", value: "47", delta: "+6" },
        ],
        charts: ["fund_comparison", "rolling_returns", "factor_exposure", "flow_analysis"],
      },
    },
  },
  Sales: {
    label: "Sales", icon: "◆", color: "#10B981",
    sub: {
      smartphone: {
        label: "Smartphone Sales Research", icon: "▣",
        desc: "Apple vs Samsung vs Google Pixel — global sales intelligence, market share, review sentiment & trend forecasting",
        datasets: ["IDC/Gartner Reports", "Retailer POS Data", "App Store Analytics", "Review Platforms", "Supply Chain"],
        agents: ["Market Share Agent", "Sentiment Agent", "Pricing Agent", "Channel Agent", "Forecast Agent"],
        kpis: [
          { label: "Markets Covered", value: "68", delta: "+5" },
          { label: "Reviews Analyzed", value: "12.4M", delta: "Q1 2025" },
          { label: "Data Freshness", value: "< 4hrs", delta: "Live" },
          { label: "SKUs Tracked", value: "3,840", delta: "+220" },
        ],
        charts: ["market_share", "brand_sentiment", "price_positioning", "regional_sales"],
      },
    },
  },
  Economy: {
    label: "Economy", icon: "◎", color: "#7C3AED",
    sub: {
      economies: {
        label: "World Top 10 Economies", icon: "⬢",
        desc: "Comparative macro intelligence: GDP, inflation, trade flows, debt levels, growth forecasts & geopolitical risk",
        datasets: ["World Bank API", "IMF DataMapper", "OECD Stats", "BIS Data", "Central Bank Feeds"],
        agents: ["GDP Agent", "Trade Agent", "Inflation Agent", "FX Agent", "Geopolitical Risk Agent"],
        kpis: [
          { label: "Economies", value: "10", delta: "G20 Focus" },
          { label: "Indicators", value: "240+", delta: "Real-time" },
          { label: "Time Series", value: "50yr", delta: "Historical" },
          { label: "Forecast Horizon", value: "5yr", delta: "AI Model" },
        ],
        charts: ["gdp_comparison", "inflation_tracker", "trade_flows", "debt_matrix"],
      },
    },
  },
};

// ─── SIMULATED STREAMING ETL LOG ──────────────────────────────────────────
const ETL_LOGS = [
  "[EXTRACT] Connecting to NYSE WebSocket feed... OK",
  "[EXTRACT] Batch pull: 4,200 tickers × 48 fields → 201,600 records",
  "[VALIDATE] Schema check PASSED (0 nulls in critical columns)",
  "[VALIDATE] Outlier detection: 3 anomalies flagged for review",
  "[TRANSFORM] Normalising OHLCV to UTC... done",
  "[TRANSFORM] Computing 200+ technical indicators (RSI, MACD, BB)...",
  "[AGGREGATE] Rolling 5/20/50/200 MA windows... 840K computations",
  "[AGGREGATE] Sector aggregation complete (11 GICS sectors)",
  "[LOAD] Upsert → TimescaleDB: 201,597 rows in 38ms",
  "[LOAD] Cache invalidation → Redis: 4,200 keys refreshed",
  "[INDEX] Vector embeddings for semantic search... 4,200 vectors",
  "[AGENTS] Market Data Agent → consumed 201,600 records",
  "[AGENTS] Technical Analysis Agent → generated 12,600 signals",
  "[AGENTS] Sentiment Agent → processed 48,000 news items",
  "[AGENTS] Risk Agent → updated 14,800 portfolio exposures",
  "[A2A] TechAgent → RiskAgent: 142 high-beta alerts dispatched",
  "[A2A] SentimentAgent → ReportAgent: 18 news catalysts shared",
  "[REPORT] AI narrative generated: 2,840 words, 12 charts",
  "[PIPELINE] Cycle complete in 2.31s | Next run: 30s",
];

const CHART_COLORS = ["#00D4FF", "#7C3AED", "#10B981", "#F59E0B", "#EF4444", "#EC4899", "#06B6D4", "#84CC16"];

// ─── MICRO COMPONENTS ─────────────────────────────────────────────────────
function Badge({ children, color = C.accent, size = "sm" }) {
  const p = size === "sm" ? "2px 8px" : "4px 12px";
  const fs = size === "sm" ? 10 : 12;
  return (
    <span style={{ background: color + "22", border: `1px solid ${color}44`, color, borderRadius: 4, padding: p, fontSize: fs, fontFamily: "monospace", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function KPICard({ label, value, delta }) {
  const positive = delta && (delta.startsWith("+") || delta === "Live" || delta === "Auto" || delta === "Real-time" || delta === "Historical" || delta === "G20 Focus" || delta === "AI Model" || delta.includes("Focus") || delta.includes("Q1"));
  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", minWidth: 130 }}>
      <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.text, fontFamily: "monospace" }}>{value}</div>
      {delta && <div style={{ fontSize: 11, color: positive ? C.accent3 : C.accentDanger, marginTop: 4 }}>{delta}</div>}
    </div>
  );
}

function AgentBubble({ name, active, color = C.accent }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.bgCard, border: `1px solid ${active ? color + "88" : C.border}`, borderRadius: 8, padding: "8px 12px", transition: "all 0.4s", boxShadow: active ? `0 0 12px ${color}33` : "none" }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: active ? color : C.textMuted, boxShadow: active ? `0 0 6px ${color}` : "none", transition: "all 0.4s" }} />
      <span style={{ fontSize: 12, color: active ? C.text : C.textMuted, transition: "all 0.4s" }}>{name}</span>
    </div>
  );
}

// ─── ETL PIPELINE VISUALIZER ───────────────────────────────────────────────
function ETLPipeline({ running, activeStage }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, padding: "16px 0", overflowX: "auto" }}>
      {ETL_PIPELINE_STAGES.map((stage, i) => {
        const isActive = running && i === activeStage;
        const isDone = running && i < activeStage;
        const col = isDone ? C.accent3 : isActive ? C.accent : C.textMuted;
        return (
          <div key={stage} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", border: `2px solid ${col}`, display: "flex", alignItems: "center", justifyContent: "center", background: isActive ? col + "22" : "transparent", boxShadow: isActive ? `0 0 16px ${col}66` : "none", transition: "all 0.4s", fontSize: 14, color: col, fontWeight: 700 }}>
                {isDone ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 10, color: col, whiteSpace: "nowrap", transition: "all 0.4s" }}>{stage}</span>
            </div>
            {i < ETL_PIPELINE_STAGES.length - 1 && (
              <div style={{ width: 40, height: 2, background: isDone ? C.accent3 : C.border, margin: "-14px 4px 0", transition: "all 0.4s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── LOG TERMINAL ──────────────────────────────────────────────────────────
function LogTerminal({ logs }) {
  const ref = useRef();
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [logs]);
  const tagColors = { "[EXTRACT]": "#06B6D4", "[VALIDATE]": "#F59E0B", "[TRANSFORM]": "#8B5CF6", "[AGGREGATE]": "#10B981", "[LOAD]": "#3B82F6", "[INDEX]": "#EC4899", "[AGENTS]": "#00D4FF", "[A2A]": "#F97316", "[REPORT]": "#84CC16", "[PIPELINE]": "#E2E8F0" };
  return (
    <div ref={ref} style={{ background: "#060A12", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", height: 200, overflowY: "auto", fontFamily: "monospace", fontSize: 11 }}>
      {logs.map((l, i) => {
        const tag = Object.keys(tagColors).find(t => l.startsWith(t));
        const rest = tag ? l.slice(tag.length) : l;
        return (
          <div key={i} style={{ marginBottom: 3, display: "flex", gap: 8 }}>
            <span style={{ color: C.textMuted, minWidth: 20 }}>{String(i + 1).padStart(2, "0")}</span>
            {tag && <span style={{ color: tagColors[tag] || C.textMuted }}>{tag}</span>}
            <span style={{ color: C.textDim }}>{rest}</span>
          </div>
        );
      })}
      {logs.length === 0 && <span style={{ color: C.textMuted }}>▌ Pipeline idle. Press Run to start.</span>}
    </div>
  );
}

// ─── SPARKLINE ─────────────────────────────────────────────────────────────
function Sparkline({ data, color, width = 120, height = 40 }) {
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / (max - min || 1)) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,${height} ${pts} ${width},${height}`} fill={color + "18"} stroke="none" />
    </svg>
  );
}

// ─── DONUT CHART ──────────────────────────────────────────────────────────
function DonutChart({ data, size = 120 }) {
  const total = data.reduce((a, b) => a + b.value, 0);
  let angle = -Math.PI / 2;
  const r = size / 2 - 8, cx = size / 2, cy = size / 2;
  const paths = data.map(({ value, color }) => {
    const sweep = (value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
    angle += sweep;
    const x2 = cx + r * Math.cos(angle), y2 = cy + r * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    return { d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`, color };
  });
  return (
    <svg width={size} height={size}>
      {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} opacity={0.85} />)}
      <circle cx={cx} cy={cy} r={r * 0.55} fill={C.bgCard} />
    </svg>
  );
}

// ─── BAR CHART ────────────────────────────────────────────────────────────
function BarChart({ labels, datasets, width = "100%", height = 140 }) {
  const allVals = datasets.flatMap(d => d.data);
  const maxV = Math.max(...allVals) * 1.15;
  const barW = Math.floor(260 / (labels.length * datasets.length + labels.length));
  const gapG = barW, gapB = 2;
  return (
    <svg width={width} height={height} viewBox={`0 0 300 ${height}`} preserveAspectRatio="xMidYMid meet">
      {labels.map((lbl, gi) => (
        <g key={gi}>
          {datasets.map((ds, di) => {
            const bh = ((ds.data[gi] || 0) / maxV) * (height - 30);
            const x = gi * (datasets.length * (barW + gapB) + gapG) + di * (barW + gapB) + 10;
            return (
              <g key={di}>
                <rect x={x} y={height - 20 - bh} width={barW} height={bh} fill={ds.color} rx={2} opacity={0.85} />
              </g>
            );
          })}
          <text x={gi * (datasets.length * (barW + gapB) + gapG) + (datasets.length * (barW + gapB)) / 2 + 10} y={height - 4} textAnchor="middle" fontSize={8} fill={C.textMuted}>{lbl}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── AI QUERY PANEL ───────────────────────────────────────────────────────
function AIQueryPanel({ model, activeCase }) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const presets = {
    stock: ["What sectors show bullish momentum today?", "Identify top 5 breakout candidates", "Analyze correlation between tech and interest rates"],
    advisory: ["Rebalance portfolio for 60/40 target", "Tax loss harvesting opportunities", "Risk-adjusted return vs benchmark"],
    fund: ["Which fund outperformed on risk-adjusted basis?", "Factor exposure breakdown for Fund A", "Generate board report summary"],
    smartphone: ["Who leads market share in Southeast Asia?", "Sentiment trend for iPhone 16 vs Galaxy S25", "Price elasticity analysis by region"],
    economies: ["Compare GDP growth trajectory: US vs China vs India", "Which economy faces highest inflation risk?", "Forecast trade balance shifts post-tariffs"],
  };
  const caseKey = activeCase?.key || "stock";
  const suggestions = presets[caseKey] || presets.stock;

  const ask = async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    setResponse("");
    const contextMap = {
      stock: "You are a financial data analyst. The user is viewing a stock analysis dashboard with ETL data from NYSE/NASDAQ. Provide concise, actionable insights (2–3 paragraphs max).",
      advisory: "You are a wealth management AI. The user views a financial advisory dashboard. Provide portfolio recommendations and risk analysis concisely.",
      fund: "You are a fund performance analyst. Provide attribution and performance analysis concisely.",
      smartphone: "You are a consumer electronics market researcher. Analyze Apple, Samsung, and Google Pixel competitive dynamics concisely.",
      economies: "You are a macroeconomic analyst. Compare the world's top 10 economies with data-driven insights concisely.",
    };
    const sys = contextMap[caseKey] || contextMap.stock;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: sys,
          messages: [{ role: "user", content: q }],
        }),
      });
      const data = await res.json();
      setResponse(data.content?.[0]?.text || "No response received.");
    } catch (e) {
      setResponse("⚠ Could not reach AI API. Please check your connection or API configuration.");
    }
    setLoading(false);
  };

  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: model?.color || C.accent, boxShadow: `0 0 8px ${model?.color || C.accent}` }} />
        <span style={{ fontSize: 12, color: C.textDim }}>AI Query Interface</span>
        <span style={{ marginLeft: "auto" }}><Badge color={model?.color || C.accent}>{model?.name || "Claude Sonnet"}</Badge></span>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => { setQuery(s); ask(s); }} style={{ background: C.bgPanel, border: `1px solid ${C.borderBright}`, borderRadius: 6, padding: "5px 10px", fontSize: 11, color: C.textDim, cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.target.style.borderColor = C.accent; e.target.style.color = C.text; }}
            onMouseLeave={e => { e.target.style.borderColor = C.borderBright; e.target.style.color = C.textDim; }}>
            {s}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && ask(query)} placeholder="Ask AI about this dashboard data..." style={{ flex: 1, background: C.bg, border: `1px solid ${C.borderBright}`, borderRadius: 8, padding: "9px 14px", fontSize: 13, color: C.text, outline: "none", fontFamily: "inherit" }} />
        <button onClick={() => ask(query)} disabled={loading} style={{ background: loading ? C.border : C.accent + "22", border: `1px solid ${C.accent}`, borderRadius: 8, padding: "9px 18px", color: C.accent, fontSize: 13, cursor: loading ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
          {loading ? "●●●" : "↗ Ask"}
        </button>
      </div>
      {(loading || response) && (
        <div style={{ marginTop: 12, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, fontSize: 13, color: C.textDim, lineHeight: 1.7, maxHeight: 200, overflowY: "auto" }}>
          {loading ? <span style={{ color: C.accent }}>◌ Generating insights...</span> : response}
        </div>
      )}
    </div>
  );
}

// ─── CONFIG MODAL ─────────────────────────────────────────────────────────
function ConfigModal({ open, onClose, selectedModel, setSelectedModel, etlConfig, setEtlConfig }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: C.bgCard, border: `1px solid ${C.borderBright}`, borderRadius: 16, padding: 28, width: 620, maxHeight: "85vh", overflowY: "auto", boxShadow: `0 0 60px ${C.accent}22` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 18, color: C.text, letterSpacing: "-0.02em" }}>⚙ Platform Configuration</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.textMuted, fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>AI Model Selection</div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: C.textDim, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ background: "#10B98122", border: "1px solid #10B98144", borderRadius: 4, padding: "2px 8px", color: "#10B981", fontSize: 10 }}>LOCAL</span> Open-source / Self-hosted
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {AI_MODELS.local.map(m => (
                <button key={m.id} onClick={() => setSelectedModel(m)} style={{ background: selectedModel?.id === m.id ? m.color + "22" : C.bgPanel, border: `1px solid ${selectedModel?.id === m.id ? m.color : C.border}`, borderRadius: 8, padding: "8px 14px", cursor: "pointer", transition: "all 0.2s" }}>
                  <div style={{ fontSize: 12, color: selectedModel?.id === m.id ? m.color : C.textDim, fontWeight: 600 }}>{m.name}</div>
                  <div style={{ fontSize: 10, color: C.textMuted }}>{m.tag}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: C.textDim, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ background: "#7C3AED22", border: "1px solid #7C3AED44", borderRadius: 4, padding: "2px 8px", color: "#7C3AED", fontSize: 10 }}>CLOUD</span> Managed API
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {AI_MODELS.cloud.map(m => (
                <button key={m.id} onClick={() => setSelectedModel(m)} style={{ background: selectedModel?.id === m.id ? m.color + "22" : C.bgPanel, border: `1px solid ${selectedModel?.id === m.id ? m.color : C.border}`, borderRadius: 8, padding: "8px 14px", cursor: "pointer", transition: "all 0.2s" }}>
                  <div style={{ fontSize: 12, color: selectedModel?.id === m.id ? m.color : C.textDim, fontWeight: 600 }}>{m.name}</div>
                  <div style={{ fontSize: 10, color: C.textMuted }}>{m.provider} · {m.tag}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>ETL Configuration</div>
          {[
            { key: "batchSize", label: "Batch Size", options: ["1,000", "10,000", "100,000", "1,000,000"] },
            { key: "refreshInterval", label: "Refresh Interval", options: ["5s", "15s", "30s", "1min", "5min"] },
            { key: "parallelAgents", label: "Parallel Agents", options: ["2", "4", "8", "16"] },
            { key: "vectorStore", label: "Vector Store", options: ["Pinecone", "Weaviate", "Qdrant", "pgvector"] },
            { key: "dataWarehouse", label: "Data Warehouse", options: ["Snowflake", "BigQuery", "Redshift", "DuckDB"] },
            { key: "streamProcessor", label: "Stream Processor", options: ["Kafka", "Flink", "Spark Streaming", "Pulsar"] },
          ].map(({ key, label, options }) => (
            <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 13, color: C.textDim }}>{label}</span>
              <select value={etlConfig[key]} onChange={e => setEtlConfig(prev => ({ ...prev, [key]: e.target.value }))} style={{ background: C.bgPanel, border: `1px solid ${C.borderBright}`, borderRadius: 6, padding: "5px 10px", color: C.text, fontSize: 12, cursor: "pointer" }}>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        <button onClick={onClose} style={{ width: "100%", background: C.accent + "22", border: `1px solid ${C.accent}`, borderRadius: 10, padding: "12px", color: C.accent, fontSize: 14, cursor: "pointer", fontWeight: 600 }}>
          ✓ Save Configuration
        </button>
      </div>
    </div>
  );
}

// ─── AGENT FLOW DIAGRAM ───────────────────────────────────────────────────
function AgentFlowDiagram({ agents, activeAgents }) {
  const colors = [C.accent, "#7C3AED", "#10B981", "#F59E0B", "#EC4899"];
  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>Multi-Agent Framework · A2A Communication</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {agents.map((a, i) => <AgentBubble key={a} name={a} active={activeAgents.includes(i)} color={colors[i % colors.length]} />)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.textMuted }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accentWarn, boxShadow: `0 0 6px ${C.accentWarn}` }} />
        <span>A2A messages flowing between active agents</span>
        <span style={{ marginLeft: "auto", color: C.accent, fontFamily: "monospace" }}>{activeAgents.length}/{agents.length} active</span>
      </div>
    </div>
  );
}

// ─── DASHBOARD CHARTS PANEL ───────────────────────────────────────────────
function DashboardCharts({ caseKey }) {
  const stockData = {
    priceData: Array.from({ length: 30 }, (_, i) => 150 + Math.sin(i * 0.4) * 20 + Math.random() * 10),
    volumeData: Array.from({ length: 30 }, () => 1000000 + Math.random() * 500000),
  };

  const marketShare = [
    { label: "Apple", value: 18, color: "#94A3B8" },
    { label: "Samsung", value: 22, color: "#3B82F6" },
    { label: "Xiaomi", value: 13, color: "#F59E0B" },
    { label: "Google", value: 4, color: "#10B981" },
    { label: "Others", value: 43, color: "#374151" },
  ];

  const economies = [
    { name: "USA", gdp: 27.4, color: "#3B82F6" },
    { name: "China", gdp: 18.6, color: "#EF4444" },
    { name: "Germany", gdp: 4.5, color: "#F59E0B" },
    { name: "Japan", gdp: 4.1, color: "#10B981" },
    { name: "India", gdp: 3.7, color: "#EC4899" },
    { name: "UK", gdp: 3.1, color: "#6366F1" },
    { name: "France", gdp: 2.9, color: "#14B8A6" },
    { name: "Brazil", gdp: 2.1, color: "#84CC16" },
    { name: "Italy", gdp: 2.1, color: "#F97316" },
    { name: "Canada", gdp: 2.1, color: "#8B5CF6" },
  ];

  if (caseKey === "stock" || caseKey === "advisory" || caseKey === "fund") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>Price History (30d)</div>
          <Sparkline data={stockData.priceData} color={C.accent} width={220} height={60} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.textMuted, marginTop: 4 }}>
            <span>30d ago</span><span style={{ color: C.accent3 }}>+8.4%</span><span>Today</span>
          </div>
        </div>
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>Volume Trend</div>
          <Sparkline data={stockData.volumeData} color="#7C3AED" width={220} height={60} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.textMuted, marginTop: 4 }}>
            <span>Avg 1.4M</span><span style={{ color: "#7C3AED" }}>↑ Spike detected</span>
          </div>
        </div>
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>Sector Allocation</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <DonutChart data={[{ value: 35, color: C.accent }, { value: 20, color: "#7C3AED" }, { value: 18, color: "#10B981" }, { value: 15, color: "#F59E0B" }, { value: 12, color: "#EC4899" }]} />
            <div style={{ fontSize: 10, color: C.textMuted, display: "flex", flexDirection: "column", gap: 4 }}>
              {["Tech 35%", "Finance 20%", "Health 18%", "Energy 15%", "Other 12%"].map((l, i) => (
                <span key={i} style={{ color: [C.accent, "#7C3AED", "#10B981", "#F59E0B", "#EC4899"][i] }}>● {l}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>Risk/Return Matrix</div>
          <svg width="100%" height="80" viewBox="0 0 200 80">
            {[{ x: 40, y: 55, r: 8, c: C.accent, l: "Portfolio" }, { x: 90, y: 35, r: 6, c: "#10B981", l: "Benchmark" }, { x: 130, y: 25, r: 10, c: "#F59E0B", l: "Aggressive" }, { x: 60, y: 65, r: 5, c: "#7C3AED", l: "Conservative" }].map((p, i) => (
              <g key={i}><circle cx={p.x} cy={p.y} r={p.r} fill={p.c} opacity={0.8} /><text x={p.x + p.r + 3} y={p.y + 4} fontSize={8} fill={C.textMuted}>{p.l}</text></g>
            ))}
            <line x1={10} y1={75} x2={190} y2={75} stroke={C.border} strokeWidth={0.5} />
            <line x1={10} y1={75} x2={10} y2={5} stroke={C.border} strokeWidth={0.5} />
            <text x={95} y={78} fontSize={7} fill={C.textMuted} textAnchor="middle">Risk →</text>
            <text x={6} y={40} fontSize={7} fill={C.textMuted} textAnchor="middle" transform="rotate(-90,6,40)">Return</text>
          </svg>
        </div>
      </div>
    );
  }

  if (caseKey === "smartphone") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>Global Market Share Q1 2025</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <DonutChart data={marketShare} size={100} />
            <div style={{ fontSize: 10, display: "flex", flexDirection: "column", gap: 4 }}>
              {marketShare.map((m, i) => <span key={i} style={{ color: m.color }}>● {m.label}: {m.value}%</span>)}
            </div>
          </div>
        </div>
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>Brand Sentiment Score</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[{ brand: "Apple", score: 84, color: "#94A3B8" }, { brand: "Samsung", score: 76, color: "#3B82F6" }, { brand: "Google Pixel", score: 88, color: "#10B981" }].map(({ brand, score, color }) => (
              <div key={brand}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.textDim, marginBottom: 3 }}>
                  <span>{brand}</span><span style={{ color }}>{score}/100</span>
                </div>
                <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, gridColumn: "span 2" }}>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>Quarterly Sales Trend (Units M)</div>
          <BarChart labels={["Q1 24", "Q2 24", "Q3 24", "Q4 24", "Q1 25"]} datasets={[{ data: [58, 52, 61, 79, 62], color: "#94A3B8" }, { data: [72, 68, 75, 82, 70], color: "#3B82F6" }, { data: [9, 10, 11, 13, 12], color: "#10B981" }]} height={120} />
          <div style={{ display: "flex", gap: 16, marginTop: 6, fontSize: 10 }}>
            {[["Apple", "#94A3B8"], ["Samsung", "#3B82F6"], ["Google", "#10B981"]].map(([l, c]) => <span key={l} style={{ color: c }}>● {l}</span>)}
          </div>
        </div>
      </div>
    );
  }

  // economies
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
      <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 10 }}>GDP 2024 (USD Trillion)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {economies.map(({ name, gdp, color }) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 11, color: C.textDim, minWidth: 50 }}>{name}</span>
              <div style={{ flex: 1, height: 14, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${(gdp / 28) * 100}%`, height: "100%", background: color, borderRadius: 3, transition: "width 1s" }} />
              </div>
              <span style={{ fontSize: 11, color, fontFamily: "monospace", minWidth: 40 }}>${gdp}T</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>Inflation Rate 2024 (%)</div>
          <BarChart labels={["US", "CN", "DE", "JP", "IN", "UK", "FR", "BR", "IT", "CA"]} datasets={[{ data: [3.4, 0.2, 2.2, 2.8, 5.4, 3.2, 2.4, 4.8, 1.8, 2.9], color: C.accentWarn }]} height={100} />
        </div>
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>GDP Growth Forecast 2025 (%)</div>
          <BarChart labels={["IN", "CN", "US", "CA", "FR", "BR", "UK", "DE", "IT", "JP"]} datasets={[{ data: [6.8, 4.6, 2.1, 1.8, 1.1, 2.3, 1.3, 0.2, 0.7, 1.1], color: C.accent3 }]} height={100} />
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD PANEL ─────────────────────────────────────────────────
function DemoPanel({ caseKey, caseData, selectedModel, etlConfig }) {
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [activeStage, setActiveStage] = useState(0);
  const [activeAgents, setActiveAgents] = useState([]);
  const [stats, setStats] = useState({ records: 0, throughput: 0, errors: 0 });
  const timerRef = useRef(null);
  const logIndexRef = useRef(0);

  const startPipeline = () => {
    setRunning(true);
    setLogs([]);
    setActiveStage(0);
    setActiveAgents([]);
    logIndexRef.current = 0;
  };

  const stopPipeline = () => {
    setRunning(false);
    clearTimeout(timerRef.current);
  };

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const i = logIndexRef.current;
      if (i >= ETL_LOGS.length) { setRunning(false); return; }
      setLogs(prev => [...prev, ETL_LOGS[i]]);
      setActiveStage(Math.min(5, Math.floor((i / ETL_LOGS.length) * 6)));
      setActiveAgents(prev => { const next = new Set(prev); if (i > 10) next.add(i % caseData.agents.length); return Array.from(next); });
      setStats({ records: Math.floor((i + 1) * 12400 + Math.random() * 1000), throughput: Math.floor(800 + Math.random() * 400), errors: Math.floor(Math.random() * 3) });
      logIndexRef.current++;
      timerRef.current = setTimeout(tick, 180 + Math.random() * 120);
    };
    timerRef.current = setTimeout(tick, 200);
    return () => clearTimeout(timerRef.current);
  }, [running]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ margin: "0 0 4px", fontSize: 16, color: C.text }}>{caseData.label}</h3>
            <p style={{ margin: 0, fontSize: 12, color: C.textMuted, maxWidth: 500 }}>{caseData.desc}</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={running ? stopPipeline : startPipeline} style={{ background: running ? C.accentDanger + "22" : C.accent3 + "22", border: `1px solid ${running ? C.accentDanger : C.accent3}`, borderRadius: 8, padding: "9px 20px", color: running ? C.accentDanger : C.accent3, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
              {running ? "◼ Stop Pipeline" : "▶ Run ETL Pipeline"}
            </button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          <Badge color={C.textMuted}>Sources: {caseData.datasets.length}</Badge>
          {caseData.datasets.map(ds => <Badge key={ds} color={C.textMuted}>{ds}</Badge>)}
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
        {caseData.kpis.map(k => <KPICard key={k.label} {...k} />)}
        {running && (
          <>
            <KPICard label="Records Processed" value={stats.records.toLocaleString()} delta={`+${stats.throughput}/s`} />
            <KPICard label="Pipeline Errors" value={stats.errors} delta={stats.errors === 0 ? "Clean run ✓" : "⚠ Check logs"} />
          </>
        )}
      </div>

      {/* ETL Pipeline */}
      <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
          ETL Pipeline · {etlConfig.streamProcessor} → {etlConfig.dataWarehouse}
        </div>
        <ETLPipeline running={running} activeStage={activeStage} />
        <div style={{ display: "flex", gap: 16, fontSize: 11, color: C.textMuted, marginTop: 4 }}>
          <span>Batch: <strong style={{ color: C.textDim }}>{etlConfig.batchSize}</strong></span>
          <span>Interval: <strong style={{ color: C.textDim }}>{etlConfig.refreshInterval}</strong></span>
          <span>Agents: <strong style={{ color: C.textDim }}>{etlConfig.parallelAgents}</strong></span>
          <span>Vector: <strong style={{ color: C.textDim }}>{etlConfig.vectorStore}</strong></span>
        </div>
      </div>

      {/* Agent Flow + Log */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <AgentFlowDiagram agents={caseData.agents} activeAgents={activeAgents} />
        <div>
          <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Live ETL Log</div>
          <LogTerminal logs={logs} />
        </div>
      </div>

      {/* Charts */}
      <div>
        <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Analytics Dashboard</div>
        <DashboardCharts caseKey={caseKey} />
      </div>

      {/* AI Query */}
      <AIQueryPanel model={selectedModel} activeCase={{ key: caseKey }} />
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────
export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("BFSI");
  const [selectedSub, setSelectedSub] = useState("stock");
  const [configOpen, setConfigOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS.cloud[1]);
  const [etlConfig, setEtlConfig] = useState({ batchSize: "100,000", refreshInterval: "30s", parallelAgents: "8", vectorStore: "Pinecone", dataWarehouse: "Snowflake", streamProcessor: "Kafka" });

  const cat = DEMO_CASES[selectedCategory];
  const subcases = cat?.sub || {};
  const activeCase = subcases[selectedSub] || Object.values(subcases)[0];

  const gridBg = `linear-gradient(${C.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${C.gridLine} 1px, transparent 1px)`;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", backgroundImage: gridBg, backgroundSize: "40px 40px", color: C.text }}>
      <ConfigModal open={configOpen} onClose={() => setConfigOpen(false)} selectedModel={selectedModel} setSelectedModel={setSelectedModel} etlConfig={etlConfig} setEtlConfig={setEtlConfig} />

      {/* Top Nav */}
      <div style={{ borderBottom: `1px solid ${C.border}`, background: C.bgCard + "dd", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 16, height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>◈</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, letterSpacing: "-0.02em" }}>FABRIC</div>
              <div style={{ fontSize: 9, color: C.textMuted, letterSpacing: "0.1em" }}>ETL · AI · MULTI-AGENT PLATFORM</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 4, marginLeft: 24 }}>
            {Object.entries(DEMO_CASES).map(([key, cat]) => (
              <button key={key} onClick={() => { setSelectedCategory(key); setSelectedSub(Object.keys(cat.sub)[0]); }} style={{ background: selectedCategory === key ? cat.color + "22" : "transparent", border: `1px solid ${selectedCategory === key ? cat.color + "88" : "transparent"}`, borderRadius: 8, padding: "6px 14px", color: selectedCategory === key ? cat.color : C.textMuted, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}>
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: selectedModel.color + "22", border: `1px solid ${selectedModel.color}44`, borderRadius: 8, padding: "5px 12px" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: selectedModel.color, boxShadow: `0 0 6px ${selectedModel.color}` }} />
              <span style={{ fontSize: 11, color: selectedModel.color }}>{selectedModel.name}</span>
            </div>
            <button onClick={() => setConfigOpen(true)} style={{ background: C.bgPanel, border: `1px solid ${C.borderBright}`, borderRadius: 8, padding: "6px 14px", color: C.textDim, fontSize: 12, cursor: "pointer" }}>⚙ Config</button>
          </div>
        </div>
      </div>

      {/* Sub-nav */}
      {Object.keys(subcases).length > 1 && (
        <div style={{ borderBottom: `1px solid ${C.border}`, background: C.bgPanel, padding: "0 24px" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", gap: 4, padding: "8px 0" }}>
            {Object.entries(subcases).map(([key, sub]) => (
              <button key={key} onClick={() => setSelectedSub(key)} style={{ background: selectedSub === key ? cat.color + "22" : "transparent", border: `1px solid ${selectedSub === key ? cat.color + "44" : "transparent"}`, borderRadius: 8, padding: "6px 14px", color: selectedSub === key ? cat.color : C.textMuted, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}>
                {sub.icon} {sub.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Body */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 24px 60px" }}>
        {/* Architecture overview row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginBottom: 20 }}>
          {[
            { label: "Data Sources", value: activeCase?.datasets?.length || 5, icon: "⬡", color: C.accent },
            { label: "ETL Engine", value: etlConfig.streamProcessor, icon: "⟳", color: "#7C3AED" },
            { label: "Warehouse", value: etlConfig.dataWarehouse, icon: "▣", color: "#10B981" },
            { label: "Vector Store", value: etlConfig.vectorStore, icon: "⬢", color: "#F59E0B" },
            { label: "AI Agents", value: activeCase?.agents?.length || 5, icon: "◉", color: "#EC4899" },
            { label: "AI Model", value: selectedModel.name, icon: "◈", color: selectedModel.color },
          ].map(({ label, value, icon, color }) => (
            <div key={label} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", borderTop: `2px solid ${color}` }}>
              <div style={{ fontSize: 16, marginBottom: 4 }}>{icon}</div>
              <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
              <div style={{ fontSize: 12, color, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</div>
            </div>
          ))}
        </div>

        {activeCase && <DemoPanel caseKey={selectedSub} caseData={activeCase} selectedModel={selectedModel} etlConfig={etlConfig} />}
      </div>
    </div>
  );
}
