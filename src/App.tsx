import { useState, useCallback, useMemo } from 'react'
import { COLORS } from '@lib/theme'
import { DEMOS } from '@data/usecases'
import { DEFAULT_MODEL } from '@data/models'
import { DEFAULT_ETL_CONFIG } from '@data/etlConfig'
import { ConfigModal } from '@components/config/ConfigModal'
import { TopNavBar } from '@components/nav/TopNavBar'
import { SubNavBar } from '@components/nav/SubNavBar'
import { ArchitectureBar } from '@components/shared/ArchitectureBar'
import { ErrorBoundary } from '@components/shared/ErrorBoundary'
import { DemoPanel } from '@panels/DemoPanel'
import type { AIModel, ETLConfig } from '@types/index'

const FIRST_CATEGORY = Object.keys(DEMOS)[0]
const FIRST_SUB = Object.keys(DEMOS[FIRST_CATEGORY].sub)[0]

export default function App() {
  const [category, setCategory] = useState(FIRST_CATEGORY)
  const [sub, setSub] = useState(FIRST_SUB)
  const [configOpen, setConfigOpen] = useState(false)
  const [model, setModel] = useState<AIModel>(DEFAULT_MODEL)
  const [etlConfig, setEtlConfig] = useState<ETLConfig>(DEFAULT_ETL_CONFIG)

  const cat = DEMOS[category]
  const subCases = cat.sub
  const activeCase = subCases[sub] ?? Object.values(subCases)[0]

  const handleSetCategory = useCallback((key: string) => {
    setCategory(key)
    setSub(Object.keys(DEMOS[key].sub)[0])
  }, [])

  const handleSetSub = useCallback((key: string) => {
    setSub(key)
  }, [])

  const gridBackground = useMemo(() => ({
    backgroundImage: `
      linear-gradient(${COLORS.border}55 1px, transparent 1px),
      linear-gradient(90deg, ${COLORS.border}55 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
  }), [])

  return (
    <div style={{
      fontFamily: 'monospace',
      background: COLORS.bg,
      minHeight: '100vh',
      color: COLORS.text,
      ...gridBackground,
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
        select option { background: ${COLORS.bgCard}; color: ${COLORS.text}; }
        input:focus { border-color: ${COLORS.accent} !important; }
      `}</style>

      <ConfigModal
        open={configOpen}
        onClose={() => setConfigOpen(false)}
        model={model}
        setModel={setModel}
        etlConfig={etlConfig}
        setEtlConfig={setEtlConfig}
      />

      <TopNavBar
        category={category}
        setCategory={handleSetCategory}
        configOpen={configOpen}
        setConfigOpen={setConfigOpen}
        model={model}
        categories={DEMOS}
      />

      <SubNavBar
        category={category}
        sub={sub}
        setSub={handleSetSub}
        subCases={subCases}
        categoryColor={cat.color}
      />

      <ArchitectureBar activeCase={activeCase} etlConfig={etlConfig} model={model} />

      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <ErrorBoundary>
          <DemoPanel
            key={`${category}-${sub}`}
            caseKey={activeCase.caseKey}
            useCase={activeCase}
            model={model}
            etlConfig={etlConfig}
          />
        </ErrorBoundary>
      </div>
    </div>
  )
}
