import { useState } from 'react'
import PdfViewer from './components/PdfViewer'
import pdfFile from '/1.report.pdf'
import jsonData from './assets/data/1.report.json'
import { pdfjs } from 'react-pdf'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min?url'
import type { BBox } from './types/ParsedSection'
import JsonList from './components/JsonList'
import { useParsedSections } from './hooks/useParsedSections'
import { normalizeBBox } from './uitils/bboxUtils'

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc

function App() {
  const sections = useParsedSections()
  const raw = jsonData as any
  const pictures = raw.pictures || []

  const textsMap = new Map<string, any>()
  ;(raw.texts || []).forEach((t: any) => {
    textsMap.set(`text:${t.self_ref}`, t)
  })
  ;(raw.tables || []).forEach((table: any, tableIdx: number) => {
    table?.data?.table_cells?.forEach((cell: any, cellIdx: number) => {
      const patched = {
        ...cell,
        prov: cell.bbox ? [{ bbox: cell.bbox }] : undefined,
      }
      textsMap.set(`table:${cell.text}-${tableIdx}-${cellIdx}`, patched)
    })
  })

  const [highlight, setHighlight] = useState<{ text: string; bbox: BBox } | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [pdfHeight, setPdfHeight] = useState(1000)

  const hovered = hoveredId
    ? (() => {
        const item = textsMap.get(hoveredId)
        const bbox = item?.prov?.[0]?.bbox
        return bbox ? { text: item.text, bbox } : null
      })()
    : null

  return (
    <div className="flex h-screen w-screen flex-col sm:flex-row">
      <div className="w-full sm:w-1/2 h-1/2 sm:h-full border-r">
        <PdfViewer
          pdfUrl={pdfFile}
          pictures={pictures}
          textsMap={textsMap}
          highlight={highlight}
          hovered={hovered}
          hoveredId={hoveredId}
          tables={raw.tables}
          onPointClick={(text, bbox) => setHighlight({ text, bbox })}
          onPointHover={(id) => setHoveredId(id)}
          onHeightChange={(h) => setPdfHeight(h)}
        />
      </div>
      <div className="w-full sm:w-1/2 h-1/2 sm:h-full overflow-y-auto p-4">
        <JsonList
          sections={sections}
          onTextClick={(text, bbox) => {
            const normalized = normalizeBBox(bbox, pdfHeight)
            setHighlight({ text, bbox: normalized })
          }}
          hoveredId={hoveredId}
          hovered={hovered}
          pdfHeight={pdfHeight}
        />
      </div>
    </div>
  )
}

export default App