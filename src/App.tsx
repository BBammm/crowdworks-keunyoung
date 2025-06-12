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

  const [highlight, setHighlight] = useState<{ text: string; bbox: BBox } | null>(null)
  const [hoveredText, setHoveredText] = useState<string | null>(null)
  const [pdfHeight, setPdfHeight] = useState(1000)

  return (
    <div className="flex h-screen w-screen flex-col sm:flex-row">
      <div className="w-full sm:w-1/2 h-1/2 sm:h-full border-r">
        <PdfViewer
          pdfUrl={pdfFile}
          pictures={pictures}
          textsMap={textsMap}
          highlight={highlight}
          hoveredText={hoveredText}
          onPointClick={(text, bbox) => setHighlight({ text, bbox })}
          onPointHover={(text) => setHoveredText(text)}
          onHeightChange={(h) => setPdfHeight(h)} // ✅ 여기서 전달
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