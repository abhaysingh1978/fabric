interface CatalogItem {
  name: string
  domains: string[]  // empty = general (always shown, lowest priority)
}

// Domain detection patterns — tested against combined "flow label + category"
const DOMAIN_PATTERNS: Record<string, RegExp> = {
  finance:       /\b(financ|banking|bank|invest|trading|trade|fund|portfolio|equity|stock|hedge|wealth|insur|credit|asset|market|bfsi|forex|crypto|option|bond|commodit|treasury|capital|lending|fintech)\b/i,
  sales:         /\b(sale|revenue|crm|commerc|retail|ecommerce|lead|pipeline|deal|quota|customer|b2b|b2c|channel|partner|prospecting|conversion|upsell)\b/i,
  healthcare:    /\b(health|medical|clinic|patient|hospital|pharma|drug|diagnos|ehr|emr|care|treatment|wellness|biotech|life.?science|genomic|clinical|nursing|radiology|dentis)\b/i,
  marketing:     /\b(market|campaign|adverti|social.?media|seo|sem|email|content|brand|audience|digital.?market|influencer|analytics|growth|demand.?gen)\b/i,
  technology:    /\b(tech|software|devops|cloud|api|cod(e|ing)|engineer|platform|infra|deploy|kubernetes|microserv|saas|paas|developer|product|agile|sprint)\b/i,
  hr:            /\b(hr|human.?resource|employee|people|talent|workforce|payroll|recruit|hir|onboard|performance|engagement|retention|culture|diversity)\b/i,
  manufacturing: /\b(manufactur|production|supply.?chain|logistic|iot|sensor|factory|warehouse|inventory|quality|assembly|equipment|oee|lean|six.?sigma)\b/i,
  economy:       /\b(econom|macro|gdp|trade.?flow|inflation|geopolit|central.?bank|monetary|fiscal|export|import|sovereign|emerging.?market)\b/i,
  esg:           /\b(esg|sustainab|climate|carbon|environment|green|emission|renewable|energy.?transition|impact|net.?zero|scope)\b/i,
  security:      /\b(secur|cyber|fraud|compliance|risk|audit|threat|vulnerab|soc|siem|access|identity|penetrat|phishing|ransomware)\b/i,
  retail:        /\b(retail|store|merch|product.?catalog|inventory|order|checkout|cart|pos|point.?of.?sale|omnichannel|fulfil)\b/i,
  logistics:     /\b(logistic|shipping|delivery|transport|fleet|route|cargo|dispatch|last.?mile|freight|courier)\b/i,
  realestate:    /\b(real.?estate|property|realty|mortgage|tenant|lease|rent|building|apprais|proptech|facilities)\b/i,
  media:         /\b(media|content|stream|video|audio|broadcast|publish|news|entertainment|music|podcast|ott|subscriber)\b/i,
  education:     /\b(educat|school|universit|student|course|learning|curriculum|teacher|academic|edtech|e.?learning|lms)\b/i,
  government:    /\b(government|public.?sector|agency|policy|civic|municipal|federal|state|regulat|ministry|citizen)\b/i,
}

// ── Dataset catalog ───────────────────────────────────────────────────────────

