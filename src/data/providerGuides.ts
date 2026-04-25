export interface GuideStep {
  title: string
  body: string
  code?: string       // inline terminal / value to display
  warn?: string       // amber warning callout
  tip?: string        // green tip callout
}

export interface GuideSection {
  heading: string
  steps: GuideStep[]
}

export interface ProviderGuide {
  id: string
  label: string
  color: string
  tagline: string
  keyHint: string        // what a valid key looks like
  docsUrl: string
  consoleUrl: string
  consoleLabel: string
  sections: GuideSection[]
}

export const PROVIDER_GUIDES: ProviderGuide[] = [
  // ── Anthropic ──────────────────────────────────────────────────────────────
  {
    id: 'anthropic',
    label: 'Anthropic',
    color: '#FF8C61',
    tagline: 'Claude Opus 4.7 · Claude Sonnet 4.6',
    keyHint: 'sk-ant-api03-…',
    docsUrl: 'https://docs.anthropic.com/en/api/getting-started',
    consoleUrl: 'https://console.anthropic.com',
    consoleLabel: 'Anthropic Console',
    sections: [
      {
        heading: 'Create an Account',
        steps: [
          {
            title: 'Go to the Anthropic Console',
            body: 'Open console.anthropic.com in your browser. Click "Sign Up" if you\'re new, or "Log In" to an existing account.',
          },
          {
            title: 'Verify your email',
            body: 'Anthropic sends a verification link to your email. Click it to activate your account before you can access the API.',
          },
          {
            title: 'Complete phone verification',
            body: 'For security, Anthropic requires a phone number. Enter it and confirm the SMS code.',
          },
        ],
      },
      {
        heading: 'Add Billing',
        steps: [
          {
            title: 'Open Settings → Billing',
            body: 'In the Console, click your account name (top-right) → Settings → Billing & Usage.',
            tip: 'New accounts get a small free credit to try the API. You need to add a payment method before the credit runs out.',
          },
          {
            title: 'Add a payment method',
            body: 'Click "Add payment method" and enter a credit or debit card. Anthropic charges per usage (no monthly subscription for the API).',
          },
          {
            title: 'Set a spend limit (optional)',
            body: 'Under "Usage Limits" you can cap monthly spend. Recommended for development to prevent surprise charges.',
          },
        ],
      },
      {
        heading: 'Create an API Key',
        steps: [
          {
            title: 'Go to API Keys',
            body: 'In the Console left sidebar, click "API Keys".',
          },
          {
            title: 'Create a new key',
            body: 'Click "+ Create Key". Give it a descriptive name like "aethon-local-dev" so you can identify it later.',
          },
          {
            title: 'Copy the key immediately',
            body: 'The key is shown only once. Copy it now — you cannot view it again after closing the dialog.',
            code: 'sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            warn: 'Never commit this key to git or share it publicly. Anyone with the key can use your API quota.',
          },
          {
            title: 'Paste it into Aethon',
            body: 'Paste the key into the Anthropic field in the API Keys section above, then click Save Configuration.',
          },
        ],
      },
    ],
  },

  // ── Google AI ──────────────────────────────────────────────────────────────
  {
    id: 'google',
    label: 'Google AI',
    color: '#4285F4',
    tagline: 'Gemini 2.5 Pro · Gemini 2.5 Flash',
    keyHint: 'AIzaSy…',
    docsUrl: 'https://ai.google.dev/gemini-api/docs',
    consoleUrl: 'https://aistudio.google.com',
    consoleLabel: 'Google AI Studio',
    sections: [
      {
        heading: 'Get an API Key (AI Studio — fastest)',
        steps: [
          {
            title: 'Open Google AI Studio',
            body: 'Go to aistudio.google.com and sign in with your Google account. No additional sign-up is needed.',
            tip: 'AI Studio has a generous free tier: 15 requests/minute and 1M tokens/day for Gemini 2.5 Flash — enough for development.',
          },
          {
            title: 'Click "Get API key"',
            body: 'In the top-left corner of AI Studio, click "Get API key" → "Create API key".',
          },
          {
            title: 'Select or create a project',
            body: 'Choose an existing Google Cloud project or let AI Studio create one automatically. The key is scoped to this project.',
          },
          {
            title: 'Copy the key',
            body: 'The key appears immediately. Copy it — it starts with "AIzaSy".',
            code: 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
          },
          {
            title: 'Paste it into Aethon',
            body: 'Paste the key into the Google AI field in the API Keys section, then click Save Configuration.',
          },
        ],
      },
      {
        heading: 'Enable Billing for Higher Limits',
        steps: [
          {
            title: 'Connect a billing account',
            body: 'Go to console.cloud.google.com → select your project → Billing → Link a billing account. This unlocks Tier 2 rate limits.',
            tip: 'Gemini 2.5 Flash on the free tier (15 RPM) is sufficient for Aethon demos. Billing is only needed for production scale.',
          },
          {
            title: 'Check current quotas',
            body: 'In Google Cloud Console → APIs & Services → Quotas, search for "Generative Language API" to see your current limits and request increases.',
          },
        ],
      },
      {
        heading: 'Model Reference',
        steps: [
          {
            title: 'Gemini 2.5 Flash',
            body: 'Fast, cost-efficient, great for most Aethon queries. Recommended for development and demos.',
            code: 'gemini-2.5-flash',
            tip: 'Free tier supports this model at 15 requests/min.',
          },
          {
            title: 'Gemini 2.5 Pro',
            body: 'Most capable Gemini model. Uses extended thinking for complex reasoning. Requires more tokens (set 8192+ in Aethon).',
            code: 'gemini-2.5-pro',
            warn: 'Gemini 2.5 Pro is a thinking model — it consumes extra tokens for its reasoning trace. Aethon automatically allocates 8192 tokens for Pro queries.',
          },
        ],
      },
    ],
  },

  // ── OpenAI ─────────────────────────────────────────────────────────────────
  {
    id: 'openai',
    label: 'OpenAI',
    color: '#74AA9C',
    tagline: 'GPT-4o',
    keyHint: 'sk-proj-…',
    docsUrl: 'https://platform.openai.com/docs/quickstart',
    consoleUrl: 'https://platform.openai.com',
    consoleLabel: 'OpenAI Platform',
    sections: [
      {
        heading: 'Create an Account',
        steps: [
          {
            title: 'Go to OpenAI Platform',
            body: 'Visit platform.openai.com and click "Sign Up". You can sign up with email, Google, Microsoft, or Apple.',
            warn: 'A ChatGPT subscription does NOT include API access. The API is billed separately through the Platform.',
          },
          {
            title: 'Verify email and phone',
            body: 'Confirm your email address, then provide a phone number for identity verification.',
          },
        ],
      },
      {
        heading: 'Add Credits',
        steps: [
          {
            title: 'Open Billing settings',
            body: 'In the Platform, click your account (top-right) → Settings → Billing → Payment methods.',
          },
          {
            title: 'Add a payment method',
            body: 'Click "Add payment method" and enter a credit or debit card. OpenAI uses a prepaid credit system — you top up, then spend from the balance.',
          },
          {
            title: 'Buy credits',
            body: 'Click "Add to credit balance". The minimum purchase is $5. Credits don\'t expire.',
            tip: '$5–10 of credits is more than enough to run Aethon queries for weeks in development.',
          },
          {
            title: 'Set a usage limit',
            body: 'Under "Usage limits" → set a hard monthly cap (e.g. $10) to prevent unexpected charges.',
          },
        ],
      },
      {
        heading: 'Create an API Key',
        steps: [
          {
            title: 'Go to API Keys',
            body: 'In the Platform left sidebar, click "API Keys" (or go to platform.openai.com/api-keys).',
          },
          {
            title: 'Create a new key',
            body: 'Click "+ Create new secret key". Give it a name like "aethon-app". Optionally scope it to a specific project.',
          },
          {
            title: 'Copy the key',
            body: 'The secret key is shown only once. Copy it now.',
            code: 'sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            warn: 'After closing the dialog you cannot retrieve the key again — you\'d have to create a new one.',
          },
          {
            title: 'Paste it into Aethon',
            body: 'Paste the key into the OpenAI field in the API Keys section above, then click Save Configuration.',
          },
        ],
      },
    ],
  },

  // ── Ollama (Local) ─────────────────────────────────────────────────────────
  {
    id: 'ollama',
    label: 'Local (Ollama)',
    color: '#8B5CF6',
    tagline: 'DeepSeek R1 · Llama 3.3 · Gemma 3 · Mistral · Phi-4',
    keyHint: 'http://localhost:11434',
    docsUrl: 'https://github.com/ollama/ollama',
    consoleUrl: 'https://ollama.com/download',
    consoleLabel: 'Download Ollama',
    sections: [
      {
        heading: 'Install Ollama',
        steps: [
          {
            title: 'Download for your platform',
            body: 'Visit ollama.com/download and download the installer for your operating system.',
          },
          {
            title: 'macOS',
            body: 'Open the downloaded .dmg, drag Ollama to Applications, and launch it. The Ollama icon appears in the menu bar. The server starts automatically at http://localhost:11434.',
            tip: 'On Apple Silicon (M1/M2/M3), Ollama runs models using the unified memory and Metal GPU — much faster than CPU-only.',
          },
          {
            title: 'Windows',
            body: 'Run OllamaSetup.exe. Ollama installs as a background service that starts automatically with Windows.',
            code: 'winget install Ollama.Ollama',
          },
          {
            title: 'Linux',
            body: 'Run the one-line installer in your terminal:',
            code: 'curl -fsSL https://ollama.com/install.sh | sh',
          },
          {
            title: 'Verify the installation',
            body: 'Open a terminal and confirm Ollama is running:',
            code: 'ollama --version\ncurl http://localhost:11434/api/version',
          },
        ],
      },
      {
        heading: 'Start the Server',
        steps: [
          {
            title: 'macOS / Windows',
            body: 'The server starts automatically when Ollama is installed. Check for the Ollama icon in the menu bar (macOS) or system tray (Windows).',
          },
          {
            title: 'Linux / manual start',
            body: 'If the server is not running, start it with:',
            code: 'ollama serve',
          },
          {
            title: 'Run on a different machine',
            body: 'To expose Ollama to other hosts (e.g., running on a server), set the host before starting:',
            code: 'OLLAMA_HOST=0.0.0.0 ollama serve',
            warn: 'Exposing Ollama to 0.0.0.0 without a firewall makes it accessible to your entire network. Restrict with a VPN or firewall rule.',
          },
          {
            title: 'Set the Ollama URL in Aethon',
            body: 'If Ollama runs on a remote machine, update the "Ollama URL" field in the API Keys section to point to that server:',
            code: 'http://192.168.1.50:11434',
          },
        ],
      },
      {
        heading: 'Pull Models',
        steps: [
          {
            title: 'System requirements',
            body: 'Each model needs enough RAM to fit in memory. Rough guidelines:',
            tip: '7B models → 8 GB RAM minimum\n13B models → 16 GB RAM\n27B models → 32 GB RAM\n70B models → 64 GB RAM (or quantized ~40 GB)',
          },
          {
            title: 'DeepSeek R1 7B (recommended starter)',
            body: 'A powerful reasoning model. Fast on consumer hardware.',
            code: 'ollama pull deepseek-r1:7b',
          },
          {
            title: 'Llama 3.3 70B',
            body: 'Meta\'s strongest open model. Requires ~40 GB of memory.',
            code: 'ollama pull llama3.3:70b',
            warn: 'The 70B model download is ~40 GB. Ensure you have disk space and a stable connection.',
          },
          {
            title: 'Gemma 3 27B',
            body: 'Google\'s efficient model, great quality-to-size ratio.',
            code: 'ollama pull gemma3:27b',
          },
          {
            title: 'Mistral NeMo 12B',
            body: 'NVIDIA & Mistral collaboration. Strong at code and reasoning.',
            code: 'ollama pull mistral-nemo:12b',
          },
          {
            title: 'Phi-4 14B',
            body: 'Microsoft\'s small but capable reasoning model.',
            code: 'ollama pull phi4:14b',
          },
          {
            title: 'List and test downloaded models',
            body: 'After pulling, verify the models are available and test one:',
            code: 'ollama list\nollama run deepseek-r1:7b "Explain ETL pipelines briefly"',
          },
        ],
      },
    ],
  },
]
