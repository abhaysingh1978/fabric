import type { Category } from '@types/index'

export const DEMOS: Record<string, Category> = {
  BFSI: {
    label: 'BFSI',
    icon: '◈',
    color: '#00D4FF',
    sub: {
      stock: {
        label: 'Stock Analysis',
        icon: '📈',
        desc: 'Real-time multi-agent analysis of equity markets using live feeds, technical indicators, sentiment signals, and risk models.',
        datasets: ['NYSE/NASDAQ Feeds', 'Options Chain', 'SEC Filings', 'Sentiment Data', 'Macro Indicators'],
        agents: ['Market Data', 'Technical Analysis', 'Sentiment', 'Risk', 'Report'],
        kpis: [
          { l: 'Tickers Tracked', v: '4,200+' },
          { l: 'Data Points/sec', v: '2.8M' },
          { l: 'Model Accuracy', v: '87.3%', d: '+2.1%' },
          { l: 'Latency p99', v: '42ms', d: '-8ms' },
        ],
        caseKey: 'stock',
      },
      advisory: {
        label: 'Financial Advisory',
        icon: '⊕',
        desc: 'AI-driven wealth management platform delivering personalised portfolio recommendations, risk profiling, and automated rebalancing.',
        datasets: ['Portfolio Holdings', 'Market Benchmarks', 'Client Profiles', 'Tax Records', 'ESG Ratings'],
        agents: ['Portfolio', 'Risk Profiler', 'Rebalance', 'Tax', 'Client Report'],
        kpis: [
          { l: 'AUM', v: '$2.4B', d: '+$140M' },
          { l: 'Portfolios', v: '14,800' },
          { l: 'Sharpe Ratio', v: '1.94', d: '+0.12' },
          { l: 'Signals/Day', v: '890' },
        ],
        caseKey: 'advisory',
      },
      fund: {
        label: 'Fund Performance',
        icon: '⊞',
        desc: 'Automated fund performance attribution, factor analysis, and compliance reporting across multi-strategy portfolios.',
        datasets: ['Fund NAV History', 'Benchmark Indices', 'Factor Models', 'Compliance Rules', 'Investor Reports'],
        agents: ['Performance', 'Attribution', 'Factor', 'Compliance', 'Board Report'],
        kpis: [
          { l: 'Funds', v: '382' },
          { l: 'Alpha', v: '3.2%', d: '+0.4%' },
          { l: 'Reports/Month', v: '1,240' },
          { l: 'Data Sources', v: '47' },
        ],
        caseKey: 'fund',
      },
    },
  },
  Sales: {
    label: 'Sales',
    icon: '◉',
    color: '#10B981',
    sub: {
      smartphone: {
        label: 'Smartphone Sales Research',
        icon: '📱',
        desc: 'Competitive intelligence platform tracking global smartphone market share, pricing dynamics, sentiment, and channel performance.',
        datasets: ['Retail POS Data', 'Review Platforms', 'Pricing APIs', 'Channel Reports', 'Carrier Data'],
        agents: ['Market Share', 'Sentiment', 'Pricing', 'Channel', 'Forecast'],
        kpis: [
          { l: 'Markets', v: '68' },
          { l: 'Reviews Analysed', v: '12.4M' },
          { l: 'Data Freshness', v: '<4hrs', d: 'Live' },
          { l: 'SKUs Tracked', v: '3,840' },
        ],
        caseKey: 'smartphone',
      },
    },
  },
  Economy: {
    label: 'Economy',
    icon: '⊛',
    color: '#7C3AED',
    sub: {
      economies: {
        label: 'World Top 10 Economies',
        icon: '🌐',
        desc: 'Macroeconomic intelligence platform monitoring GDP, trade flows, inflation, FX, and geopolitical risk across the top 10 global economies.',
        datasets: ['World Bank API', 'IMF Data', 'Central Bank Feeds', 'Trade Statistics', 'Geopolitical Indices'],
        agents: ['GDP', 'Trade', 'Inflation', 'FX', 'Geopolitical Risk'],
        kpis: [
          { l: 'Economies', v: '10' },
          { l: 'Indicators', v: '240+' },
          { l: 'Time Series', v: '50yr' },
          { l: 'Forecast Horizon', v: '5yr' },
        ],
        caseKey: 'economies',
      },
    },
  },
}