export const DATASET_CATALOG: CatalogItem[] = [
  // Finance
  { name: 'NYSE / NASDAQ Feeds',         domains: ['finance'] },
  { name: 'Bloomberg Terminal',          domains: ['finance'] },
  { name: 'Reuters Market Data',         domains: ['finance'] },
  { name: 'SEC Filings (EDGAR)',         domains: ['finance'] },
  { name: 'Options Chain Data',          domains: ['finance'] },
  { name: 'Fund NAV History',            domains: ['finance'] },
  { name: 'Portfolio Holdings',          domains: ['finance'] },
  { name: 'Earnings Reports',            domains: ['finance'] },
  { name: 'Analyst Estimates',           domains: ['finance'] },
  { name: 'Insider Transactions',        domains: ['finance'] },
  { name: 'Short Interest Data',         domains: ['finance'] },
  { name: 'FX Rates & Volatility',       domains: ['finance'] },
  { name: 'Credit Ratings Data',         domains: ['finance', 'security'] },
  { name: 'Macro Indicators',            domains: ['finance', 'economy'] },
  { name: 'ESG Ratings',                 domains: ['finance', 'esg'] },
  { name: 'Benchmark Indices',           domains: ['finance'] },
  { name: 'Factor Models',               domains: ['finance'] },
  { name: 'Client Profiles',             domains: ['finance', 'sales'] },
  { name: 'Tax Records',                 domains: ['finance'] },
  { name: 'Compliance Rules',            domains: ['finance', 'security'] },
  // Sales / CRM
  { name: 'Salesforce CRM',             domains: ['sales'] },
  { name: 'HubSpot CRM',                domains: ['sales', 'marketing'] },
  { name: 'Opportunity Pipeline',        domains: ['sales'] },
  { name: 'Lead Scoring Models',         domains: ['sales', 'marketing'] },
  { name: 'Revenue Analytics',           domains: ['sales'] },
  { name: 'Win / Loss Reports',          domains: ['sales'] },
  { name: 'Customer Profiles',           domains: ['sales', 'retail'] },
  { name: 'Pricing Data',               domains: ['sales', 'retail'] },
  { name: 'Channel Performance',         domains: ['sales'] },
  { name: 'E-commerce Transactions',     domains: ['sales', 'retail'] },
  { name: 'Churn Indicators',            domains: ['sales'] },
  { name: 'Contract & Renewal Data',     domains: ['sales'] },
  // Healthcare
  { name: 'EHR / EMR Records',           domains: ['healthcare'] },
  { name: 'Lab Results & Biomarkers',    domains: ['healthcare'] },
  { name: 'Medical Claims Data',         domains: ['healthcare'] },
  { name: 'Clinical Trial Data',         domains: ['healthcare'] },
  { name: 'Drug Formularies',            domains: ['healthcare'] },
  { name: 'Patient Demographics',        domains: ['healthcare'] },
  { name: 'Radiology & Imaging',         domains: ['healthcare'] },
  { name: 'Prescription Data',           domains: ['healthcare'] },
  { name: 'Hospital Admissions',         domains: ['healthcare'] },
  { name: 'Insurance Claims',            domains: ['healthcare', 'finance'] },
  // Marketing
  { name: 'Google Analytics',            domains: ['marketing', 'technology'] },
  { name: 'Social Media Feeds',          domains: ['marketing', 'media'] },
  { name: 'Campaign Performance',        domains: ['marketing'] },
  { name: 'Ad Spend Data',              domains: ['marketing'] },
  { name: 'Email Engagement Metrics',    domains: ['marketing'] },
  { name: 'SEO Rankings',               domains: ['marketing'] },
  { name: 'Audience Segments',          domains: ['marketing', 'retail'] },
  { name: 'Attribution Data',           domains: ['marketing'] },
  { name: 'A/B Test Results',           domains: ['marketing', 'technology'] },
  { name: 'Review Platforms',           domains: ['marketing', 'retail'] },
  // Technology
  { name: 'GitHub Repos & Commits',      domains: ['technology'] },
  { name: 'CI/CD Pipeline Logs',         domains: ['technology'] },
  { name: 'Application Error Logs',      domains: ['technology'] },
  { name: 'API Request Logs',            domains: ['technology'] },
  { name: 'Infrastructure Metrics',      domains: ['technology'] },
  { name: 'Performance Traces (APM)',    domains: ['technology'] },
  { name: 'Security Scan Reports',       domains: ['technology', 'security'] },
  { name: 'Deployment History',          domains: ['technology'] },
  { name: 'Feature Flag Data',           domains: ['technology'] },
  // HR
  { name: 'Employee Records',            domains: ['hr'] },
  { name: 'Payroll Data',               domains: ['hr'] },
  { name: 'Performance Reviews',         domains: ['hr'] },
  { name: 'Recruitment Pipeline',        domains: ['hr'] },
  { name: 'Turnover & Attrition',        domains: ['hr'] },
  { name: 'Learning & Development',      domains: ['hr'] },
  { name: 'Benefits Data',              domains: ['hr'] },
  { name: 'Engagement Survey Results',   domains: ['hr'] },
  { name: 'Org Chart & Headcount',       domains: ['hr'] },
  // Manufacturing / IoT
  { name: 'Sensor Telemetry (IoT)',      domains: ['manufacturing', 'logistics'] },
  { name: 'Production Metrics',          domains: ['manufacturing'] },
  { name: 'Quality Control Data',        domains: ['manufacturing'] },
  { name: 'Supply Chain Records',        domains: ['manufacturing', 'logistics'] },
  { name: 'Inventory Levels',           domains: ['manufacturing', 'retail'] },
  { name: 'Maintenance Logs',           domains: ['manufacturing'] },
  { name: 'Equipment Utilisation',       domains: ['manufacturing'] },
  { name: 'Energy Consumption',          domains: ['manufacturing', 'esg'] },
  // Economy / Macro
  { name: 'World Bank API',             domains: ['economy'] },
  { name: 'IMF Data',                   domains: ['economy'] },
  { name: 'Central Bank Feeds',         domains: ['economy', 'finance'] },
  { name: 'Trade Statistics',           domains: ['economy'] },
  { name: 'Geopolitical Indices',       domains: ['economy'] },
  { name: 'CPI / Inflation Data',       domains: ['economy', 'finance'] },
  { name: 'GDP Time Series',            domains: ['economy'] },
  { name: 'Sovereign Debt Data',        domains: ['economy', 'finance'] },
  // ESG
  { name: 'Carbon Emission Records',    domains: ['esg'] },
  { name: 'Sustainability Reports',     domains: ['esg'] },
  { name: 'Climate Risk Indices',       domains: ['esg'] },
  { name: 'Renewable Energy Data',      domains: ['esg'] },
  // Security / Risk
  { name: 'Fraud Transaction Logs',     domains: ['security', 'finance'] },
  { name: 'Threat Intelligence Feeds',  domains: ['security'] },
  { name: 'Access & Identity Logs',     domains: ['security'] },
  { name: 'Compliance Audit Trails',    domains: ['security'] },
  { name: 'Vulnerability Scan Data',    domains: ['security', 'technology'] },
  // Retail / Logistics
  { name: 'POS Transaction Data',       domains: ['retail'] },
  { name: 'Product Catalog',            domains: ['retail'] },
  { name: 'Return & Refund Data',       domains: ['retail'] },
  { name: 'Carrier & Shipment Data',    domains: ['logistics'] },
  { name: 'Fleet Telemetry',            domains: ['logistics'] },
  { name: 'Route Optimisation Data',    domains: ['logistics'] },
  // Media / Education
  { name: 'Streaming Engagement',       domains: ['media'] },
  { name: 'Content Metadata',           domains: ['media', 'education'] },
  { name: 'Student Performance Data',   domains: ['education'] },
  { name: 'Course Completion Rates',    domains: ['education'] },
  { name: 'LMS Activity Logs',          domains: ['education'] },
  // Real Estate
  { name: 'Property Listings',          domains: ['realestate'] },
  { name: 'Mortgage Applications',      domains: ['realestate', 'finance'] },
  { name: 'Lease & Tenancy Records',    domains: ['realestate'] },
  // Government
  { name: 'Public Procurement Data',    domains: ['government'] },
  { name: 'Census & Demographics',      domains: ['government', 'economy'] },
  { name: 'Regulatory Filings',         domains: ['government', 'security'] },
  // General (no domain — always available)
  { name: 'PostgreSQL Database',        domains: [] },
  { name: 'MySQL Database',             domains: [] },
  { name: 'MongoDB Collections',        domains: [] },
  { name: 'REST API',                   domains: [] },
  { name: 'CSV / Excel Files',          domains: [] },
  { name: 'AWS S3 Buckets',             domains: [] },
  { name: 'Azure Blob Storage',         domains: [] },
  { name: 'Google Cloud Storage',       domains: [] },
  { name: 'Kafka Streams',              domains: [] },
  { name: 'Data Warehouse Tables',      domains: [] },
  { name: 'SFTP File Server',           domains: [] },
  { name: 'Webhooks',                   domains: [] },
]

