import { useRef, useState, useEffect } from 'react'
import { Document, Page } from 'react-pdf'
import type { BBox } from '../types/ParsedSection'
import HighlightBox from './HighlightBox'
import { normalizeBBox } from '../uitils/bboxUtils'

type Props = {
  pdfUrl: string
  pictures: any[]
  textsMap: Map<string, any>
  highlight?: { text: string; bbox: BBox } | null
  hoveredId?: string | null
  hovered?: { text: string; bbox: BBox } | null
  tables: any[]
  onPointClick?: (text: string, bbox: BBox) => void
  onPointHover?: (id: string | null) => void
  onHeightChange?: (height: number) => void
}

const PdfViewer = ({
  pdfUrl,
  pictures,
  textsMap,
  highlight,
  hoveredId,
  hovered,
  tables,
  onPointClick,
  onPointHover,
  onHeightChange,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(800)
  const [scale, setScale] = useState(1)
  const [pdfHeight, setPdfHeight] = useState(1000)

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        setContainerWidth(width)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (containerRef.current && highlight?.bbox) {
      const top = pdfHeight - highlight.bbox.t * scale
      const normalized = normalizeBBox(highlight.bbox, pdfHeight)
      containerRef.current.scrollTo({
        top: (pdfHeight - normalized.t) * scale - 150,
        behavior: 'smooth',
      })
    }
  }, [highlight, scale, pdfHeight])

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-y-scroll">
      {/* 텍스트 오버레이 */}
      {Array.from(textsMap.entries()).map(([id, t]) => {
        const bbox = t.prov?.[0]?.bbox
        if (!bbox) return null
        const normalized = normalizeBBox(bbox, pdfHeight)

        return (
          <div
            key={id}
            className="absolute z-999"
            style={{
              left: normalized.l * scale,
              top: (pdfHeight - normalized.t) * scale,
              width: (normalized.r - normalized.l) * scale,
              height: (Math.abs(normalized.b - normalized.t) * scale) + 10,
              zIndex: 9999,
            }}
            onMouseEnter={() => onPointHover?.(id)}
            onMouseLeave={() => onPointHover?.(null)}
          />
        )
      })}

      {/* PDF 렌더링 */}
      <Document file={pdfUrl}>
        <Page
          pageNumber={1}
          width={containerWidth}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          onRenderSuccess={(page) => {
            const view = page.view
            const originalWidth = view[2] - view[0]
            const originalHeight = view[3] - view[1]
            setScale(containerWidth / originalWidth)
            setPdfHeight(originalHeight)
            onHeightChange?.(originalHeight)
          }}
        />
      </Document>

      {/* hovered 하이라이트 */}
      {hovered && (
        <HighlightBox
          bbox={normalizeBBox(hovered.bbox, pdfHeight)}
          scale={scale}
          pdfHeight={pdfHeight}
          type="pdf"
        />
      )}

      {/* 클릭된 highlight 하이라이트 */}
      {highlight && (
        <HighlightBox
          bbox={normalizeBBox(highlight.bbox, pdfHeight)}
          scale={scale}
          pdfHeight={pdfHeight}
          type="json"
        />
      )}
    </div>
  )
}

export default PdfViewer