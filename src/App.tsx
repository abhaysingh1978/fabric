import { useState, useCallback, useMemo, useEffect } from 'react'
import { COLORS } from '@lib/theme'
import { getMergedCategories } from '@lib/customFlows'
import { DEFAULT_MODEL } from '@data/models'
import { DEFAULT_ETL_CONFIG } from '@data/etlConfig'
import { ConfigModal } from '@components/config/ConfigModal'
import { TopNavBar } from '@components/nav/TopNavBar'
import { SubNavBar } from '@components/nav/SubNavBar'
import { ArchitectureBar } from '@components/shared/ArchitectureBar'
import { ErrorBoundary } from '@components/shared/ErrorBoundary'
import { DemoPanel } from '@panels/DemoPanel'
import { FlowManager } from '@components/flows/FlowManager'
import type { AIModel, ETLConfig } from '@types/index'

export default function App() {
  const [flowVersion, setFlowVersion] = useState(0)
  const allCategories = useMemo(() => getMergedCategories(), [flowVersion])

  const FIRST_CATEGORY = Object.keys(allCategories)[0]
  const FIRST_SUB = Object.keys(allCategories[FIRST_CATEGORY].sub)[0]

  const [category, setCategory] = useState(FIRST_CATEGORY)
  const [sub, setSub] = useState(FIRST_SUB)
  const [configOpen, setConfigOpen] = useState(false)
  const [showFlowManager, setShowFlowManager] = useState(false)
  const [model, setModel] = useState<AIModel>(DEFAULT_MODEL)
  const [etlConfig, setEtlConfig] = useState<ETLConfig>(DEFAULT_ETL_CONFIG)

  // If current category/sub is removed after a flow deletion, fall back
  useEffect(() => {
    if (!allCategories[category]) {
      const firstCat = Object.keys(allCategories)[0]
      setCategory(firstCat)
      setSub(Object.keys(allCategories[firstCat].sub)[0])
    } else if (!allCategories[category]?.sub[sub]) {
      setSub(Object.keys(allCategories[category].sub)[0])
    }
  }, [allCategories, category, sub])

  const cat = allCategories[category] ?? allCategories[Object.keys(allCategories)[0]]
  const subCases = cat.sub
  const activeCase = subCases[sub] ?? Object.values(subCases)[0]

  const handleSetCategory = useCallback((key: string) => {
    setCategory(key)
    setSub(Object.keys(getMergedCategories()[key]?.sub ?? {})[0] ?? '')
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

      {showFlowManager && (
        <FlowManager
          onClose={() => {
            setShowFlowManager(false)
            setFlowVersion(v => v + 1)
          }}
        />
      )}

      <TopNavBar
        category={category}
        setCategory={handleSetCategory}
        configOpen={configOpen}
        setConfigOpen={setConfigOpen}
        onManageFlows={() => setShowFlowManager(true)}
        model={model}
        categories={allCategories}
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