// ── Agent catalog ─────────────────────────────────────────────────────────────

export const AGENT_CATALOG: CatalogItem[] = [
  // Finance
  { name: 'Market Data Agent',           domains: ['finance'] },
  { name: 'Technical Analysis',          domains: ['finance'] },
  { name: 'Fundamental Analysis',        domains: ['finance'] },
  { name: 'Sentiment Analyzer',          domains: ['finance', 'marketing', 'sales'] },
  { name: 'Risk Assessor',               domains: ['finance', 'security'] },
  { name: 'Portfolio Optimizer',         domains: ['finance'] },
  { name: 'Compliance Checker',          domains: ['finance', 'security', 'government'] },
  { name: 'Attribution Analyst',         domains: ['finance'] },
  { name: 'Rebalancing Agent',           domains: ['finance'] },
  { name: 'Tax Optimizer',               domains: ['finance'] },
  { name: 'Forecast Model',              domains: ['finance', 'economy'] },
  { name: 'Stress Testing',              domains: ['finance', 'security'] },
  { name: 'Client Report Generator',     domains: ['finance'] },
  { name: 'ESG Scorer',                  domains: ['finance', 'esg'] },
  { name: 'Alpha Signal Engine',         domains: ['finance'] },
  // Sales
  { name: 'Lead Scorer',                 domains: ['sales'] },
  { name: 'Opportunity Analyzer',        domains: ['sales'] },
  { name: 'Sales Forecaster',            domains: ['sales'] },
  { name: 'Win/Loss Analyst',            domains: ['sales'] },
  { name: 'Pricing Optimizer',           domains: ['sales', 'retail'] },
  { name: 'Pipeline Inspector',          domains: ['sales'] },
  { name: 'Customer Segmentation',       domains: ['sales', 'marketing'] },
  { name: 'Churn Predictor',             domains: ['sales', 'hr'] },
  { name: 'Upsell Recommender',          domains: ['sales', 'retail'] },
  { name: 'Territory Planner',           domains: ['sales'] },
  { name: 'Deal Intelligence Agent',     domains: ['sales'] },
  // Healthcare
  { name: 'Clinical Decision Support',   domains: ['healthcare'] },
  { name: 'Diagnosis Suggester',         domains: ['healthcare'] },
  { name: 'Patient Risk Scorer',         domains: ['healthcare'] },
  { name: 'Treatment Planner',           domains: ['healthcare'] },
  { name: 'Drug Interaction Checker',    domains: ['healthcare'] },
  { name: 'Claim Validator',             domains: ['healthcare', 'finance'] },
  { name: 'Outcome Predictor',           domains: ['healthcare'] },
  { name: 'Readmission Risk Agent',      domains: ['healthcare'] },
  { name: 'Clinical Trial Analyst',      domains: ['healthcare'] },
  { name: 'Triage Prioritizer',          domains: ['healthcare'] },
  // Marketing
  { name: 'Campaign Optimizer',          domains: ['marketing'] },
  { name: 'Audience Segmenter',          domains: ['marketing', 'sales'] },
  { name: 'Attribution Modeler',         domains: ['marketing'] },
  { name: 'Content Recommender',         domains: ['marketing', 'media'] },
  { name: 'A/B Test Analyzer',           domains: ['marketing', 'technology'] },
  { name: 'SEO Auditor',                 domains: ['marketing'] },
  { name: 'Ad Bid Optimizer',            domains: ['marketing'] },
  { name: 'Demand Generator',            domains: ['marketing', 'sales'] },
  // Technology
  { name: 'Code Reviewer',               domains: ['technology'] },
  { name: 'Security Scanner',            domains: ['technology', 'security'] },
  { name: 'Performance Monitor',         domains: ['technology'] },
  { name: 'Dependency Auditor',          domains: ['technology'] },
  { name: 'Incident Responder',          domains: ['technology', 'security'] },
  { name: 'Log Analyzer',               domains: ['technology'] },
  { name: 'Deployment Validator',        domains: ['technology'] },
  { name: 'Capacity Planner',           domains: ['technology'] },
  { name: 'Bug Triager',                domains: ['technology'] },
  { name: 'API Gateway Monitor',         domains: ['technology'] },
  // HR
  { name: 'Talent Matcher',             domains: ['hr'] },
  { name: 'Attrition Predictor',        domains: ['hr'] },
  { name: 'Compensation Analyzer',      domains: ['hr'] },
  { name: 'Skill Gap Identifier',       domains: ['hr'] },
  { name: 'Onboarding Planner',         domains: ['hr'] },
  { name: 'Workforce Planner',          domains: ['hr', 'manufacturing'] },
  { name: 'Engagement Tracker',         domains: ['hr'] },
  { name: 'DEI Analyst',               domains: ['hr', 'government'] },
  // Manufacturing / Logistics
  { name: 'Quality Inspector',          domains: ['manufacturing'] },
  { name: 'Predictive Maintenance',     domains: ['manufacturing'] },
  { name: 'Demand Forecaster',          domains: ['manufacturing', 'retail', 'logistics'] },
  { name: 'Supply Chain Optimizer',     domains: ['manufacturing', 'logistics'] },
  { name: 'Energy Efficiency Analyzer', domains: ['manufacturing', 'esg'] },
  { name: 'Defect Detector',            domains: ['manufacturing'] },
  { name: 'Route Optimizer',            domains: ['logistics'] },
  { name: 'Fleet Monitor',              domains: ['logistics'] },
  { name: 'Inventory Reorder Agent',    domains: ['manufacturing', 'retail', 'logistics'] },
  // Economy
  { name: 'GDP Tracker',               domains: ['economy'] },
  { name: 'Trade Flow Analyzer',        domains: ['economy'] },
  { name: 'Inflation Monitor',          domains: ['economy', 'finance'] },
  { name: 'FX Risk Assessor',          domains: ['economy', 'finance'] },
  { name: 'Geopolitical Risk Scorer',   domains: ['economy'] },
  { name: 'Monetary Policy Tracker',    domains: ['economy'] },
  // ESG
  { name: 'Carbon Footprint Tracker',   domains: ['esg'] },
  { name: 'ESG Score Aggregator',      domains: ['esg', 'finance'] },
  { name: 'Climate Risk Modeler',       domains: ['esg'] },
  { name: 'Sustainability Reporter',    domains: ['esg'] },
  // Security
  { name: 'Fraud Detector',            domains: ['security', 'finance'] },
  { name: 'Threat Intelligence',        domains: ['security'] },
  { name: 'Access Anomaly Detector',    domains: ['security'] },
  { name: 'Audit Trail Analyzer',       domains: ['security', 'government'] },
  { name: 'Identity Verifier',          domains: ['security'] },
  // Retail / Media / Education
  { name: 'Product Recommender',        domains: ['retail', 'media'] },
  { name: 'Customer Lifetime Value',    domains: ['retail', 'sales'] },
  { name: 'Content Curator',            domains: ['media', 'education'] },
  { name: 'Student Progress Tracker',   domains: ['education'] },
  { name: 'Learning Path Optimizer',    domains: ['education'] },
  { name: 'Engagement Scorer',          domains: ['media', 'education'] },
  // Real Estate
  { name: 'Property Valuator',          domains: ['realestate'] },
  { name: 'Lease Risk Analyzer',        domains: ['realestate'] },
  { name: 'Market Trend Tracker',       domains: ['realestate', 'economy'] },
  // Government
  { name: 'Policy Impact Analyzer',     domains: ['government'] },
  { name: 'Regulatory Change Monitor',  domains: ['government', 'security'] },
  { name: 'Public Spend Auditor',       domains: ['government'] },
  // General (always available, lowest priority)
  { name: 'Data Ingestion',            domains: [] },
  { name: 'Validator',                  domains: [] },
  { name: 'Transformer',                domains: [] },
  { name: 'Enricher',                   domains: [] },
  { name: 'Aggregator',                 domains: [] },
  { name: 'Reporter',                   domains: [] },
  { name: 'Orchestrator',               domains: [] },
  { name: 'Anomaly Detector',           domains: [] },
  { name: 'Data Quality Agent',         domains: [] },
  { name: 'Scheduler',                  domains: [] },
  { name: 'Notifier',                   domains: [] },
  { name: 'Summarizer',                 domains: [] },
]

// ── Scoring engine ────────────────────────────────────────────────────────────

function detectDomains(text: string): Set<string> {
  const found = new Set<string>()
  for (const [domain, pattern] of Object.entries(DOMAIN_PATTERNS)) {
    if (pattern.test(text)) found.add(domain)
  }
  return found
}

function scoredItems(
  catalog: CatalogItem[],
  contextText: string,
  existing: string[],
): string[] {
  const active = detectDomains(contextText)
  const existingSet = new Set(existing)

  return catalog
    .filter(item => !existingSet.has(item.name))
    .map(item => ({
      name: item.name,
      score: item.domains.length === 0
        ? 0                                              // general: base priority
        : item.domains.reduce((s, d) => s + (active.has(d) ? 2 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .map(x => x.name)
}

export function getDatasetSuggestions(contextText: string, existing: string[] = []): string[] {
  return scoredItems(DATASET_CATALOG, contextText, existing)
}

export function getAgentSuggestions(contextText: string, existing: string[] = []): string[] {
  return scoredItems(AGENT_CATALOG, contextText, existing)
}
