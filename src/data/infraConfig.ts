export interface InfraField {
  key: string
  label: string
  placeholder: string
  type: 'text' | 'password' | 'number' | 'select' | 'textarea'
  options?: string[]
  section: string
  hint?: string
}

export interface SectionGuide {
  overview: string
  steps: string[]
  links: Array<{ label: string; url: string }>
}

export interface InfraServiceDef {
  name: string
  color: string
  category: 'Vector Store' | 'Data Warehouse' | 'Stream Processor' | 'File Source'
  docsUrl: string
  fields: InfraField[]
  guide: Record<string, SectionGuide>
}

export const INFRA_DEFS: Record<string, InfraServiceDef> = {

  // ── Vector Stores ───────────────────────────────────────────────────────────

  Pinecone: {
    name: 'Pinecone', color: '#00CCBB', category: 'Vector Store',
    docsUrl: 'https://docs.pinecone.io',
    fields: [
      { key: 'apiKey',      label: 'API Key',     placeholder: 'pcsk_…',            type: 'password', section: 'Authentication', hint: 'app.pinecone.io → API Keys → Create API Key' },
      { key: 'environment', label: 'Environment', placeholder: 'us-east-1-aws',     type: 'text',     section: 'Connection',     hint: 'Shown on your index detail page (e.g. us-east-1-aws)' },
      { key: 'indexName',   label: 'Index Name',  placeholder: 'fabric-embeddings', type: 'text',     section: 'Index',          hint: 'Create via Indexes → Create Index in the console' },
      { key: 'dimensions',  label: 'Dimensions',  placeholder: '1536',              type: 'number',   section: 'Index',          hint: 'Must match your embedding model (OpenAI ada-002 = 1536)' },
      { key: 'metric',      label: 'Metric',      placeholder: '',  type: 'select', options: ['cosine','euclidean','dotproduct'], section: 'Index', hint: 'cosine recommended for text embeddings' },
      { key: 'podType',     label: 'Pod Type',    placeholder: '',  type: 'select', options: ['starter','p1.x1','p1.x2','p2.x1','s1.x1'], section: 'Index', hint: 'starter = free tier; p1/p2 = production' },
    ],
    guide: {
      Authentication: {
        overview: 'Pinecone API keys authenticate all SDK and REST calls. Each key is scoped to your project.',
        steps: [
          'Go to app.pinecone.io and sign in (or create a free account).',
          'Select your project from the left sidebar.',
          'Click "API Keys" in the left menu.',
          'Click "Create API Key", give it a name like "fabric-prod", then copy the key immediately — it won\'t be shown again.',
          'Paste the key into the field on the left.',
        ],
        links: [
          { label: 'Pinecone Console', url: 'https://app.pinecone.io' },
          { label: 'API Key docs', url: 'https://docs.pinecone.io/guides/projects/understanding-projects#api-keys' },
        ],
      },
      Connection: {
        overview: 'The environment identifies which cloud region hosts your Pinecone project.',
        steps: [
          'In the Pinecone console, open your project.',
          'Click on any index — the environment string (e.g. us-east-1-aws) appears in the index details panel.',
          'Alternatively, find it in the project settings under "Environment".',
          'Use the exact string including the cloud suffix (e.g. gcp-starter for free tier).',
        ],
        links: [
          { label: 'Environments reference', url: 'https://docs.pinecone.io/reference/api/introduction#regions' },
        ],
      },
      Index: {
        overview: 'An index stores your vector embeddings. Dimensions and metric must be set at creation and cannot be changed.',
        steps: [
          'In the console, click "Indexes" → "Create Index".',
          'Set the name, then choose dimensions to match your embedding model: OpenAI text-embedding-3-small → 1536, text-embedding-3-large → 3072, Cohere embed-v3 → 1024.',
          'Choose metric: cosine works best for semantic similarity; dotproduct for normalized vectors.',
          'Select pod type: starter is free (1 pod, shared); p1/p2 for production workloads.',
          'Click "Create Index" and wait ~30 seconds for it to initialize.',
        ],
        links: [
          { label: 'Create an index', url: 'https://docs.pinecone.io/guides/indexes/create-an-index' },
          { label: 'Choosing metrics', url: 'https://docs.pinecone.io/guides/indexes/understanding-indexes#distance-metrics' },
        ],
      },
    },
  },

  Weaviate: {
    name: 'Weaviate', color: '#3CC13B', category: 'Vector Store',
    docsUrl: 'https://weaviate.io/developers/weaviate',
    fields: [
      { key: 'url',       label: 'Cluster URL', placeholder: 'https://xxx.weaviate.network', type: 'text',     section: 'Connection',    hint: 'console.weaviate.cloud → your cluster → Connect tab' },
      { key: 'apiKey',    label: 'API Key',     placeholder: 'wcs_…',                        type: 'password', section: 'Authentication', hint: 'Cluster → API Keys → Create Key' },
      { key: 'className', label: 'Class Name',  placeholder: 'FabricDocument',               type: 'text',     section: 'Schema',        hint: 'PascalCase; auto-created on first upsert if absent' },
      { key: 'vectorizer',label: 'Vectorizer',  placeholder: '', type: 'select', options: ['text2vec-openai','text2vec-cohere','text2vec-huggingface','none'], section: 'Schema', hint: 'none = bring your own vectors' },
    ],
    guide: {
      Connection: {
        overview: 'Weaviate Cloud Services (WCS) hosts managed clusters. The URL is unique to your cluster.',
        steps: [
          'Sign in at console.weaviate.cloud.',
          'Create a cluster (Sandbox tier is free for 14 days).',
          'Once the cluster is "Running", click on it and open the "Connect" tab.',
          'Copy the "REST Endpoint" URL — it looks like https://my-cluster.weaviate.network.',
        ],
        links: [
          { label: 'Weaviate Cloud Console', url: 'https://console.weaviate.cloud' },
          { label: 'Quickstart', url: 'https://weaviate.io/developers/weaviate/quickstart' },
        ],
      },
      Authentication: {
        overview: 'WCS clusters are protected by API keys. Each key can be read-only or read-write.',
        steps: [
          'In the WCS console, open your cluster.',
          'Go to the "API Keys" tab.',
          'Click "Create API Key", choose "Read & Write" for Fabric.',
          'Copy the key — it starts with "wcs_" — and paste it here.',
          'For self-hosted Weaviate with OIDC, use the token from your identity provider instead.',
        ],
        links: [
          { label: 'API key authentication', url: 'https://weaviate.io/developers/weaviate/configuration/authentication#api-key' },
        ],
      },
      Schema: {
        overview: 'A class in Weaviate is equivalent to a collection. It defines the shape and vectorizer for your objects.',
        steps: [
          'Choose a PascalCase class name (e.g. FabricDocument). Weaviate will create it automatically on first write if auto-schema is enabled.',
          'Select a vectorizer that matches your data pipeline: text2vec-openai uses OpenAI to auto-embed text; text2vec-cohere uses Cohere; none means you supply pre-computed vectors.',
          'If using text2vec-openai, add your OpenAI API key to Weaviate\'s module config (WCS → Cluster → Modules tab).',
          'Optionally define your schema explicitly via the REST API or Weaviate client to control property types.',
        ],
        links: [
          { label: 'Schema configuration', url: 'https://weaviate.io/developers/weaviate/manage-data/collections' },
          { label: 'Module configuration', url: 'https://weaviate.io/developers/weaviate/modules/text2vec-openai' },
        ],
      },
    },
  },

  Qdrant: {
    name: 'Qdrant', color: '#DC2626', category: 'Vector Store',
    docsUrl: 'https://qdrant.tech/documentation/',
    fields: [
      { key: 'url',            label: 'URL',             placeholder: 'https://xxx.qdrant.io:6333', type: 'text',     section: 'Connection',    hint: 'cloud.qdrant.io → Cluster → Connection string' },
      { key: 'apiKey',         label: 'API Key',         placeholder: 'qdrant_…',                   type: 'password', section: 'Authentication', hint: 'Cluster → Security → API Keys → Generate' },
      { key: 'collectionName', label: 'Collection Name', placeholder: 'fabric_vectors',             type: 'text',     section: 'Collection',    hint: 'Auto-created; use lowercase_snake_case' },
      { key: 'vectorSize',     label: 'Vector Size',     placeholder: '1536',                       type: 'number',   section: 'Collection',    hint: 'Must equal the output dimension of your embedder' },
      { key: 'distance',       label: 'Distance',        placeholder: '', type: 'select', options: ['Cosine','Euclid','Dot','Manhattan'], section: 'Collection', hint: 'Cosine is standard for text; Dot for normalized vectors' },
    ],
    guide: {
      Connection: {
        overview: 'Qdrant Cloud provides fully-managed clusters. Self-hosting via Docker is also common.',
        steps: [
          'Sign up at cloud.qdrant.io (free 1GB cluster available).',
          'Create a cluster, select a region, and wait for it to provision.',
          'Click on the cluster → "Connect" tab.',
          'Copy the REST endpoint URL (port 6333). It looks like https://xyz.qdrant.io:6333.',
          'For self-hosted: run docker run -p 6333:6333 qdrant/qdrant and use http://localhost:6333.',
        ],
        links: [
          { label: 'Qdrant Cloud', url: 'https://cloud.qdrant.io' },
          { label: 'Quick start', url: 'https://qdrant.tech/documentation/quick-start/' },
        ],
      },
      Authentication: {
        overview: 'API keys control access to your Qdrant cluster. Cloud clusters require a key; local instances are open by default.',
        steps: [
          'In the Qdrant Cloud console, click your cluster.',
          'Go to "Security" → "API Keys".',
          'Click "Generate API Key", give it a description, and copy the key immediately.',
          'For self-hosted Qdrant with auth enabled, set QDRANT__SERVICE__API_KEY in the server config, then use that value here.',
        ],
        links: [
          { label: 'Authentication docs', url: 'https://qdrant.tech/documentation/guides/security/' },
        ],
      },
      Collection: {
        overview: 'A collection holds your vectors. Size and distance metric are fixed at creation and define search behavior.',
        steps: [
          'Choose a collection name using lowercase_snake_case (e.g. fabric_vectors).',
          'Set Vector Size to match your embedding model output: OpenAI text-embedding-3-small = 1536; all-MiniLM = 384; Cohere embed-v3 = 1024.',
          'Select Distance metric: Cosine is standard for text similarity; Euclid for spatial data; Dot for inner-product search on normalized vectors.',
          'The collection is created automatically on first insert, or you can pre-create it via the Qdrant dashboard or REST API.',
        ],
        links: [
          { label: 'Collections', url: 'https://qdrant.tech/documentation/concepts/collections/' },
          { label: 'Embedding dimensions', url: 'https://qdrant.tech/documentation/guides/common-errors/#vector-dimension-mismatch' },
        ],
      },
    },
  },

  Chroma: {
    name: 'Chroma', color: '#F97316', category: 'Vector Store',
    docsUrl: 'https://docs.trychroma.com',
    fields: [
      { key: 'host',              label: 'Host',               placeholder: 'localhost',   type: 'text',   section: 'Connection', hint: 'IP or hostname where ChromaDB server is running' },
      { key: 'port',              label: 'Port',               placeholder: '8000',        type: 'number', section: 'Connection', hint: 'Default is 8000; change if you mapped a different port' },
      { key: 'collectionName',    label: 'Collection Name',    placeholder: 'fabric_docs', type: 'text',   section: 'Collection', hint: 'Created automatically when you first add documents' },
      { key: 'embeddingFunction', label: 'Embedding Function', placeholder: '', type: 'select', options: ['openai','cohere','huggingface','default'], section: 'Collection', hint: 'default = built-in all-MiniLM-L6-v2 (no extra key needed)' },
    ],
    guide: {
      Connection: {
        overview: 'Chroma runs as a local or self-hosted server. It\'s the easiest vector store to spin up for development.',
        steps: [
          'Install Chroma: pip install chromadb',
          'Start the server: chroma run --host 0.0.0.0 --port 8000',
          'Or with Docker: docker run -p 8000:8000 chromadb/chroma',
          'Use "localhost" as the host and 8000 as the port for a local setup.',
          'For a remote server, replace localhost with the server\'s IP or hostname.',
          'Chroma Cloud (hosted) is in preview — check docs.trychroma.com for current status.',
        ],
        links: [
          { label: 'Chroma docs', url: 'https://docs.trychroma.com/getting-started' },
          { label: 'Docker image', url: 'https://hub.docker.com/r/chromadb/chroma' },
        ],
      },
      Collection: {
        overview: 'Collections are namespaces for your documents. The embedding function determines how text is vectorized.',
        steps: [
          'Pick any name for your collection (e.g. fabric_docs). It\'s created on first add().',
          'Choose an embedding function: "default" uses the built-in all-MiniLM-L6-v2 model (runs locally, no API key needed, 384 dimensions).',
          '"openai" uses OpenAI\'s text-embedding-ada-002 — requires OPENAI_API_KEY in the server\'s environment.',
          '"cohere" uses Cohere\'s embed model — requires COHERE_API_KEY in the server\'s environment.',
          '"huggingface" uses a sentence-transformers model specified by name.',
        ],
        links: [
          { label: 'Embedding functions', url: 'https://docs.trychroma.com/guides/embeddings' },
          { label: 'Collections', url: 'https://docs.trychroma.com/guides/collections' },
        ],
      },
    },
  },

  pgvector: {
    name: 'pgvector', color: '#336791', category: 'Vector Store',
    docsUrl: 'https://github.com/pgvector/pgvector',
    fields: [
      { key: 'connectionString', label: 'Connection String', placeholder: 'postgresql://user:pass@host:5432/db', type: 'password', section: 'Connection', hint: 'Full postgres:// URI including credentials and database name' },
      { key: 'tableName',        label: 'Table Name',        placeholder: 'embeddings',   type: 'text',   section: 'Schema', hint: 'Table will be created if it doesn\'t exist' },
      { key: 'dimensions',       label: 'Dimensions',        placeholder: '1536',         type: 'number', section: 'Schema', hint: 'Must match your embedding model\'s output size' },
      { key: 'indexType',        label: 'Index Type',        placeholder: '', type: 'select', options: ['hnsw','ivfflat'], section: 'Schema', hint: 'hnsw = fast queries; ivfflat = lower memory' },
    ],
    guide: {
      Connection: {
        overview: 'pgvector extends PostgreSQL with a vector column type, letting you store and query embeddings in your existing Postgres database.',
        steps: [
          'Enable the extension on your Postgres instance: run CREATE EXTENSION IF NOT EXISTS vector; in psql or your DB client.',
          'Supported providers: Supabase (has pgvector built-in), Neon, AWS RDS (PostgreSQL 15+), Azure Database for PostgreSQL, self-hosted Postgres 11+.',
          'For Supabase: Project Settings → Database → Connection string (use the "URI" tab).',
          'For Neon: Dashboard → your project → Connection Details → Connection string.',
          'For self-hosted: format is postgresql://username:password@hostname:5432/dbname',
          'Test your connection with psql "<your-connection-string>" before pasting here.',
        ],
        links: [
          { label: 'pgvector GitHub', url: 'https://github.com/pgvector/pgvector' },
          { label: 'Supabase vector', url: 'https://supabase.com/docs/guides/ai/vector-columns' },
          { label: 'Neon pgvector', url: 'https://neon.tech/docs/extensions/pgvector' },
        ],
      },
      Schema: {
        overview: 'Fabric will create the embeddings table automatically. The index type affects query speed vs. memory trade-offs.',
        steps: [
          'Choose a table name (e.g. embeddings or fabric_vectors). Fabric creates it as: CREATE TABLE IF NOT EXISTS <name> (id bigserial PRIMARY KEY, content text, embedding vector(<dimensions>), metadata jsonb).',
          'Set Dimensions to match your embedding model — this cannot be changed after the table is created.',
          'Index Type: HNSW (Hierarchical Navigable Small World) offers faster queries and better recall; IVFFlat uses less memory and is faster to build for large datasets.',
          'HNSW is recommended for most use cases with up to a few million vectors.',
          'For IVFFlat on large datasets: run ANALYZE after bulk inserts so Postgres can use the index effectively.',
        ],
        links: [
          { label: 'HNSW indexing', url: 'https://github.com/pgvector/pgvector#hnsw' },
          { label: 'IVFFlat indexing', url: 'https://github.com/pgvector/pgvector#ivfflat' },
        ],
      },
    },
  },

  // ── Data Warehouses ─────────────────────────────────────────────────────────

  Snowflake: {
    name: 'Snowflake', color: '#29B5E8', category: 'Data Warehouse',
    docsUrl: 'https://docs.snowflake.com',
    fields: [
      { key: 'account',   label: 'Account',   placeholder: 'orgname-accountname', type: 'text',     section: 'Connection',     hint: 'Admin → Accounts → Account Identifier (without .snowflakecomputing.com)' },
      { key: 'username',  label: 'Username',  placeholder: 'FABRIC_USER',         type: 'text',     section: 'Authentication', hint: 'Snowflake login name (not email)' },
      { key: 'password',  label: 'Password',  placeholder: '••••••••',            type: 'password', section: 'Authentication', hint: 'Consider using a dedicated service account' },
      { key: 'role',      label: 'Role',      placeholder: 'SYSADMIN',            type: 'text',     section: 'Authentication', hint: 'Role must have USAGE on warehouse and database' },
      { key: 'warehouse', label: 'Warehouse', placeholder: 'FABRIC_WH',          type: 'text',     section: 'Resources',      hint: 'Admin → Warehouses; XSMALL sufficient for most ETL jobs' },
      { key: 'database',  label: 'Database',  placeholder: 'FABRIC_DB',           type: 'text',     section: 'Resources',      hint: 'Data → Databases; create one if it doesn\'t exist' },
      { key: 'schema',    label: 'Schema',    placeholder: 'PUBLIC',              type: 'text',     section: 'Resources',      hint: 'Leave as PUBLIC or create a dedicated schema' },
    ],
    guide: {
      Connection: {
        overview: 'The account identifier uniquely locates your Snowflake account within a cloud region.',
        steps: [
          'Log into app.snowflake.com.',
          'Click your username (bottom-left) → Account → View Account Details.',
          'Copy the "Account Identifier" — it looks like orgname-accountname or xy12345.us-east-1.',
          'Do not include ".snowflakecomputing.com" — just the identifier portion.',
          'If you see a legacy account (e.g. xy12345), it may also appear as xy12345.us-east-1.aws depending on region.',
        ],
        links: [
          { label: 'Account identifiers', url: 'https://docs.snowflake.com/en/user-guide/admin-account-identifier' },
          { label: 'Snowflake login', url: 'https://app.snowflake.com' },
        ],
      },
      Authentication: {
        overview: 'Create a dedicated service account user for Fabric rather than using your personal login.',
        steps: [
          'In Snowflake, open a worksheet and run: CREATE USER fabric_user PASSWORD=\'<strong-password>\' DEFAULT_ROLE=SYSADMIN;',
          'Grant the role: GRANT ROLE SYSADMIN TO USER fabric_user;',
          'For least-privilege: create a custom role and grant only USAGE on the warehouse, database, and schema.',
          'Enter the username (FABRIC_USER) and password you created above.',
          'Role: SYSADMIN works for setup; switch to a restricted role once schema is stable.',
        ],
        links: [
          { label: 'Creating users', url: 'https://docs.snowflake.com/en/sql-reference/sql/create-user' },
          { label: 'Access control', url: 'https://docs.snowflake.com/en/user-guide/security-access-control-overview' },
        ],
      },
      Resources: {
        overview: 'Fabric needs a virtual warehouse (compute), database (storage), and schema to operate.',
        steps: [
          'Create a warehouse: Admin → Warehouses → + Warehouse. Name it FABRIC_WH, size X-Small (sufficient for most ETL).',
          'Create a database: Data → Databases → + Database. Name it FABRIC_DB.',
          'The schema PUBLIC is created automatically. Or create a dedicated one: CREATE SCHEMA FABRIC_DB.ANALYTICS;',
          'Grant access: GRANT USAGE ON WAREHOUSE FABRIC_WH TO ROLE <your_role>; GRANT ALL ON DATABASE FABRIC_DB TO ROLE <your_role>;',
        ],
        links: [
          { label: 'Warehouses', url: 'https://docs.snowflake.com/en/user-guide/warehouses-overview' },
          { label: 'Databases & schemas', url: 'https://docs.snowflake.com/en/sql-reference/sql/create-database' },
        ],
      },
    },
  },

  BigQuery: {
    name: 'BigQuery', color: '#4285F4', category: 'Data Warehouse',
    docsUrl: 'https://cloud.google.com/bigquery/docs',
    fields: [
      { key: 'projectId',         label: 'Project ID',             placeholder: 'my-gcp-project',        type: 'text',     section: 'Project',        hint: 'GCP Console header → project dropdown → Project ID (not name)' },
      { key: 'dataset',           label: 'Dataset',                placeholder: 'fabric_analytics',      type: 'text',     section: 'Project',        hint: 'BigQuery → Explorer → Create Dataset' },
      { key: 'location',          label: 'Location',               placeholder: '', type: 'select', options: ['US','EU','us-central1','us-east1','europe-west1','asia-east1'], section: 'Project', hint: 'Must match the dataset location; US is multi-region' },
      { key: 'serviceAccountKey', label: 'Service Account (JSON)', placeholder: '{"type":"service_account"…}', type: 'textarea', section: 'Authentication', hint: 'IAM → Service Accounts → Keys → Add Key → JSON; paste full JSON here' },
    ],
    guide: {
      Project: {
        overview: 'BigQuery organizes data into projects → datasets → tables. You need an existing GCP project with the BigQuery API enabled.',
        steps: [
          'Go to console.cloud.google.com. Select or create a project from the top dropdown.',
          'Copy the "Project ID" (not the display name) — it looks like my-project-123456.',
          'Enable the BigQuery API: APIs & Services → Library → search "BigQuery API" → Enable.',
          'Create a dataset: go to BigQuery → Explorer panel → click your project → Create Dataset.',
          'Name the dataset (e.g. fabric_analytics), choose a location, and click Create.',
          'Location tip: US (multi-region) is the simplest choice unless you have data residency requirements.',
        ],
        links: [
          { label: 'GCP Console', url: 'https://console.cloud.google.com' },
          { label: 'BigQuery quickstart', url: 'https://cloud.google.com/bigquery/docs/quickstarts/query-public-dataset-console' },
        ],
      },
      Authentication: {
        overview: 'A service account JSON key lets Fabric authenticate to BigQuery without user interaction.',
        steps: [
          'In GCP Console → IAM & Admin → Service Accounts → Create Service Account.',
          'Give it a name like "fabric-bigquery" and click Create.',
          'On the "Grant this service account access" screen, add the role "BigQuery Data Editor" (or "BigQuery Admin" for full access).',
          'Once created, click on the service account → Keys tab → Add Key → Create new key → JSON.',
          'A .json file downloads automatically. Open it and paste the entire JSON content into the field on the left.',
          'Keep this file secure — it grants access to your GCP project.',
        ],
        links: [
          { label: 'Service account keys', url: 'https://cloud.google.com/iam/docs/keys-create-delete' },
          { label: 'BigQuery IAM roles', url: 'https://cloud.google.com/bigquery/docs/access-control' },
        ],
      },
    },
  },

  Redshift: {
    name: 'Redshift', color: '#DD344C', category: 'Data Warehouse',
    docsUrl: 'https://docs.aws.amazon.com/redshift/',
    fields: [
      { key: 'host',     label: 'Host',     placeholder: 'cluster.xxx.region.redshift.amazonaws.com', type: 'text',     section: 'Connection',     hint: 'Redshift Console → Clusters → your cluster → Endpoint (without port)' },
      { key: 'port',     label: 'Port',     placeholder: '5439',   type: 'number', section: 'Connection',     hint: 'Default is 5439; check cluster properties to confirm' },
      { key: 'database', label: 'Database', placeholder: 'fabric_db', type: 'text', section: 'Connection',    hint: 'Set when cluster was created; default is "dev"' },
      { key: 'username', label: 'Username', placeholder: 'admin',  type: 'text',     section: 'Authentication', hint: 'Master user created at cluster launch, or a DB user you created' },
      { key: 'password', label: 'Password', placeholder: '••••••••', type: 'password', section: 'Authentication', hint: 'Use a dedicated service user rather than the master admin' },
      { key: 'schema',   label: 'Schema',   placeholder: 'public', type: 'text',     section: 'Schema',        hint: 'public is the default schema; create a new one for isolation' },
    ],
    guide: {
      Connection: {
        overview: 'Redshift clusters have a JDBC/ODBC endpoint. You need the cluster to be publicly accessible or use a VPC tunnel.',
        steps: [
          'Open the AWS Console → Amazon Redshift → Clusters.',
          'Click on your cluster. Under "General information", copy the Endpoint (looks like cluster-name.xxxx.region.redshift.amazonaws.com:5439).',
          'Split the endpoint into Host (everything before the colon) and Port (number after the colon, usually 5439).',
          'Ensure "Publicly accessible" is enabled in the cluster settings, or configure a VPC peering / SSH tunnel.',
          'If using Redshift Serverless: go to Redshift Serverless → Workgroup → Endpoint.',
        ],
        links: [
          { label: 'Redshift Console', url: 'https://console.aws.amazon.com/redshiftv2' },
          { label: 'Endpoint address', url: 'https://docs.aws.amazon.com/redshift/latest/mgmt/jdbc20-obtain-url.html' },
        ],
      },
      Authentication: {
        overview: 'Use a dedicated database user for Fabric to apply least-privilege access control.',
        steps: [
          'Connect to your cluster via the Redshift Query Editor v2 (in the AWS Console).',
          'Create a user: CREATE USER fabric_user PASSWORD \'<password>\';',
          'Grant permissions: GRANT CONNECT ON DATABASE dev TO fabric_user; GRANT USAGE ON SCHEMA public TO fabric_user; GRANT ALL ON ALL TABLES IN SCHEMA public TO fabric_user;',
          'Enter the username and password you created above.',
          'Avoid using the master admin credentials in production.',
        ],
        links: [
          { label: 'Query Editor v2', url: 'https://console.aws.amazon.com/sqlworkbench' },
          { label: 'User management', url: 'https://docs.aws.amazon.com/redshift/latest/dg/r_Users.html' },
        ],
      },
      Schema: {
        overview: 'Schemas organize tables within a database. Using a dedicated schema keeps Fabric data isolated.',
        steps: [
          '"public" is the default schema and always exists — use it for simplicity.',
          'To create a dedicated schema: CREATE SCHEMA fabric; GRANT ALL ON SCHEMA fabric TO fabric_user;',
          'Set search_path so your user defaults to the right schema: ALTER USER fabric_user SET search_path TO fabric, public;',
        ],
        links: [
          { label: 'Schemas', url: 'https://docs.aws.amazon.com/redshift/latest/dg/r_Schemas_and_tables.html' },
        ],
      },
    },
  },

  Databricks: {
    name: 'Databricks', color: '#FF3621', category: 'Data Warehouse',
    docsUrl: 'https://docs.databricks.com',
    fields: [
      { key: 'host',     label: 'Workspace URL',         placeholder: 'https://adb-xxx.azuredatabricks.net', type: 'text',     section: 'Connection',     hint: 'URL bar when logged into your Databricks workspace' },
      { key: 'token',    label: 'Personal Access Token', placeholder: 'dapi…',                               type: 'password', section: 'Authentication', hint: 'User Settings → Developer → Access Tokens → Generate' },
      { key: 'httpPath', label: 'HTTP Path',             placeholder: '/sql/1.0/warehouses/xxx',             type: 'text',     section: 'Connection',     hint: 'SQL Warehouses → your warehouse → Connection Details' },
      { key: 'catalog',  label: 'Catalog',               placeholder: 'hive_metastore',                     type: 'text',     section: 'Schema',        hint: 'Unity Catalog name; use hive_metastore if not using Unity Catalog' },
      { key: 'schema',   label: 'Schema',                placeholder: 'fabric_analytics',                   type: 'text',     section: 'Schema',        hint: 'Database / schema within the catalog' },
    ],
    guide: {
      Connection: {
        overview: 'Fabric connects to Databricks via the SQL Connector, which targets a SQL Warehouse for fast query execution.',
        steps: [
          'Log into your Databricks workspace. The workspace URL in your browser is what you need (e.g. https://adb-1234567890.azuredatabricks.net).',
          'In the left sidebar, go to SQL → SQL Warehouses.',
          'Select or create a warehouse. Click on it → "Connection Details" tab.',
          'Copy the "HTTP Path" — it looks like /sql/1.0/warehouses/abc123def456.',
          'Paste both the workspace URL and HTTP Path into the fields on the left.',
        ],
        links: [
          { label: 'SQL Warehouses', url: 'https://docs.databricks.com/en/compute/sql-warehouse/index.html' },
          { label: 'Connection details', url: 'https://docs.databricks.com/en/integrations/jdbc-odbc-bi.html' },
        ],
      },
      Authentication: {
        overview: 'Personal Access Tokens (PATs) are the simplest auth method. For production, consider OAuth M2M instead.',
        steps: [
          'In your Databricks workspace, click your username (top-right) → Settings.',
          'Go to "Developer" → "Access Tokens" → "Generate New Token".',
          'Give it a comment like "fabric-etl" and set an expiry (90 days recommended).',
          'Copy the token — it starts with "dapi" — and paste it here.',
          'The token is shown only once. Store it securely.',
          'For service principals: use the OAuth M2M flow with client ID + secret instead.',
        ],
        links: [
          { label: 'Personal access tokens', url: 'https://docs.databricks.com/en/dev-tools/auth/pat.html' },
          { label: 'OAuth M2M', url: 'https://docs.databricks.com/en/dev-tools/auth/oauth-m2m.html' },
        ],
      },
      Schema: {
        overview: 'Databricks uses a three-level namespace: catalog.schema.table. Unity Catalog enables data governance across workspaces.',
        steps: [
          'If using Unity Catalog: the catalog name is visible in Data → Catalogs in the workspace.',
          'If not using Unity Catalog: use "hive_metastore" as the catalog name.',
          'For the schema: create one via Data → your catalog → + Create Schema, or use "default".',
          'Fabric will create its tables in catalog.schema automatically.',
        ],
        links: [
          { label: 'Unity Catalog', url: 'https://docs.databricks.com/en/data-governance/unity-catalog/index.html' },
          { label: 'Namespaces', url: 'https://docs.databricks.com/en/sql/language-manual/sql-ref-names.html' },
        ],
      },
    },
  },

  DuckDB: {
    name: 'DuckDB', color: '#FFC600', category: 'Data Warehouse',
    docsUrl: 'https://duckdb.org/docs/',
    fields: [
      { key: 'databasePath', label: 'Database Path',  placeholder: ':memory: or /path/to/fabric.db', type: 'text',   section: 'Connection',  hint: 'Use :memory: for ephemeral; file path for persistent storage' },
      { key: 'schema',       label: 'Schema',         placeholder: 'main',       type: 'text',   section: 'Schema',      hint: '"main" is the default schema in every DuckDB database' },
      { key: 'threads',      label: 'Threads',        placeholder: '4',          type: 'number', section: 'Performance', hint: 'DuckDB uses all CPU cores by default; reduce to limit resource use' },
      { key: 'memoryLimit',  label: 'Memory Limit',   placeholder: '4GB',        type: 'text',   section: 'Performance', hint: 'e.g. 2GB, 512MB — prevents DuckDB from using all available RAM' },
    ],
    guide: {
      Connection: {
        overview: 'DuckDB is an in-process analytical database — no server required. It\'s the simplest option for local ETL.',
        steps: [
          'No installation needed beyond the DuckDB library (pip install duckdb or the Node.js package).',
          'Use ":memory:" for a temporary in-memory database that\'s wiped on exit — great for testing.',
          'Use a file path like "/data/fabric.db" or "C:\\data\\fabric.db" for persistent storage.',
          'DuckDB can also read directly from Parquet, CSV, and JSON files — no import needed.',
          'For shared access: MotherDuck (motherduck.com) is a managed cloud DuckDB service.',
        ],
        links: [
          { label: 'DuckDB docs', url: 'https://duckdb.org/docs/installation' },
          { label: 'MotherDuck', url: 'https://motherduck.com' },
        ],
      },
      Schema: {
        overview: 'DuckDB schemas organize tables within the database. "main" is always available.',
        steps: [
          '"main" is the default schema — use it unless you need namespace isolation.',
          'To create a custom schema: CREATE SCHEMA analytics; SET search_path = analytics;',
          'DuckDB also supports attaching multiple database files via ATTACH.',
        ],
        links: [
          { label: 'Schemas', url: 'https://duckdb.org/docs/sql/statements/create_schema' },
        ],
      },
      Performance: {
        overview: 'DuckDB is highly optimized out of the box. These settings prevent it from monopolizing system resources.',
        steps: [
          'By default DuckDB uses all available CPU cores. Set Threads to a lower number (e.g. 4) if running alongside other services.',
          'Memory Limit accepts values like "4GB", "512MB". DuckDB spills to disk when this limit is reached.',
          'For ETL workloads on large files, leave both at defaults and let DuckDB self-tune.',
          'Monitor memory usage with: SELECT * FROM duckdb_memory();',
        ],
        links: [
          { label: 'Performance guide', url: 'https://duckdb.org/docs/guides/performance/overview' },
          { label: 'Configuration', url: 'https://duckdb.org/docs/sql/configuration' },
        ],
      },
    },
  },

  // ── Stream Processors ───────────────────────────────────────────────────────

  Kafka: {
    name: 'Apache Kafka', color: '#3D3D3D', category: 'Stream Processor',
    docsUrl: 'https://kafka.apache.org/documentation/',
    fields: [
      { key: 'bootstrapServers', label: 'Bootstrap Servers',  placeholder: 'broker1:9092,broker2:9092', type: 'text',     section: 'Connection', hint: 'Confluent Cloud → Cluster Settings → Bootstrap server' },
      { key: 'topic',            label: 'Topic',              placeholder: 'fabric.events',             type: 'text',     section: 'Messaging',  hint: 'Topics → Create topic, or auto-created on first produce' },
      { key: 'groupId',          label: 'Consumer Group ID',  placeholder: 'fabric-consumer',           type: 'text',     section: 'Messaging',  hint: 'Unique per consumer application; used for offset tracking' },
      { key: 'securityProtocol', label: 'Security Protocol', placeholder: '', type: 'select', options: ['PLAINTEXT','SSL','SASL_PLAINTEXT','SASL_SSL'], section: 'Security', hint: 'SASL_SSL for Confluent Cloud; PLAINTEXT for local dev' },
      { key: 'saslUsername',     label: 'SASL Username',      placeholder: 'kafka-user',                type: 'text',     section: 'Security',   hint: 'Confluent Cloud API key ID, or your Kafka user' },
      { key: 'saslPassword',     label: 'SASL Password',      placeholder: '••••••••',                  type: 'password', section: 'Security',   hint: 'Confluent Cloud API key secret, or your Kafka password' },
    ],
    guide: {
      Connection: {
        overview: 'Bootstrap servers are the initial contact points for your Kafka cluster. You only need 2-3 even in large clusters.',
        steps: [
          'For Confluent Cloud: log into confluent.cloud → select your cluster → Cluster Settings → "Bootstrap server" (looks like pkc-xxx.region.aws.confluent.cloud:9092).',
          'For Amazon MSK: AWS Console → MSK → your cluster → View client information → Bootstrap servers (TLS or Plaintext).',
          'For self-hosted: use the broker hostnames/IPs with port 9092 (or 9093 for TLS), comma-separated.',
          'For local dev: use localhost:9092. Start Kafka with docker run -p 9092:9092 apache/kafka.',
        ],
        links: [
          { label: 'Confluent Cloud', url: 'https://confluent.cloud' },
          { label: 'Kafka quickstart', url: 'https://kafka.apache.org/quickstart' },
        ],
      },
      Messaging: {
        overview: 'Topics are the fundamental unit of organization. The consumer group ID tracks which messages your application has processed.',
        steps: [
          'Create a topic: in Confluent Cloud → Topics → + Add topic. Name it using dot notation (e.g. fabric.events).',
          'Set the partition count based on desired parallelism (start with 6 for production).',
          'Consumer Group ID: choose a unique name for Fabric (e.g. fabric-etl-consumer). Kafka uses this to track your read offset — never share a group ID between different applications.',
          'Retention: set to 7 days (604800000 ms) in the topic configuration for event replay capability.',
        ],
        links: [
          { label: 'Topics & partitions', url: 'https://developer.confluent.io/courses/apache-kafka/topics/' },
          { label: 'Consumer groups', url: 'https://developer.confluent.io/courses/apache-kafka/consumer-group-protocol/' },
        ],
      },
      Security: {
        overview: 'SASL_SSL is the standard for Confluent Cloud and most managed Kafka services. PLAINTEXT is for local development only.',
        steps: [
          'For Confluent Cloud: go to your cluster → API Keys → + Add key → select "Fabric ETL" as the service account → copy the Key and Secret.',
          'Set Security Protocol to SASL_SSL, SASL Username to the API Key ID, SASL Password to the API Key Secret.',
          'For Amazon MSK with IAM auth: use SASL_SSL with MSK IAM library (different flow — consult MSK docs).',
          'For local Kafka without auth: use PLAINTEXT and leave username/password blank.',
          'For self-hosted with SASL: add the user via kafka-configs.sh --add-config SCRAM-SHA-512.',
        ],
        links: [
          { label: 'Confluent Cloud API keys', url: 'https://docs.confluent.io/cloud/current/access-management/authenticate/api-keys/api-keys.html' },
          { label: 'Security overview', url: 'https://kafka.apache.org/documentation/#security' },
        ],
      },
    },
  },

  Pulsar: {
    name: 'Apache Pulsar', color: '#188FFF', category: 'Stream Processor',
    docsUrl: 'https://pulsar.apache.org/docs/',
    fields: [
      { key: 'serviceUrl',       label: 'Service URL',  placeholder: 'pulsar://localhost:6650',            type: 'text',     section: 'Connection',     hint: 'Use pulsar:// for plaintext or pulsar+ssl:// for TLS' },
      { key: 'topic',            label: 'Topic',        placeholder: 'persistent://public/default/fabric', type: 'text',     section: 'Messaging',      hint: 'Full topic path: persistent://<tenant>/<namespace>/<topic>' },
      { key: 'subscriptionName', label: 'Subscription', placeholder: 'fabric-sub',                        type: 'text',     section: 'Messaging',      hint: 'Unique name; determines delivery mode (shared, exclusive, etc.)' },
      { key: 'token',            label: 'Auth Token',   placeholder: 'eyJhbGci…',                         type: 'password', section: 'Authentication', hint: 'JWT from pulsar-admin tokens create, or StreamNative Cloud console' },
    ],
    guide: {
      Connection: {
        overview: 'The service URL is the entry point for all Pulsar client connections. Format varies by deployment.',
        steps: [
          'For self-hosted: start Pulsar with docker run -p 6650:6650 apachepulsar/pulsar standalone. Service URL is pulsar://localhost:6650.',
          'For StreamNative Cloud (managed Pulsar): log into console.streamnative.io → your instance → Connect → Service URL.',
          'For Astra Streaming (DataStax): log into astra.datastax.com → Streaming → your tenant → Connect → Service URL.',
          'For TLS-enabled clusters, use pulsar+ssl:// and ensure the broker\'s certificate is trusted.',
        ],
        links: [
          { label: 'Pulsar standalone', url: 'https://pulsar.apache.org/docs/getting-started-standalone/' },
          { label: 'StreamNative Cloud', url: 'https://console.streamnative.io' },
        ],
      },
      Messaging: {
        overview: 'Pulsar topics use a 4-part naming scheme. Subscriptions define how multiple consumers share messages.',
        steps: [
          'Topic format: persistent://<tenant>/<namespace>/<topic-name>. The default tenant/namespace is public/default.',
          'Create a topic: pulsar-admin topics create persistent://public/default/fabric-events',
          'Or let it auto-create by producing to it.',
          'Subscription name: choose a unique name per application (e.g. fabric-etl). The subscription type controls fan-out: Shared (round-robin among consumers), Exclusive (single consumer), Failover (standby).',
        ],
        links: [
          { label: 'Topics', url: 'https://pulsar.apache.org/docs/concepts-messaging/#topics' },
          { label: 'Subscriptions', url: 'https://pulsar.apache.org/docs/concepts-messaging/#subscriptions' },
        ],
      },
      Authentication: {
        overview: 'Pulsar uses JWT tokens for client authentication. Tokens are signed by the broker\'s private key.',
        steps: [
          'For self-hosted: generate a token with pulsar-admin tokens create --subject fabric-client. Copy the JWT output.',
          'For StreamNative Cloud: console.streamnative.io → Service Accounts → Create → Download token.',
          'For Astra Streaming: astra.datastax.com → your tenant → Settings → Token → Generate Token.',
          'The token is a JWT string starting with "eyJ". Paste it into the Auth Token field.',
          'Tokens expire if set with --expiry-time. Rotate before expiry to avoid connection failures.',
        ],
        links: [
          { label: 'JWT authentication', url: 'https://pulsar.apache.org/docs/security-jwt/' },
        ],
      },
    },
  },

  Kinesis: {
    name: 'AWS Kinesis', color: '#FF9900', category: 'Stream Processor',
    docsUrl: 'https://docs.aws.amazon.com/kinesis/',
    fields: [
      { key: 'streamName',      label: 'Stream Name',       placeholder: 'fabric-stream', type: 'text',   section: 'Stream',         hint: 'Kinesis → Data Streams → Create data stream' },
      { key: 'region',          label: 'AWS Region',        placeholder: '', type: 'select', options: ['us-east-1','us-west-2','eu-west-1','ap-southeast-1','ap-northeast-1'], section: 'Stream', hint: 'Must match the region where your stream is deployed' },
      { key: 'shardCount',      label: 'Shard Count',       placeholder: '4',             type: 'number', section: 'Stream',         hint: '1 shard = 1 MB/s write, 2 MB/s read; scale up for higher throughput' },
      { key: 'accessKeyId',     label: 'Access Key ID',     placeholder: 'AKIA…',         type: 'text',     section: 'Authentication', hint: 'IAM → Users → your user → Security credentials → Create access key' },
      { key: 'secretAccessKey', label: 'Secret Access Key', placeholder: '••••••••',      type: 'password', section: 'Authentication', hint: 'Shown once at creation; store it securely' },
    ],
    guide: {
      Stream: {
        overview: 'A Kinesis Data Stream is a durable, real-time data channel. Shards are the unit of capacity.',
        steps: [
          'Go to AWS Console → Kinesis → Data Streams → Create data stream.',
          'Enter a stream name (e.g. fabric-stream). Choose "On-demand" capacity mode for automatic scaling, or "Provisioned" to specify shard count.',
          'For Provisioned mode: start with 1 shard for development, 4+ for production. Each shard supports 1 MB/s ingest and 2 MB/s read.',
          'Note the region — you must use the same region in the connection config.',
          'Data retention defaults to 24 hours; extend to 7 days in stream settings for replay capability.',
        ],
        links: [
          { label: 'Kinesis Console', url: 'https://console.aws.amazon.com/kinesis' },
          { label: 'Shard sizing', url: 'https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html#shard' },
        ],
      },
      Authentication: {
        overview: 'Fabric uses IAM access keys to authenticate to Kinesis. Use a dedicated IAM user with minimal permissions.',
        steps: [
          'Go to AWS Console → IAM → Users → Create user. Name it "fabric-kinesis-user".',
          'Attach permissions: click "Attach policies directly" → search for "AmazonKinesisFullAccess". For least-privilege, create a custom policy granting only kinesis:PutRecord, kinesis:GetRecords, kinesis:GetShardIterator on your specific stream ARN.',
          'Once the user is created, go to the user\'s page → "Security credentials" tab → "Create access key".',
          'Choose "Application running outside AWS", create the key, and copy both the Access Key ID and Secret Access Key.',
          'The secret is shown only once. Store it in a password manager before closing the dialog.',
          'Prefer IAM roles over access keys when running Fabric inside AWS (EC2, ECS, Lambda).',
        ],
        links: [
          { label: 'IAM access keys', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html' },
          { label: 'Kinesis IAM policy', url: 'https://docs.aws.amazon.com/streams/latest/dev/controlling-access.html' },
        ],
      },
    },
  },

  Flink: {
    name: 'Apache Flink', color: '#E6526F', category: 'Stream Processor',
    docsUrl: 'https://nightlies.apache.org/flink/flink-docs-stable/',
    fields: [
      { key: 'jobManagerUrl',      label: 'JobManager URL',          placeholder: 'http://localhost:8081', type: 'text',   section: 'Connection', hint: 'The Flink Web UI and REST API endpoint' },
      { key: 'parallelism',        label: 'Parallelism',             placeholder: '4',    type: 'number', section: 'Job',        hint: 'Number of parallel task slots; typically equals vCPU count' },
      { key: 'checkpointInterval', label: 'Checkpoint Interval (ms)',placeholder: '60000',type: 'number', section: 'Job',        hint: '60000 = checkpoint every 60s; lower = faster recovery, more overhead' },
      { key: 'checkpointDir',      label: 'Checkpoint Directory',    placeholder: 's3://bucket/flink', type: 'text', section: 'Job', hint: 'HDFS, S3, or GCS path; must be accessible by all TaskManagers' },
    ],
    guide: {
      Connection: {
        overview: 'Fabric communicates with Flink via its REST API, exposed by the JobManager on port 8081 by default.',
        steps: [
          'For local development: download Flink from flink.apache.org, extract it, and run ./bin/start-cluster.sh. The Web UI is at http://localhost:8081.',
          'For Docker: docker run -p 8081:8081 apache/flink standalone-job (or use docker compose with JobManager + TaskManager).',
          'For cloud: Confluent Cloud for Flink provides a managed service. Use the REST endpoint from the Confluent environment settings.',
          'For Amazon Managed Service for Apache Flink: find the Application URL in the AWS Console under Kinesis → Analytics applications.',
          'Ensure port 8081 is accessible from the Fabric server (open in security group / firewall if needed).',
        ],
        links: [
          { label: 'Flink quickstart', url: 'https://nightlies.apache.org/flink/flink-docs-stable/docs/try-flink/local_installation/' },
          { label: 'REST API docs', url: 'https://nightlies.apache.org/flink/flink-docs-stable/docs/ops/rest_api/' },
        ],
      },
      Job: {
        overview: 'These settings control how Flink executes and recovers your streaming jobs.',
        steps: [
          'Parallelism: set to the number of available task slots. For a single-machine setup, use the number of CPU cores. For a cluster, multiply machines by slots-per-machine.',
          'Checkpoint Interval: checkpoints save job state so Flink can recover from failures. 60,000 ms (60s) is a sensible starting point. Lower values (10s) improve recovery time at the cost of more I/O.',
          'Checkpoint Directory: must be a distributed filesystem accessible by all nodes. Use s3://your-bucket/flink-checkpoints, hdfs://namenode:8020/flink, or a shared NFS path.',
          'For AWS S3 checkpoints, ensure the Flink cluster has the flink-s3-fs-hadoop plugin and proper IAM permissions.',
          'Enable incremental checkpoints in flink-conf.yaml: state.backend.incremental: true for large stateful jobs.',
        ],
        links: [
          { label: 'Checkpointing', url: 'https://nightlies.apache.org/flink/flink-docs-stable/docs/ops/state/checkpoints/' },
          { label: 'S3 file system', url: 'https://nightlies.apache.org/flink/flink-docs-stable/docs/deployment/filesystems/s3/' },
        ],
      },
    },
  },

  'Spark Streaming': {
    name: 'Spark Streaming', color: '#E25A1C', category: 'Stream Processor',
    docsUrl: 'https://spark.apache.org/docs/latest/streaming-programming-guide.html',
    fields: [
      { key: 'masterUrl',     label: 'Master URL',        placeholder: 'spark://host:7077 or yarn', type: 'text',   section: 'Connection', hint: 'spark:// for standalone, yarn for YARN, local[*] for dev' },
      { key: 'appName',       label: 'Application Name',  placeholder: 'FabricStreamJob',           type: 'text',   section: 'Job',        hint: 'Shown in Spark UI; use a descriptive, unique name' },
      { key: 'batchDuration', label: 'Batch Duration (s)', placeholder: '10',                       type: 'number', section: 'Job',        hint: 'How often micro-batches are processed; 10s is a common starting point' },
      { key: 'checkpointDir', label: 'Checkpoint Dir',    placeholder: 'hdfs://path/checkpoint',   type: 'text',   section: 'Job',        hint: 'HDFS or S3 path for fault tolerance and stateful operations' },
    ],
    guide: {
      Connection: {
        overview: 'The master URL tells Spark where to run. Structured Streaming (recommended) or DStreams both use this setting.',
        steps: [
          'local[*]: runs Spark in-process using all available cores. Use for development and testing.',
          'local[4]: runs with exactly 4 threads locally.',
          'spark://hostname:7077: connects to a standalone Spark cluster. Find the master URL in the Spark Web UI at http://master-host:8080.',
          'yarn: submits jobs to a YARN cluster (Hadoop ecosystem). Requires HADOOP_CONF_DIR to be set.',
          'k8s://https://host:443: submits jobs to Kubernetes via the Spark-on-K8s operator.',
          'For Databricks: use Spark Streaming within a Databricks notebook instead of connecting externally.',
        ],
        links: [
          { label: 'Spark master URLs', url: 'https://spark.apache.org/docs/latest/submitting-applications.html#master-urls' },
          { label: 'Structured Streaming guide', url: 'https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html' },
        ],
      },
      Job: {
        overview: 'These settings define the streaming job\'s behavior, micro-batch frequency, and fault-tolerance.',
        steps: [
          'Application Name: choose a clear name (e.g. FabricStreamJob). It appears in the Spark History Server and YARN Resource Manager UI.',
          'Batch Duration: the micro-batch interval in seconds. Start with 10s. Lower values (1-2s) give near-real-time latency but increase scheduler overhead. Structured Streaming with trigger interval is preferred over DStreams for new code.',
          'Checkpoint Dir: required for stateful operations and recovery. Use an HDFS path (hdfs://namenode:8020/checkpoints/fabric) or S3 (s3a://bucket/checkpoints/fabric).',
          'For S3 checkpoints: add hadoop-aws JAR to the classpath and configure AWS credentials via spark.hadoop.fs.s3a.access.key / secret.key.',
          'Keep the checkpoint directory between restarts — deleting it resets all stateful aggregations.',
        ],
        links: [
          { label: 'Checkpointing', url: 'https://spark.apache.org/docs/latest/streaming-programming-guide.html#checkpointing' },
          { label: 'S3 integration', url: 'https://hadoop.apache.org/docs/stable/hadoop-aws/tools/hadoop-aws/index.html' },
        ],
      },
    },
  },

  // ── RDBMS Sources / Warehouses ──────────────────────────────────────────────

  MySQL: {
    name: 'MySQL', color: '#00758F', category: 'Data Warehouse',
    docsUrl: 'https://dev.mysql.com/doc/connector-j/en/',
    fields: [
      { key: 'host',        label: 'Host',            placeholder: 'db.example.com or 127.0.0.1', type: 'text',     section: 'Connection',     hint: 'Hostname or IP of your MySQL server; RDS endpoint from AWS Console' },
      { key: 'port',        label: 'Port',            placeholder: '3306',                        type: 'number',   section: 'Connection',     hint: 'Default MySQL port is 3306' },
      { key: 'database',    label: 'Database',        placeholder: 'fabric_db',                   type: 'text',     section: 'Connection',     hint: 'Name of the schema/database to connect to' },
      { key: 'username',    label: 'Username',        placeholder: 'fabric_user',                 type: 'text',     section: 'Authentication', hint: 'CREATE USER fabric_user@\'%\' IDENTIFIED BY \'password\';' },
      { key: 'password',    label: 'Password',        placeholder: '••••••••',                    type: 'password', section: 'Authentication', hint: 'Use a dedicated service account, not root' },
      { key: 'sslMode',     label: 'SSL Mode',        placeholder: '', type: 'select', options: ['disabled','required','verify-ca','verify-identity'], section: 'Options', hint: 'required for cloud-hosted MySQL (RDS, Cloud SQL, PlanetScale)' },
      { key: 'poolSize',    label: 'Connection Pool', placeholder: '10', type: 'number', section: 'Options', hint: 'Max simultaneous connections; start with 10' },
    ],
    guide: {
      Connection: {
        overview: 'Fabric connects to MySQL via JDBC/native driver. You need the server hostname, port, and a target database.',
        steps: [
          'For local MySQL: host = localhost, port = 3306.',
          'For AWS RDS: AWS Console → RDS → Databases → your instance → Connectivity & security → Endpoint.',
          'For Google Cloud SQL: Cloud Console → SQL → your instance → Overview → Connection name / IP address.',
          'For Azure Database for MySQL: Azure Portal → your server → Overview → Server name.',
          'For PlanetScale: Dashboard → your database → Connect → hostname from connection string.',
          'Ensure the MySQL server allows connections from Fabric\'s IP (check firewall rules / security groups).',
        ],
        links: [
          { label: 'AWS RDS MySQL', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToInstance.html' },
          { label: 'Cloud SQL MySQL', url: 'https://cloud.google.com/sql/docs/mysql/connect-overview' },
        ],
      },
      Authentication: {
        overview: 'Create a dedicated MySQL user with only the permissions Fabric needs — avoid using root.',
        steps: [
          'Connect to MySQL as root: mysql -u root -p',
          'Create a user: CREATE USER \'fabric_user\'@\'%\' IDENTIFIED BY \'<strong-password>\';',
          'Grant permissions for read/write: GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP ON fabric_db.* TO \'fabric_user\'@\'%\';',
          'For read-only extraction: GRANT SELECT ON source_db.* TO \'fabric_user\'@\'%\';',
          'Apply: FLUSH PRIVILEGES;',
          'For cloud-managed MySQL (RDS, Cloud SQL): create users via the cloud console or a SQL worksheet.',
        ],
        links: [
          { label: 'MySQL user management', url: 'https://dev.mysql.com/doc/refman/8.0/en/user-account-management.html' },
        ],
      },
      Options: {
        overview: 'SSL and connection pooling improve security and throughput for production workloads.',
        steps: [
          'SSL Mode "required" is the minimum for any cloud-hosted MySQL. "verify-ca" additionally validates the server certificate.',
          'For AWS RDS: download the RDS CA bundle from https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem for verify-ca mode.',
          'Connection Pool: 10 connections is a good starting point. Raise to 20–50 for high-throughput ETL. Never exceed the server\'s max_connections.',
          'Check server limits: SHOW VARIABLES LIKE \'max_connections\';',
        ],
        links: [
          { label: 'MySQL SSL', url: 'https://dev.mysql.com/doc/refman/8.0/en/using-encrypted-connections.html' },
          { label: 'RDS SSL certs', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html' },
        ],
      },
    },
  },

  'SQL Server': {
    name: 'SQL Server', color: '#CC2927', category: 'Data Warehouse',
    docsUrl: 'https://learn.microsoft.com/en-us/sql/connect/jdbc/microsoft-jdbc-driver-for-sql-server',
    fields: [
      { key: 'host',        label: 'Host',            placeholder: 'server.database.windows.net', type: 'text',     section: 'Connection',     hint: 'Azure SQL: Azure Portal → SQL server → Server name' },
      { key: 'port',        label: 'Port',            placeholder: '1433',                        type: 'number',   section: 'Connection',     hint: 'Default is 1433; named instances may differ' },
      { key: 'database',    label: 'Database',        placeholder: 'FabricDB',                    type: 'text',     section: 'Connection',     hint: 'The database name (not the server name)' },
      { key: 'instance',    label: 'Instance Name',   placeholder: 'MSSQLSERVER (optional)',      type: 'text',     section: 'Connection',     hint: 'Only for named instances on on-premise SQL Server; leave blank for Azure SQL' },
      { key: 'authType',    label: 'Auth Type',       placeholder: '', type: 'select', options: ['SQL Auth','Windows Auth','Azure AD','Azure AD MSI'], section: 'Authentication', hint: 'Azure SQL → use SQL Auth or Azure AD; on-prem → SQL Auth or Windows Auth' },
      { key: 'username',    label: 'Username',        placeholder: 'fabric_user',                 type: 'text',     section: 'Authentication', hint: 'SQL login name; not required for Windows Auth or Azure AD MSI' },
      { key: 'password',    label: 'Password',        placeholder: '••••••••',                    type: 'password', section: 'Authentication', hint: 'Minimum 8 chars with mixed case, numbers, symbols for Azure SQL' },
      { key: 'encrypt',     label: 'Encrypt',         placeholder: '', type: 'select', options: ['true','false'],               section: 'Options',        hint: 'Always true for Azure SQL; required for TLS-enabled on-prem' },
      { key: 'trustCert',   label: 'Trust Server Cert', placeholder: '', type: 'select', options: ['false','true'],             section: 'Options',        hint: 'false = verify server cert (production); true = skip verification (dev only)' },
    ],
    guide: {
      Connection: {
        overview: 'SQL Server connections use TDS protocol on port 1433. Azure SQL and on-premise SQL Server use the same driver.',
        steps: [
          'For Azure SQL Database: Azure Portal → SQL databases → your database → Overview → "Server name" (format: server.database.windows.net).',
          'For Azure SQL Managed Instance: Portal → SQL managed instances → your instance → Overview → Host.',
          'For on-premise / VM: use the server\'s hostname or IP. For named instances, append \\InstanceName (e.g. MYSERVER\\SQLEXPRESS).',
          'For Amazon RDS SQL Server: RDS Console → your instance → Endpoint & port.',
          'Port 1433 must be open in the firewall/security group from Fabric\'s IP.',
        ],
        links: [
          { label: 'Azure SQL connectivity', url: 'https://learn.microsoft.com/en-us/azure/azure-sql/database/connect-query-content-reference-guide' },
          { label: 'Connection string reference', url: 'https://learn.microsoft.com/en-us/sql/connect/jdbc/building-the-connection-url' },
        ],
      },
      Authentication: {
        overview: 'SQL Auth is simplest. Azure AD is recommended for Azure SQL in production (no password to manage).',
        steps: [
          'SQL Auth: create a login at the server level, then a user in the database.',
          'On the server: CREATE LOGIN fabric_login WITH PASSWORD = \'<password>\';',
          'In the database: USE FabricDB; CREATE USER fabric_user FOR LOGIN fabric_login; ALTER ROLE db_datareader ADD MEMBER fabric_user; ALTER ROLE db_datawriter ADD MEMBER fabric_user;',
          'Azure AD Auth: in Azure Portal → SQL server → Azure Active Directory → Set admin. Then create a contained user: CREATE USER [user@domain.com] FROM EXTERNAL PROVIDER;',
          'Azure AD MSI (Managed Identity): assign the managed identity to the SQL server as an AAD admin. No credentials needed.',
        ],
        links: [
          { label: 'SQL Server logins', url: 'https://learn.microsoft.com/en-us/sql/relational-databases/security/authentication-access/create-a-login' },
          { label: 'Azure AD auth', url: 'https://learn.microsoft.com/en-us/azure/azure-sql/database/authentication-aad-overview' },
        ],
      },
      Options: {
        overview: 'Encryption and certificate trust settings control transport security.',
        steps: [
          'Encrypt = true is mandatory for Azure SQL and should be used for all production connections.',
          'Trust Server Certificate = false is the secure default — Fabric will verify the server\'s TLS certificate.',
          'Set Trust Server Certificate = true only for local development with a self-signed certificate.',
          'For on-premise with a corporate CA: set to false and ensure the CA cert is in the system trust store.',
        ],
        links: [
          { label: 'Encryption', url: 'https://learn.microsoft.com/en-us/sql/connect/jdbc/understanding-ssl-support' },
        ],
      },
    },
  },

  Oracle: {
    name: 'Oracle DB', color: '#F80000', category: 'Data Warehouse',
    docsUrl: 'https://docs.oracle.com/en/database/oracle/oracle-database/21/jjdbc/',
    fields: [
      { key: 'host',         label: 'Host',           placeholder: 'db.example.com',              type: 'text',     section: 'Connection',     hint: 'Oracle Cloud: ADB Console → DB Connection → Host' },
      { key: 'port',         label: 'Port',           placeholder: '1521',                        type: 'number',   section: 'Connection',     hint: 'Default Oracle listener port is 1521' },
      { key: 'serviceName',  label: 'Service Name',   placeholder: 'ORCL or pdbname.domain',      type: 'text',     section: 'Connection',     hint: 'Preferred over SID for modern Oracle (12c+). Find via: SELECT name FROM v$services;' },
      { key: 'sid',          label: 'SID (legacy)',   placeholder: 'ORCL',                        type: 'text',     section: 'Connection',     hint: 'Use Service Name instead for Oracle 12c+; SID is for older instances' },
      { key: 'connectMode',  label: 'Connect Mode',   placeholder: '', type: 'select', options: ['thin','thick'], section: 'Connection', hint: 'thin = pure Java, no Oracle Client needed; thick = full Oracle Client (OCI)' },
      { key: 'username',     label: 'Username',       placeholder: 'FABRIC',                      type: 'text',     section: 'Authentication', hint: 'Oracle usernames are case-insensitive; use uppercase by convention' },
      { key: 'password',     label: 'Password',       placeholder: '••••••••',                    type: 'password', section: 'Authentication', hint: 'Password is case-sensitive in Oracle 12c+' },
      { key: 'walletDir',    label: 'Wallet Directory', placeholder: '/opt/oracle/wallet (optional)', type: 'text', section: 'Authentication', hint: 'Required for Oracle Cloud ADB (mTLS); download wallet from ADB Console → DB Connection' },
    ],
    guide: {
      Connection: {
        overview: 'Oracle connections use the Oracle Net (TNS) protocol. Service Name is the modern way to identify a database.',
        steps: [
          'For Oracle Cloud ADB (Autonomous): ADB Console → your database → DB Connection → Download Instance Wallet. Extract and note the wallet directory path.',
          'Service Name for ADB looks like: databasename_tp.adb.region.oraclecloud.com',
          'For on-premise Oracle: ask your DBA for the service name. Or run: SELECT name FROM v$services; in SQL*Plus.',
          'Connect Mode "thin" works without installing Oracle Client and is recommended for most use cases.',
          '"thick" mode is needed for features like Advanced Queuing, or if your DBA requires Oracle Wallet / native auth.',
        ],
        links: [
          { label: 'Oracle JDBC thin', url: 'https://docs.oracle.com/en/database/oracle/oracle-database/21/jjdbc/JDBC-getting-started.html' },
          { label: 'ADB wallet', url: 'https://docs.oracle.com/en/cloud/paas/autonomous-database/adbsa/connect-download-wallet.html' },
        ],
      },
      Authentication: {
        overview: 'Oracle uses schema-level users. In a multi-tenant (CDB) setup, use a PDB user with the C## prefix for CDB-level accounts.',
        steps: [
          'Connect as SYSDBA or a DBA account to create a user.',
          'Create user: CREATE USER fabric IDENTIFIED BY "<password>";',
          'Grant permissions: GRANT CONNECT, RESOURCE TO fabric; GRANT UNLIMITED TABLESPACE TO fabric;',
          'For read-only extraction: GRANT SELECT ANY TABLE TO fabric; (or grant per-table: GRANT SELECT ON schema.table TO fabric;)',
          'For Oracle Cloud ADB: use the cloud console to create users, or connect via SQL Developer Web.',
          'Wallet auth: place the downloaded wallet files (cwallet.sso, ewallet.p12, etc.) in a directory and set walletDir to that path.',
        ],
        links: [
          { label: 'Creating users', url: 'https://docs.oracle.com/en/database/oracle/oracle-database/21/sqlrf/CREATE-USER.html' },
          { label: 'ADB users', url: 'https://docs.oracle.com/en/cloud/paas/autonomous-database/adbsa/manage-users.html' },
        ],
      },
    },
  },

  DB2: {
    name: 'IBM DB2', color: '#054ADA', category: 'Data Warehouse',
    docsUrl: 'https://www.ibm.com/docs/en/db2/11.5?topic=jdbc-ibm-data-server-driver',
    fields: [
      { key: 'host',     label: 'Host',     placeholder: 'db2.example.com',             type: 'text',     section: 'Connection',     hint: 'IBM Cloud: Resource list → Databases for DB2 → Service credentials → hostname' },
      { key: 'port',     label: 'Port',     placeholder: '50000',                       type: 'number',   section: 'Connection',     hint: 'Default DB2 port is 50000; SSL port is typically 50001' },
      { key: 'database', label: 'Database', placeholder: 'BLUDB',                       type: 'text',     section: 'Connection',     hint: 'IBM Cloud DB2 default database is BLUDB' },
      { key: 'username', label: 'Username', placeholder: 'db2user',                     type: 'text',     section: 'Authentication', hint: 'IBM Cloud: Service credentials → username' },
      { key: 'password', label: 'Password', placeholder: '••••••••',                    type: 'password', section: 'Authentication', hint: 'IBM Cloud: Service credentials → password' },
      { key: 'schema',   label: 'Default Schema', placeholder: 'DB2INST1',              type: 'text',     section: 'Schema',         hint: 'DB2 schema = user name by default; set explicitly if different' },
      { key: 'sslEnabled', label: 'SSL', placeholder: '', type: 'select', options: ['true','false'], section: 'Schema', hint: 'Always true for IBM Cloud Db2' },
    ],
    guide: {
      Connection: {
        overview: 'IBM Db2 uses its own JDBC driver (IBMJCC). IBM Cloud provides Db2 as a managed service with pre-configured credentials.',
        steps: [
          'For IBM Cloud Databases for DB2: log into cloud.ibm.com → Resource list → expand "Databases" → select your Db2 instance.',
          'Go to "Service credentials" → "New credential" → click on the credential to expand. Copy hostname, port, database, username, password.',
          'IBM Cloud DB2 Lite tier: free, database name is always BLUDB, SSL port is 50001.',
          'For on-premise DB2: ask your DBA for the host, port (usually 50000), and SAMPLE database name.',
          'Download the IBM JDBC driver (db2jcc4.jar) from IBM Fix Central if needed.',
        ],
        links: [
          { label: 'IBM Cloud DB2', url: 'https://cloud.ibm.com/catalog/services/db2' },
          { label: 'JDBC connection', url: 'https://www.ibm.com/docs/en/db2/11.5?topic=cdsudidsdjs-url-format-data-server-driver-jdbc-sqlj-type-4-connectivity' },
        ],
      },
      Authentication: {
        overview: 'DB2 uses OS-level authentication by default. IBM Cloud uses its own credential system.',
        steps: [
          'On-premise: DB2 uses the OS user accounts. Create a user at the OS level, then: CONNECT TO SAMPLE; CREATE USER db2user USING <password>; GRANT DBADM ON DATABASE TO USER db2user;',
          'Grant read access: GRANT SELECT ON TABLE schema.tablename TO USER db2user;',
          'IBM Cloud: credentials are auto-generated. Download them from the Service credentials tab.',
          'For restricted access on IBM Cloud: create a new credential and modify the privileges via Db2 Console → Users.',
        ],
        links: [
          { label: 'DB2 authorization', url: 'https://www.ibm.com/docs/en/db2/11.5?topic=security-authorization' },
        ],
      },
      Schema: {
        overview: 'In DB2, every table belongs to a schema. The default schema matches the username unless explicitly set.',
        steps: [
          'Default schema: when you connect as "db2user", the default schema is DB2USER (uppercase).',
          'Set explicitly to avoid ambiguity: SET CURRENT SCHEMA = \'MYSCHEMA\';',
          'Create a schema: CREATE SCHEMA myschema AUTHORIZATION db2user;',
          'For cross-schema queries, fully qualify: SELECT * FROM schemaname.tablename;',
        ],
        links: [
          { label: 'DB2 schemas', url: 'https://www.ibm.com/docs/en/db2/11.5?topic=objects-schemas' },
        ],
      },
    },
  },

  Sybase: {
    name: 'SAP Sybase ASE', color: '#0080A3', category: 'Data Warehouse',
    docsUrl: 'https://help.sap.com/docs/SAP_ASE',
    fields: [
      { key: 'host',       label: 'Host',        placeholder: 'sybase.example.com',    type: 'text',     section: 'Connection',     hint: 'Hostname or IP of the ASE server' },
      { key: 'port',       label: 'Port',        placeholder: '5000',                  type: 'number',   section: 'Connection',     hint: 'Default Sybase ASE port is 5000' },
      { key: 'serverName', label: 'Server Name', placeholder: 'SYBASE',                type: 'text',     section: 'Connection',     hint: 'ASE server name from interfaces file / LDAP; shown in isql -S <name>' },
      { key: 'database',   label: 'Database',    placeholder: 'master',                type: 'text',     section: 'Connection',     hint: 'Target database; "master" is the system DB, use an application DB' },
      { key: 'username',   label: 'Username',    placeholder: 'sa',                    type: 'text',     section: 'Authentication', hint: 'ASE login name; avoid using "sa" in production' },
      { key: 'password',   label: 'Password',    placeholder: '••••••••',              type: 'password', section: 'Authentication', hint: 'ASE login password set with sp_password' },
      { key: 'charset',    label: 'Charset',     placeholder: 'utf8',                  type: 'text',     section: 'Authentication', hint: 'Must match server charset; run: sp_helpsort to check' },
      { key: 'tdsVersion', label: 'TDS Version', placeholder: '', type: 'select', options: ['5.0','7.0','8.0'], section: 'Authentication', hint: 'Sybase ASE uses TDS 5.0; use 7.0/8.0 only for SQL Server compatibility mode' },
    ],
    guide: {
      Connection: {
        overview: 'SAP Sybase ASE uses the TDS (Tabular Data Stream) protocol. Connections require the server name, host, port, and target database.',
        steps: [
          'Ask your Sybase DBA for the server name (registered in interfaces or LDAP), host, and port.',
          'Default port is 5000; some installations use 4100 or a custom port.',
          'Verify connectivity: isql -S <ServerName> -U <user> -P <password>',
          'For remote access: ensure the ASE server has "enable remote access" = 1 (sp_configure \'enable remote access\', 1).',
          'For SAP ASE on SAP Cloud: use the connection details from the SAP BTP service binding.',
        ],
        links: [
          { label: 'ASE connectivity', url: 'https://help.sap.com/docs/SAP_ASE/38b00572f8ed4d4b8b62ba4d4e40d9ef/a6e98bd9bc2b1014b8b8fbe6e7e4daf2.html' },
          { label: 'jTDS driver', url: 'http://jtds.sourceforge.net/faq.html' },
        ],
      },
      Authentication: {
        overview: 'Sybase ASE uses its own login system. Create a dedicated login and map it to a database user.',
        steps: [
          'Connect as "sa" (system admin) or an account with SA_ROLE.',
          'Create a login: sp_addlogin fabric_login, "<password>", fabric_db',
          'Add user to database: USE fabric_db; sp_adduser fabric_login, fabric_user',
          'Grant permissions: GRANT SELECT, INSERT, UPDATE, DELETE ON table_name TO fabric_user',
          'For read-only ETL source: GRANT SELECT ON ALL TABLES IN DATABASE TO fabric_user',
          'Charset must match the ASE server: run sp_helpsort to check; utf8 is common for modern ASE.',
        ],
        links: [
          { label: 'ASE logins', url: 'https://help.sap.com/docs/SAP_ASE/38b00572f8ed4d4b8b62ba4d4e40d9ef/ab9def7cbc2b1014bf1cbbec63f046c9.html' },
        ],
      },
    },
  },

  // ── File Sources ────────────────────────────────────────────────────────────

  'Local Files': {
    name: 'Local Files', color: '#64748B', category: 'File Source',
    docsUrl: 'https://nodejs.org/api/fs.html',
    fields: [
      { key: 'basePath',    label: 'Base Directory',  placeholder: '/data/fabric or C:\\data\\fabric',  type: 'text',   section: 'Source',  hint: 'Absolute path to the directory containing source files' },
      { key: 'filePattern', label: 'File Pattern',    placeholder: '**/*.csv',                          type: 'text',   section: 'Source',  hint: 'Glob pattern: *.csv, **/*.json, data_*.parquet' },
      { key: 'recursive',   label: 'Recursive Scan',  placeholder: '', type: 'select', options: ['true','false'],  section: 'Source',  hint: 'true = scan all subdirectories; false = top-level only' },
      { key: 'fileFormat',  label: 'File Format',     placeholder: '', type: 'select', options: ['CSV','JSON','Parquet','Excel','Avro','TSV'], section: 'Format', hint: 'Primary format; Fabric auto-detects by extension if not set' },
      { key: 'delimiter',   label: 'Delimiter (CSV)', placeholder: ',',  type: 'text',   section: 'Format',  hint: 'For CSV/TSV: , (comma), \\t (tab), | (pipe), ; (semicolon)' },
      { key: 'hasHeader',   label: 'Has Header Row',  placeholder: '', type: 'select', options: ['true','false'], section: 'Format', hint: 'true = first row is column names; false = use col_0, col_1...' },
      { key: 'encoding',    label: 'Encoding',        placeholder: 'utf-8', type: 'select', options: ['utf-8','utf-16','latin1','ascii'], section: 'Format', hint: 'Text encoding of the source files; utf-8 covers most modern files' },
    ],
    guide: {
      Source: {
        overview: 'Fabric reads files from a local filesystem path. The file watcher picks up new files matching the pattern automatically.',
        steps: [
          'Set Base Directory to the absolute path of the folder containing your data files (e.g. /data/exports or C:\\ETL\\input).',
          'File Pattern uses glob syntax: *.csv matches all CSVs in the base dir; **/*.csv includes subdirectories; data_2024*.json matches files starting with "data_2024".',
          'Recursive Scan = true scans all nested subdirectories. Useful for date-partitioned exports (YYYY/MM/DD/...).',
          'Ensure Fabric has read permission on the directory: on Linux, check with ls -la <path>; on Windows, check folder Properties → Security.',
          'For real-time ingestion: Fabric watches for new files matching the pattern and processes them as they arrive.',
        ],
        links: [
          { label: 'Glob pattern reference', url: 'https://en.wikipedia.org/wiki/Glob_(programming)' },
        ],
      },
      Format: {
        overview: 'Specify the file format and parsing options so Fabric can correctly interpret the source data.',
        steps: [
          'CSV: most common format. Set Delimiter (comma, tab, pipe), and Has Header Row. Fabric infers column types automatically.',
          'JSON: either newline-delimited JSON (one object per line) or a JSON array. Fabric handles both.',
          'Parquet: columnar binary format — fastest for large datasets. No delimiter or header settings needed.',
          'Excel (.xlsx): Fabric reads the first sheet by default. Ensure pandas/openpyxl is installed in the Fabric environment.',
          'Avro: schema-embedded binary format. The schema is read from the file header automatically.',
          'Encoding: use utf-8 for most files. If you see garbled characters (mojibake), try latin1 or utf-16.',
        ],
        links: [
          { label: 'Parquet format', url: 'https://parquet.apache.org/docs/file-format/' },
          { label: 'Avro format', url: 'https://avro.apache.org/docs/current/spec.html' },
        ],
      },
    },
  },

  'AWS S3': {
    name: 'AWS S3', color: '#FF9900', category: 'File Source',
    docsUrl: 'https://docs.aws.amazon.com/s3/index.html',
    fields: [
      { key: 'bucket',          label: 'Bucket Name',       placeholder: 'my-fabric-data',       type: 'text',     section: 'Storage',        hint: 'S3 Console → Buckets → your bucket name (globally unique)' },
      { key: 'prefix',          label: 'Prefix / Folder',   placeholder: 'exports/2024/',         type: 'text',     section: 'Storage',        hint: 'Virtual folder path within the bucket; leave blank to scan entire bucket' },
      { key: 'region',          label: 'AWS Region',        placeholder: '', type: 'select', options: ['us-east-1','us-west-2','eu-west-1','eu-central-1','ap-southeast-1','ap-northeast-1'], section: 'Storage', hint: 'Must match the region where the bucket was created' },
      { key: 'accessKeyId',     label: 'Access Key ID',     placeholder: 'AKIA…',                 type: 'text',     section: 'Authentication', hint: 'IAM → Users → your user → Security credentials → Create access key' },
      { key: 'secretAccessKey', label: 'Secret Access Key', placeholder: '••••••••',              type: 'password', section: 'Authentication', hint: 'Shown once at creation; store securely. Or leave blank to use IAM role.' },
      { key: 'fileFormat',      label: 'File Format',       placeholder: '', type: 'select', options: ['CSV','JSON','Parquet','Excel','Avro','TSV'], section: 'Format', hint: 'Primary format of objects in the bucket/prefix' },
      { key: 'compression',     label: 'Compression',       placeholder: '', type: 'select', options: ['none','gzip','snappy','zstd'], section: 'Format', hint: 'Parquet files often use snappy; CSV exports are often gzip' },
    ],
    guide: {
      Storage: {
        overview: 'S3 is AWS\'s object storage. Fabric reads objects from a bucket, optionally filtered by a prefix (virtual folder).',
        steps: [
          'Create a bucket: AWS Console → S3 → Create bucket. Choose a unique name and the target region.',
          'Organize files using prefixes (folder-like paths): e.g. exports/2024/01/data.parquet.',
          'Set the Prefix field to limit Fabric\'s scan to a specific "folder" (e.g. exports/2024/ or raw/transactions/).',
          'Leave Prefix blank to scan the entire bucket — caution for large buckets with many objects.',
          'Ensure the bucket is in the same region as your other AWS resources to minimize cross-region data transfer costs.',
        ],
        links: [
          { label: 'S3 Console', url: 'https://s3.console.aws.amazon.com' },
          { label: 'S3 naming rules', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html' },
        ],
      },
      Authentication: {
        overview: 'Use a dedicated IAM user with read-only S3 access. If Fabric runs on AWS (EC2, ECS, Lambda), use an IAM role instead — no keys needed.',
        steps: [
          'Create a dedicated IAM user: AWS Console → IAM → Users → Create user → name it "fabric-s3-reader".',
          'Attach policy: on the Permissions tab, click "Attach policies directly" → search for "AmazonS3ReadOnlyAccess" (or create a custom policy for least-privilege access to specific buckets).',
          'Custom least-privilege policy: {"Effect":"Allow","Action":["s3:GetObject","s3:ListBucket"],"Resource":["arn:aws:s3:::my-bucket","arn:aws:s3:::my-bucket/*"]}',
          'Generate credentials: go to the user → Security credentials tab → Create access key → choose "Application outside AWS".',
          'Copy both the Access Key ID and Secret. The secret is shown only once.',
          'If Fabric runs on AWS infrastructure: attach an IAM role to the EC2/ECS task instead and leave both fields blank.',
        ],
        links: [
          { label: 'IAM S3 policy', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-iam-awsmanpol.html' },
          { label: 'IAM roles for EC2', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html' },
        ],
      },
      Format: {
        overview: 'Specify the format and compression of files Fabric should read from S3.',
        steps: [
          'Parquet + Snappy is the most efficient combination for analytical workloads — minimal storage, fast reads.',
          'CSV + gzip is common for data exports from databases and SaaS tools.',
          'JSON: if each S3 object is a JSON array, Fabric unpacks it. If newline-delimited JSON (NDJSON), each line is a record.',
          'For mixed formats in a bucket, configure a separate source connector per format using different prefixes.',
          'Compression is auto-detected from file extension (.gz, .snappy, .zst) but you can set it explicitly here as a default.',
        ],
        links: [
          { label: 'S3 data formats', url: 'https://docs.aws.amazon.com/athena/latest/ug/supported-serdes.html' },
        ],
      },
    },
  },

  'Azure Blob': {
    name: 'Azure Blob Storage', color: '#0078D4', category: 'File Source',
    docsUrl: 'https://learn.microsoft.com/en-us/azure/storage/blobs/',
    fields: [
      { key: 'accountName',        label: 'Storage Account',   placeholder: 'mystorageaccount',             type: 'text',     section: 'Storage',        hint: 'Azure Portal → Storage accounts → your account name' },
      { key: 'containerName',      label: 'Container',         placeholder: 'fabric-data',                  type: 'text',     section: 'Storage',        hint: 'Storage account → Containers → your container name' },
      { key: 'blobPrefix',         label: 'Blob Prefix',       placeholder: 'exports/2024/',                type: 'text',     section: 'Storage',        hint: 'Virtual folder path; leave blank to scan entire container' },
      { key: 'connectionString',   label: 'Connection String', placeholder: 'DefaultEndpointsProtocol=https;AccountName=…', type: 'password', section: 'Authentication', hint: 'Storage account → Access keys → key1 → Connection string' },
      { key: 'sasToken',           label: 'SAS Token (alt)',   placeholder: '?sv=2023-01-03&…',             type: 'password', section: 'Authentication', hint: 'Alternative to connection string; generated in Storage account → Shared access signature' },
      { key: 'fileFormat',         label: 'File Format',       placeholder: '', type: 'select', options: ['CSV','JSON','Parquet','Excel','Avro','TSV'], section: 'Format', hint: 'Primary format of blobs in the container/prefix' },
      { key: 'compression',        label: 'Compression',       placeholder: '', type: 'select', options: ['none','gzip','snappy','zstd'], section: 'Format', hint: 'Auto-detected from .gz/.snappy extensions; override here if needed' },
    ],
    guide: {
      Storage: {
        overview: 'Azure Blob Storage organizes data in storage accounts → containers → blobs. A container is equivalent to an S3 bucket.',
        steps: [
          'Create a storage account: Azure Portal → Storage accounts → + Create. Choose a unique name (3-24 lowercase alphanumeric chars).',
          'Create a container: open the storage account → Containers → + Container. Set access level to "Private (no anonymous access)".',
          'Upload files or configure Azure Data Factory / ADF copy activity to land files in this container.',
          'Use Blob Prefix to limit Fabric\'s scan (e.g. exports/daily/ for daily snapshots).',
          'Azure Data Lake Storage Gen2 (ADLS Gen2) uses the same API — set accountName to your ADLS account and it works the same way.',
        ],
        links: [
          { label: 'Azure Portal', url: 'https://portal.azure.com' },
          { label: 'Blob storage quickstart', url: 'https://learn.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-portal' },
        ],
      },
      Authentication: {
        overview: 'Use either a Connection String (full access) or a SAS Token (scoped, time-limited access).',
        steps: [
          'Connection String (recommended for development): Azure Portal → your storage account → Access keys → Show keys → copy "Connection string" for key1.',
          'The connection string looks like: DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=xxx;EndpointSuffix=core.windows.net',
          'SAS Token (recommended for production with least-privilege): Azure Portal → your storage account → Shared access signature.',
          'Configure SAS with: Allowed services = Blob, Allowed resource types = Container + Object, Permissions = Read + List, expiry date → Generate SAS.',
          'Copy the "SAS token" (starts with ?sv=). Paste it into the SAS Token field.',
          'For Azure AD / managed identity: leave both fields blank and ensure Fabric\'s managed identity has the "Storage Blob Data Reader" role on the container.',
        ],
        links: [
          { label: 'Storage access keys', url: 'https://learn.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage' },
          { label: 'SAS tokens', url: 'https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview' },
          { label: 'Azure AD RBAC', url: 'https://learn.microsoft.com/en-us/azure/storage/blobs/assign-azure-role-data-access' },
        ],
      },
      Format: {
        overview: 'Specify the format and compression of blobs Fabric reads from Azure.',
        steps: [
          'Parquet + Snappy: best performance for analytics. Widely used with Azure Synapse and Databricks.',
          'CSV + gzip: standard for scheduled exports from Azure SQL, Cosmos DB change feed, or Logic Apps.',
          'JSON: Azure Event Hub capture, IoT Hub routing, and Logic Apps commonly produce JSON files.',
          'Delta Lake tables (Delta format) on ADLS Gen2: set format to Parquet — Delta is Parquet with transaction logs.',
          'For mixed formats: create separate Fabric sources pointing to different prefixes, each with its own format setting.',
        ],
        links: [
          { label: 'Azure supported formats', url: 'https://learn.microsoft.com/en-us/azure/data-factory/supported-file-formats-and-compression-codecs' },
        ],
      },
    },
  },

  // ── Additional source wizard configs ────────────────────────────────────────

  PostgreSQL: {
    name: 'PostgreSQL', color: '#336791', category: 'Data Warehouse',
    docsUrl: 'https://www.postgresql.org/docs/current/libpq-connect.html',
    fields: [
      { key: 'host',       label: 'Host',         placeholder: 'db.example.com',          type: 'text',     section: 'Connection',     hint: 'Supabase: Settings → Database → Host; Neon: Dashboard → Connection string' },
      { key: 'port',       label: 'Port',         placeholder: '5432',                    type: 'number',   section: 'Connection',     hint: 'Default PostgreSQL port is 5432' },
      { key: 'database',   label: 'Database',     placeholder: 'fabric_db',               type: 'text',     section: 'Connection',     hint: 'Database name; for Supabase this is "postgres"' },
      { key: 'username',   label: 'Username',     placeholder: 'fabric_user',             type: 'text',     section: 'Authentication', hint: 'CREATE ROLE fabric_user WITH LOGIN PASSWORD \'...\';' },
      { key: 'password',   label: 'Password',     placeholder: '••••••••',                type: 'password', section: 'Authentication', hint: 'Use a dedicated service account rather than the superuser' },
      { key: 'sslMode',    label: 'SSL Mode',     placeholder: '', type: 'select', options: ['require','disable','verify-ca','verify-full','prefer'], section: 'Options', hint: 'require for all cloud-hosted Postgres (Supabase, Neon, RDS, etc.)' },
      { key: 'cdcEnabled', label: 'CDC / Replication', placeholder: '', type: 'select', options: ['false','true'], section: 'Options', hint: 'true = use logical replication slot for real-time change capture' },
    ],
    guide: {
      Connection: {
        overview: 'PostgreSQL is the most widely deployed open-source RDBMS. Most cloud providers offer a managed version.',
        steps: [
          'Supabase: Project Settings → Database → Connection Info → copy Host, Port (usually 5432 or 6543 for pooler), Database (postgres), User.',
          'Neon: Dashboard → your project → Connection Details → connection string. Parse host/port/db from the URL.',
          'AWS RDS: Console → RDS → your instance → Connectivity → Endpoint & Port.',
          'Local: host = localhost, port = 5432.',
          'The host must be reachable from Fabric. For cloud DBs, whitelist Fabric\'s IP in security groups.',
        ],
        links: [
          { label: 'Supabase connection', url: 'https://supabase.com/docs/guides/database/connecting-to-postgres' },
          { label: 'Neon connection', url: 'https://neon.tech/docs/connect/connect-from-any-app' },
          { label: 'RDS PostgreSQL', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToPostgreSQLInstance.html' },
        ],
      },
      Authentication: {
        overview: 'Create a dedicated role for Fabric with only the permissions it needs.',
        steps: [
          'Connect as a superuser and run: CREATE ROLE fabric_user WITH LOGIN PASSWORD \'<password>\';',
          'For read-only extraction: GRANT CONNECT ON DATABASE fabric_db TO fabric_user; GRANT USAGE ON SCHEMA public TO fabric_user; GRANT SELECT ON ALL TABLES IN SCHEMA public TO fabric_user;',
          'For read/write: additionally grant INSERT, UPDATE, DELETE.',
          'For CDC (logical replication): the user needs REPLICATION privilege: ALTER ROLE fabric_user REPLICATION;',
        ],
        links: [
          { label: 'Role management', url: 'https://www.postgresql.org/docs/current/user-manag.html' },
          { label: 'Logical replication', url: 'https://www.postgresql.org/docs/current/logical-replication.html' },
        ],
      },
      Options: {
        overview: 'SSL and CDC (Change Data Capture) for real-time streaming.',
        steps: [
          'SSL Mode "require": encrypts the connection but does not verify the server certificate. Suitable for most cloud-hosted Postgres.',
          '"verify-full": also verifies the server certificate against a CA. Use for production security-hardened deployments.',
          'CDC / Replication: when enabled, Fabric creates a logical replication slot and consumes WAL events in real time. Requires PostgreSQL 10+ and wal_level = logical on the server.',
          'Enable WAL: on AWS RDS, set rds.logical_replication = 1 in the parameter group. On Supabase, it\'s enabled by default.',
        ],
        links: [
          { label: 'SSL modes', url: 'https://www.postgresql.org/docs/current/libpq-ssl.html' },
          { label: 'WAL replication setup', url: 'https://www.postgresql.org/docs/current/runtime-config-wal.html' },
        ],
      },
    },
  },

  MongoDB: {
    name: 'MongoDB', color: '#47A248', category: 'Data Warehouse',
    docsUrl: 'https://www.mongodb.com/docs/drivers/',
    fields: [
      { key: 'connectionString', label: 'Connection String', placeholder: 'mongodb+srv://user:pass@cluster.mongodb.net/', type: 'password', section: 'Connection', hint: 'Atlas: Connect → Drivers → copy the connection string' },
      { key: 'database',         label: 'Database',          placeholder: 'fabric_db',                                    type: 'text',     section: 'Connection', hint: 'MongoDB database name (not the cluster name)' },
      { key: 'collection',       label: 'Default Collection',placeholder: 'events',                                       type: 'text',     section: 'Connection', hint: 'Primary collection to read from; can query others at runtime' },
      { key: 'authSource',       label: 'Auth Source',       placeholder: 'admin',                                        type: 'text',     section: 'Authentication', hint: 'Database where the user is created; usually "admin"' },
      { key: 'tlsEnabled',       label: 'TLS',               placeholder: '', type: 'select', options: ['true','false'],  section: 'Authentication', hint: 'Always true for MongoDB Atlas and most cloud deployments' },
      { key: 'cdcEnabled',       label: 'Change Streams',    placeholder: '', type: 'select', options: ['false','true'],  section: 'Options', hint: 'true = use Change Streams for real-time document capture (requires replica set)' },
    ],
    guide: {
      Connection: {
        overview: 'The MongoDB connection string encodes host, credentials, and options in a single URI. Atlas provides it ready-to-paste.',
        steps: [
          'For MongoDB Atlas: log into cloud.mongodb.com → your cluster → Connect → Drivers → Node.js. Copy the connection string.',
          'Replace <password> in the string with your database user\'s password.',
          'The string looks like: mongodb+srv://username:password@cluster0.abc12.mongodb.net/?retryWrites=true',
          'For self-hosted MongoDB: format is mongodb://username:password@host:27017/database',
          'For a replica set: mongodb://host1:27017,host2:27017,host3:27017/db?replicaSet=rs0',
        ],
        links: [
          { label: 'MongoDB Atlas', url: 'https://cloud.mongodb.com' },
          { label: 'Connection string reference', url: 'https://www.mongodb.com/docs/manual/reference/connection-string/' },
        ],
      },
      Authentication: {
        overview: 'Atlas uses database users (not Atlas account users). Create one with minimal privileges.',
        steps: [
          'In Atlas: Database Access → Add New Database User.',
          'Choose "Password" auth method. Set a strong password.',
          'Built-in Role: choose "Read Only" for extraction, or "Atlas Admin" for full access.',
          'Restrict to a specific database: choose "Restrict access to specific databases" → add your database.',
          'Auth Source is typically "admin" — this is where Atlas stores user documents.',
          'TLS is always enabled for Atlas (the +srv URI includes it implicitly).',
        ],
        links: [
          { label: 'Atlas database users', url: 'https://www.mongodb.com/docs/atlas/security-add-mongodb-users/' },
        ],
      },
      Options: {
        overview: 'Change Streams enable real-time CDC for MongoDB collections without polling.',
        steps: [
          'Change Streams require a replica set or sharded cluster (Atlas always uses replica sets).',
          'When enabled, Fabric opens a change stream on the collection and processes insert/update/delete events in real time.',
          'For self-hosted: ensure the deployment is a replica set: rs.initiate(). Standalone mongod does not support change streams.',
          'Change streams require MongoDB 3.6+; for full document updates use MongoDB 4.0+.',
        ],
        links: [
          { label: 'Change Streams', url: 'https://www.mongodb.com/docs/manual/changeStreams/' },
        ],
      },
    },
  },

  'REST API': {
    name: 'REST API', color: '#10B981', category: 'Data Warehouse',
    docsUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTTP',
    fields: [
      { key: 'baseUrl',     label: 'Base URL',         placeholder: 'https://api.example.com/v2', type: 'text',     section: 'Endpoint',       hint: 'Root URL; individual resource paths are appended at runtime' },
      { key: 'authType',    label: 'Auth Type',        placeholder: '', type: 'select', options: ['None','API Key','Bearer Token','Basic Auth','OAuth 2.0'], section: 'Authentication', hint: 'How Fabric authenticates to this API' },
      { key: 'apiKey',      label: 'API Key / Token',  placeholder: 'your-api-key-or-token',       type: 'password', section: 'Authentication', hint: 'For API Key and Bearer Token auth types' },
      { key: 'apiKeyHeader',label: 'Key Header Name',  placeholder: 'X-API-Key or Authorization',  type: 'text',     section: 'Authentication', hint: 'Header name for the API key; defaults to "X-API-Key"' },
      { key: 'username',    label: 'Username',         placeholder: 'api-user',                    type: 'text',     section: 'Authentication', hint: 'For Basic Auth only' },
      { key: 'password',    label: 'Password',         placeholder: '••••••••',                    type: 'password', section: 'Authentication', hint: 'For Basic Auth only' },
      { key: 'rateLimit',   label: 'Rate Limit (req/min)', placeholder: '60',                      type: 'number',   section: 'Behaviour',      hint: 'Fabric will throttle requests to stay under this limit' },
      { key: 'pagination',  label: 'Pagination Style', placeholder: '', type: 'select', options: ['None','page/per_page','cursor','offset/limit','Link header'], section: 'Behaviour', hint: 'How the API paginates large result sets' },
      { key: 'dataPath',    label: 'Data JSON Path',   placeholder: 'data or results or items',    type: 'text',     section: 'Behaviour',      hint: 'JSON key containing the records array in the response' },
    ],
    guide: {
      Endpoint: {
        overview: 'Fabric can extract from any REST API. The Base URL is the common prefix; endpoints are configured per extraction job.',
        steps: [
          'Set the Base URL to the API root (e.g. https://api.stripe.com/v1 or https://api.github.com).',
          'Fabric appends the resource path at extraction time (e.g. /charges or /repos/{owner}/{repo}/issues).',
          'Check the API\'s documentation for the base URL — it\'s usually listed in the "Getting Started" section.',
          'For APIs with versioning: include the version in the base URL (e.g. /v2/) rather than adding it per request.',
        ],
        links: [
          { label: 'HTTP methods reference', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods' },
        ],
      },
      Authentication: {
        overview: 'Most APIs require one of four auth styles. Check the API documentation to determine which.',
        steps: [
          'API Key: the most common pattern. Set Auth Type to "API Key", paste the key, and set the header name (e.g. X-API-Key, api-key, or Authorization).',
          'Bearer Token: set Auth Type to "Bearer Token" and paste the token. Fabric sends: Authorization: Bearer <token>.',
          'Basic Auth: set username and password. Fabric sends: Authorization: Basic base64(user:password).',
          'OAuth 2.0: currently requires a pre-generated access token. Set Auth Type to "Bearer Token" and paste the OAuth access token.',
          'Where to find your API key: usually in the developer portal or settings of the service (e.g. Stripe Dashboard → Developers → API Keys).',
        ],
        links: [
          { label: 'Auth schemes', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication' },
          { label: 'OAuth 2.0', url: 'https://oauth.net/2/' },
        ],
      },
      Behaviour: {
        overview: 'Rate limiting and pagination settings prevent Fabric from hitting API limits or missing data.',
        steps: [
          'Rate Limit: check the API docs for the requests-per-minute cap and set it here. Fabric queues requests to stay under this limit.',
          'Pagination: most APIs paginate large datasets. Common styles: page+per_page (?page=2&per_page=100), cursor-based (?cursor=abc123), offset+limit (?offset=200&limit=100).',
          'Data JSON Path: if the API returns { "data": [...] }, set this to "data". If it returns { "results": { "items": [...] } }, set it to "results.items".',
          'Leave Data JSON Path blank if the root of the response is the array.',
        ],
        links: [
          { label: 'REST pagination patterns', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests' },
        ],
      },
    },
  },

  'Google Cloud Storage': {
    name: 'Google Cloud Storage', color: '#4285F4', category: 'File Source',
    docsUrl: 'https://cloud.google.com/storage/docs',
    fields: [
      { key: 'projectId',         label: 'GCP Project ID',        placeholder: 'my-gcp-project',                     type: 'text',     section: 'Storage',        hint: 'GCP Console header → Project ID (not display name)' },
      { key: 'bucket',            label: 'Bucket Name',           placeholder: 'my-fabric-bucket',                   type: 'text',     section: 'Storage',        hint: 'Cloud Storage → Buckets → your bucket name' },
      { key: 'prefix',            label: 'Object Prefix',         placeholder: 'exports/daily/',                     type: 'text',     section: 'Storage',        hint: 'Virtual folder path; leave blank to scan entire bucket' },
      { key: 'serviceAccountKey', label: 'Service Account (JSON)',placeholder: '{"type":"service_account"…}',        type: 'textarea', section: 'Authentication', hint: 'IAM → Service Accounts → Keys → Add Key → JSON' },
      { key: 'fileFormat',        label: 'File Format',           placeholder: '', type: 'select', options: ['CSV','JSON','Parquet','Avro','TSV'], section: 'Format', hint: 'Primary format of objects in the bucket' },
      { key: 'compression',       label: 'Compression',           placeholder: '', type: 'select', options: ['none','gzip','snappy','zstd'], section: 'Format', hint: 'Auto-detected from extension; override if needed' },
    ],
    guide: {
      Storage: {
        overview: 'Google Cloud Storage (GCS) is GCP\'s object store. Fabric reads objects from a bucket using the Storage API.',
        steps: [
          'Create a bucket: GCP Console → Cloud Storage → Buckets → Create.',
          'Choose a globally unique name, select your region, and set storage class (Standard for active data).',
          'Set the Prefix to limit which objects Fabric reads (e.g. exports/2024/ reads only objects under that path).',
          'Enable Versioning if you need point-in-time access to older file versions.',
        ],
        links: [
          { label: 'GCS Console', url: 'https://console.cloud.google.com/storage' },
          { label: 'Bucket naming', url: 'https://cloud.google.com/storage/docs/naming-buckets' },
        ],
      },
      Authentication: {
        overview: 'A service account with Storage Object Viewer role gives read-only access to the bucket.',
        steps: [
          'GCP Console → IAM & Admin → Service Accounts → Create Service Account.',
          'Name it "fabric-gcs-reader", click Create.',
          'Grant role: "Storage Object Viewer" (read-only) or "Storage Object Admin" (read+write).',
          'Click the service account → Keys → Add Key → Create new key → JSON.',
          'A .json file downloads. Open it and paste the entire JSON into the Service Account field.',
        ],
        links: [
          { label: 'Service account keys', url: 'https://cloud.google.com/iam/docs/keys-create-delete' },
          { label: 'GCS IAM roles', url: 'https://cloud.google.com/storage/docs/access-control/iam-roles' },
        ],
      },
      Format: {
        overview: 'Specify the file format Fabric should use when reading objects from the bucket.',
        steps: [
          'Parquet + Snappy: most efficient for analytical pipelines. Widely used with BigQuery and Dataflow.',
          'CSV + gzip: standard for exports from BigQuery, Cloud SQL, or external tools.',
          'Avro: common for Pub/Sub message capture and Dataflow pipelines.',
          'Compression is usually auto-detected from the file extension. Use the override only if files lack a proper extension.',
        ],
        links: [
          { label: 'GCS data formats', url: 'https://cloud.google.com/bigquery/docs/loading-data-cloud-storage-csv' },
        ],
      },
    },
  },

  SFTP: {
    name: 'SFTP', color: '#6366F1', category: 'File Source',
    docsUrl: 'https://www.ssh.com/academy/ssh/sftp',
    fields: [
      { key: 'host',         label: 'Host',           placeholder: 'sftp.example.com',          type: 'text',     section: 'Connection',     hint: 'SFTP server hostname or IP address' },
      { key: 'port',         label: 'Port',           placeholder: '22',                        type: 'number',   section: 'Connection',     hint: 'Default SFTP port is 22' },
      { key: 'remotePath',   label: 'Remote Path',    placeholder: '/data/exports/',            type: 'text',     section: 'Connection',     hint: 'Absolute path on the remote server to read files from' },
      { key: 'username',     label: 'Username',       placeholder: 'fabric-sftp',               type: 'text',     section: 'Authentication', hint: 'SFTP login username' },
      { key: 'authMethod',   label: 'Auth Method',    placeholder: '', type: 'select', options: ['password','private-key'], section: 'Authentication', hint: 'Private key is more secure; password auth may be blocked by some servers' },
      { key: 'password',     label: 'Password',       placeholder: '••••••••',                  type: 'password', section: 'Authentication', hint: 'Used when Auth Method is "password"' },
      { key: 'privateKey',   label: 'Private Key (PEM)', placeholder: '-----BEGIN OPENSSH PRIVATE KEY-----', type: 'textarea', section: 'Authentication', hint: 'Paste the contents of your id_rsa or id_ed25519 private key' },
      { key: 'filePattern',  label: 'File Pattern',   placeholder: '*.csv',                     type: 'text',     section: 'Connection',     hint: 'Glob pattern to filter files in the remote path' },
    ],
    guide: {
      Connection: {
        overview: 'SFTP (SSH File Transfer Protocol) provides secure file access over SSH. Nearly every Unix server supports it.',
        steps: [
          'Get the SFTP host and port from your server admin or cloud provider (e.g. AWS Transfer Family, Azure SFTP).',
          'For AWS Transfer Family: AWS Console → AWS Transfer Family → your server → Endpoint → copy the endpoint.',
          'For Azure Blob SFTP: Storage account → SFTP → Server endpoint.',
          'Remote Path: the directory on the server containing your files (e.g. /home/uploads/exports/).',
          'Use File Pattern to filter — e.g. daily_*.csv only processes files matching that pattern.',
        ],
        links: [
          { label: 'AWS Transfer Family', url: 'https://docs.aws.amazon.com/transfer/latest/userguide/getting-started.html' },
          { label: 'Azure Blob SFTP', url: 'https://learn.microsoft.com/en-us/azure/storage/blobs/secure-file-transfer-protocol-support' },
        ],
      },
      Authentication: {
        overview: 'Private key authentication is strongly preferred over passwords for automated access.',
        steps: [
          'Generate a key pair on your local machine: ssh-keygen -t ed25519 -C "fabric-sftp"',
          'Add the public key (~/.ssh/id_ed25519.pub) to the server\'s authorized_keys: ssh-copy-id -i ~/.ssh/id_ed25519.pub user@sftp-host',
          'Paste the private key contents (the entire file including BEGIN/END lines) into the Private Key field.',
          'For AWS Transfer Family: create a user → upload the public key → Fabric uses the private key.',
          'For password auth: enable PasswordAuthentication in the server\'s sshd_config (may already be disabled for security).',
        ],
        links: [
          { label: 'SSH key generation', url: 'https://www.ssh.com/academy/ssh/keygen' },
          { label: 'authorized_keys', url: 'https://www.ssh.com/academy/ssh/authorized-keys' },
        ],
      },
    },
  },

  Salesforce: {
    name: 'Salesforce', color: '#00A1E0', category: 'Data Warehouse',
    docsUrl: 'https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/',
    fields: [
      { key: 'instanceUrl',   label: 'Instance URL',     placeholder: 'https://myorg.my.salesforce.com', type: 'text',     section: 'Connection',     hint: 'Your Salesforce org URL from the browser address bar' },
      { key: 'apiVersion',    label: 'API Version',      placeholder: 'v59.0',                           type: 'text',     section: 'Connection',     hint: 'Use the latest stable version; check Setup → Apex → API' },
      { key: 'authFlow',      label: 'Auth Flow',        placeholder: '', type: 'select', options: ['Username+Password','OAuth 2.0 JWT','Connected App OAuth'], section: 'Authentication', hint: 'Username+Password is simplest for server-to-server' },
      { key: 'username',      label: 'Salesforce Username', placeholder: 'etl@mycompany.com',            type: 'text',     section: 'Authentication', hint: 'Full Salesforce login email of the API user' },
      { key: 'password',      label: 'Password + Security Token', placeholder: 'passwordSECURITYTOKEN', type: 'password', section: 'Authentication', hint: 'Concatenate your password and security token (no space): e.g. MyPass123ABC123xyz' },
      { key: 'clientId',      label: 'Connected App Client ID',    placeholder: '3MVG9...',              type: 'text',     section: 'Authentication', hint: 'From App Manager → your Connected App → Consumer Key' },
      { key: 'clientSecret',  label: 'Connected App Secret',       placeholder: 'secret…',              type: 'password', section: 'Authentication', hint: 'From App Manager → your Connected App → Consumer Secret' },
    ],
    guide: {
      Connection: {
        overview: 'Salesforce exposes all data via its REST and Bulk APIs. A Connected App is required for production integrations.',
        steps: [
          'Instance URL: the URL you see in the browser when logged in (e.g. https://mycompany.my.salesforce.com). Do not use the generic login.salesforce.com.',
          'For sandbox orgs: the URL contains "sandbox" (e.g. https://mycompany--sandbox.sandbox.my.salesforce.com).',
          'API Version: find the latest at Setup → Apex → API Reference. Use v59.0 or newer.',
          'For Developer Edition (free): sign up at developer.salesforce.com/signup to get a free Salesforce instance for testing.',
        ],
        links: [
          { label: 'Salesforce Developer Signup', url: 'https://developer.salesforce.com/signup' },
          { label: 'REST API docs', url: 'https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/' },
        ],
      },
      Authentication: {
        overview: 'Username+Password flow is simplest; OAuth JWT is recommended for production headless integrations.',
        steps: [
          'Username + Password: use a dedicated API user (not your admin account). Append the Security Token to the password with no space.',
          'Find Security Token: in Salesforce, click your name → Settings → Reset My Security Token. It\'s emailed to you.',
          'Create a Connected App: Setup → App Manager → New Connected App. Enable OAuth, add a callback URL (https://localhost), select scopes (api, refresh_token).',
          'Copy the Consumer Key and Consumer Secret from the Connected App to the Client ID / Secret fields.',
          'For IP whitelisting: Setup → Network Access → add Fabric\'s IP to Trusted IP Ranges, or set the Connected App IP Relaxation to "Relax IP restrictions".',
        ],
        links: [
          { label: 'Connected Apps', url: 'https://help.salesforce.com/s/articleView?id=sf.connected_app_overview.htm' },
          { label: 'API user setup', url: 'https://help.salesforce.com/s/articleView?id=sf.admin_userprofiles.htm' },
        ],
      },
    },
  },

  'Google Sheets': {
    name: 'Google Sheets', color: '#34A853', category: 'Data Warehouse',
    docsUrl: 'https://developers.google.com/sheets/api/guides/concepts',
    fields: [
      { key: 'spreadsheetId', label: 'Spreadsheet ID',    placeholder: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms', type: 'text', section: 'Source', hint: 'The long ID in the Google Sheets URL between /d/ and /edit' },
      { key: 'sheetName',     label: 'Sheet / Tab Name',  placeholder: 'Sheet1',                                           type: 'text', section: 'Source', hint: 'The tab name at the bottom of the spreadsheet; default is "Sheet1"' },
      { key: 'range',         label: 'Cell Range',        placeholder: 'A1:Z1000 (optional)',                              type: 'text', section: 'Source', hint: 'Leave blank to read the entire sheet; or specify e.g. A1:E500' },
      { key: 'hasHeader',     label: 'First Row is Header',placeholder: '', type: 'select', options: ['true','false'],      section: 'Source', hint: 'true = first row contains column names' },
      { key: 'serviceAccountKey', label: 'Service Account (JSON)', placeholder: '{"type":"service_account"…}', type: 'textarea', section: 'Authentication', hint: 'GCP → IAM → Service Accounts → Keys → Add Key → JSON' },
    ],
    guide: {
      Source: {
        overview: 'Fabric reads Google Sheets via the Sheets API. You need the spreadsheet ID and a service account with access to it.',
        steps: [
          'Spreadsheet ID: open the sheet in your browser. The URL looks like: https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit. Copy the long alphanumeric ID.',
          'Sheet Name: the tab at the bottom of the spreadsheet. Case-sensitive.',
          'Range: use A1 notation (e.g. A1:E100). Leave blank to read all populated cells.',
          'After setting up the service account (next section), share the spreadsheet with the service account email: open the sheet → Share → paste the service account email (looks like name@project.iam.gserviceaccount.com) → Viewer role.',
        ],
        links: [
          { label: 'Sheets API reference', url: 'https://developers.google.com/sheets/api/reference/rest' },
          { label: 'A1 notation', url: 'https://developers.google.com/sheets/api/guides/concepts#cell' },
        ],
      },
      Authentication: {
        overview: 'A GCP service account with the Google Sheets API enabled is the standard approach for server-to-server access.',
        steps: [
          'Enable the API: GCP Console → APIs & Services → Library → search "Google Sheets API" → Enable.',
          'Create a service account: GCP Console → IAM & Admin → Service Accounts → Create Service Account. Name it "fabric-sheets".',
          'No IAM role needed at the GCP level — Sheets permissions are handled by sharing the spreadsheet.',
          'Generate a key: click the service account → Keys → Add Key → Create new key → JSON. Download the file.',
          'Paste the entire JSON contents into the Service Account field here.',
          'Share the spreadsheet with the service account email (found in the JSON as "client_email"). Give it "Viewer" access.',
        ],
        links: [
          { label: 'Sheets API auth', url: 'https://developers.google.com/sheets/api/guides/authorizing' },
          { label: 'Service account keys', url: 'https://cloud.google.com/iam/docs/keys-create-delete' },
        ],
      },
    },
  },

  Elasticsearch: {
    name: 'Elasticsearch', color: '#FEC514', category: 'Data Warehouse',
    docsUrl: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/rest-apis.html',
    fields: [
      { key: 'cloudId',    label: 'Elastic Cloud ID',  placeholder: 'deployment:dXMtY2Vu…',   type: 'text',     section: 'Connection',     hint: 'Elastic Cloud → deployment → Copy Cloud ID; leave blank for self-hosted' },
      { key: 'host',       label: 'Host (self-hosted)',placeholder: 'http://localhost:9200',   type: 'text',     section: 'Connection',     hint: 'Full URL including scheme and port; used when Cloud ID is blank' },
      { key: 'username',   label: 'Username',          placeholder: 'elastic',                type: 'text',     section: 'Authentication', hint: 'The built-in "elastic" superuser, or a custom role user' },
      { key: 'password',   label: 'Password',          placeholder: '••••••••',               type: 'password', section: 'Authentication', hint: 'Reset via: bin/elasticsearch-reset-password -u elastic' },
      { key: 'apiKey',     label: 'API Key (alt)',      placeholder: 'base64encodedkey==',     type: 'password', section: 'Authentication', hint: 'Alternative to username/password; create in Kibana → Stack Management → API Keys' },
      { key: 'indexName',  label: 'Index / Data Stream',placeholder: 'logs-* or fabric-events', type: 'text',   section: 'Query',          hint: 'Index name or pattern; supports wildcards (logs-*)' },
      { key: 'queryDsl',   label: 'Query DSL (JSON)',  placeholder: '{"match_all":{}}',        type: 'textarea', section: 'Query',         hint: 'Elasticsearch Query DSL; use {"match_all":{}} to read all documents' },
    ],
    guide: {
      Connection: {
        overview: 'Fabric connects to Elasticsearch via the REST API. Elastic Cloud uses a Cloud ID; self-hosted uses a direct URL.',
        steps: [
          'For Elastic Cloud: log into cloud.elastic.co → your deployment → click "Copy Cloud ID". Paste it into the Cloud ID field.',
          'For self-hosted / Docker: leave Cloud ID blank and set Host to http://localhost:9200 (or the server URL).',
          'For Docker: docker run -p 9200:9200 -e "discovery.type=single-node" elasticsearch:8.x',
          'Ensure port 9200 is reachable from Fabric\'s host.',
        ],
        links: [
          { label: 'Elastic Cloud', url: 'https://cloud.elastic.co' },
          { label: 'Docker install', url: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html' },
        ],
      },
      Authentication: {
        overview: 'Use either username/password or an API key. API keys are preferred for production as they can be scoped and revoked independently.',
        steps: [
          'Username/Password: the built-in "elastic" superuser works but has full access. Create a scoped user instead.',
          'In Kibana: Stack Management → Security → Users → Create user. Assign "monitor" + "read" built-in roles for read-only access.',
          'API Key: Kibana → Stack Management → API Keys → Create API key. Set a name and optional expiry.',
          'The API key value is shown once — copy it immediately. Encode as base64 for the header, or paste raw here.',
          'For self-hosted ES with no security: leave username/password blank (not recommended for production).',
        ],
        links: [
          { label: 'Kibana API Keys', url: 'https://www.elastic.co/guide/en/kibana/current/api-keys.html' },
          { label: 'Built-in roles', url: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/built-in-roles.html' },
        ],
      },
      Query: {
        overview: 'Specify which index to read from and optionally filter documents with a Query DSL expression.',
        steps: [
          'Index Name: the exact index name (e.g. orders) or a wildcard pattern (e.g. logs-2024-* for all 2024 logs).',
          'Data streams follow the same naming convention (e.g. logs-nginx.access-default).',
          'Query DSL: use {"match_all":{}} to read all documents. To filter: {"range":{"@timestamp":{"gte":"2024-01-01"}}}',
          'Fabric uses the Scroll API or Point In Time (PIT) for large result sets to avoid memory issues.',
          'For time-series data: add a date range filter in the Query DSL to extract only the records you need.',
        ],
        links: [
          { label: 'Query DSL', url: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html' },
          { label: 'Scroll API', url: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/scroll-api.html' },
        ],
      },
    },
  },
}
