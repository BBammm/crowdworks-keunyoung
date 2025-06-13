import { useState } from 'react'
import PdfViewer from './components/PdfViewer'
import pdfFile from '/1.report.pdf'
import jsonData from './assets/data/1.report.json'
import { pdfjs } from 'react-pdf'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min?url'
import type { BBox } from './types/ParsedSection'
import JsonList from './components/JsonList'
import { useParsedSections } from './hooks/useParsedSections'

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc

function App() {
  const sections = useParsedSections()
  const raw = jsonData as any
  const pictures = raw.pictures || []

  const textsMap = new Map<string, any>()
  ;(raw.texts || []).forEach((t: any) => textsMap.set(t.self_ref, t))
  ;(raw.tables || []).forEach((table: any) => {
    table?.data?.table_cells?.forEach((cell: any) => {
      const patched = {
        ...cell,
        prov: cell.bbox ? [{ bbox: cell.bbox }] : undefined
      }
      textsMap.set(cell.text, patched)
    })
  })

  const [highlight, setHighlight] = useState<{ text: string; bbox: BBox } | null>(null)
  const [hoveredText, setHoveredText] = useState<string | null>(null)
  const [pdfHeight, setPdfHeight] = useState(1000)
  const [hovered, setHovered] = useState<{ text: string; bbox: BBox } | null>(null)

  return (
    <div className="flex h-screen w-screen flex-col sm:flex-row">
      <div className="w-full sm:w-1/2 h-1/2 sm:h-full border-r">
        <PdfViewer
          pdfUrl={pdfFile}
          pictures={pictures}
          textsMap={textsMap}
          highlight={highlight}
          hoveredText={hovered?.text}
          hovered={hovered}
          tables={raw.tables}
          onPointClick={(text, bbox) => setHighlight({ text, bbox })}
          onPointHover={(text, bbox) => {
            console.log('text = ',text);
            console.log('bbox = ',bbox);
            if (text) {
              if (bbox) setHovered({ text, bbox })
              else {
                // 일반 텍스트의 bbox는 textsMap에서 찾아서 직접 설정
                const t = Array.from(textsMap.values()).find((v) => v.text === text)
                const fallbackBbox = t?.prov?.[0]?.bbox
                console.log('t = ', t);
                console.log('fallbackBbox = ', fallbackBbox);
                if (fallbackBbox) setHovered({ text, bbox: fallbackBbox })
                else setHovered(null)
              }
            } else {
              setHovered(null)
            }
          }}
          onHeightChange={(h) => setPdfHeight(h)}
        />
      </div>
      <div className="w-full sm:w-1/2 h-1/2 sm:h-full overflow-y-auto p-4">
        <JsonList
          sections={sections}
          onTextClick={(text, bbox) => setHighlight({ text, bbox })}
          hoveredText={hoveredText}
          pdfHeight={pdfHeight}
        />
      </div>
    </div>
  )
}

export default App