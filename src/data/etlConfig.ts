import type { ETLConfig } from '@types/index'

export const ETL_OPTIONS: Record<keyof ETLConfig, string[]> = {
  batchSize:        ['10000', '50000', '100000', '500000', '1000000'],
  refreshInterval:  ['5', '15', '30', '60', '300'],
  parallelAgents:   ['2', '4', '8', '16', '32'],
  vectorStore:      ['Pinecone', 'Weaviate', 'Qdrant', 'Chroma', 'pgvector'],
  dataWarehouse:    ['Snowflake', 'BigQuery', 'Redshift', 'Databricks', 'DuckDB',
                     'MySQL', 'SQL Server', 'Oracle', 'DB2', 'Sybase'],
  streamProcessor:  ['Kafka', 'Pulsar', 'Kinesis', 'Flink', 'Spark Streaming'],
}

export const DEFAULT_ETL_CONFIG: ETLConfig = {
  batchSize:       100000,
  refreshInterval: 30,
  parallelAgents:  8,
  vectorStore:     'Pinecone',
  dataWarehouse:   'Snowflake',
  streamProcessor: 'Kafka',
}
