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
  hoveredText?: string | null
  hovered?: { text: string; bbox: BBox } | null
  tables: any[]
  onPointClick?: (text: string, bbox: BBox) => void
  onPointHover?: (text: string | null, bbox?: BBox) => void
  onHeightChange?: (height: number) => void
}

const PdfViewer = ({
  pdfUrl,
  pictures,
  textsMap,
  highlight,
  hoveredText,
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
      containerRef.current.scrollTo({
        top: top - 50,
        behavior: 'smooth',
      })
    }
  }, [highlight, scale, pdfHeight])

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-y-scroll">
      {/* 텍스트 오버레이 (마우스 이벤트 감지용) */}
      {Array.from(textsMap.values()).map((t: any, i) => {
        const bbox = t.prov?.[0]?.bbox
        if (!bbox) return null
        return (
          <div
            key={i}
            className="absolute z-999"
            style={{
              left: bbox.l * scale,
              top: (pdfHeight - bbox.t) * scale,
              width: (bbox.r - bbox.l) * scale,
              height: (Math.abs(bbox.b - bbox.t) * scale) + 10,
              zIndex: 9999,
            }}
            onMouseEnter={() => onPointHover?.(t.text)}
            onMouseLeave={() => onPointHover?.(null)}
          />
        )
      })}
      {/* 테이블 셀 오버레이 (마우스 이벤트 감지용) */}
      {tables.flatMap((table, tableIdx) =>
        (table?.data?.table_cells || []).map((cell: any, i: number) => {
          const rawBbox = cell?.bbox
          if (!rawBbox) return null
          const bbox = normalizeBBox(rawBbox, pdfHeight)

          return (
            <div
              key={`table-${tableIdx}-cell-${i}`}
              className="absolute z-999"
              style={{
                left: bbox.l * scale,
                top: (pdfHeight - bbox.t) * scale,
                width: (bbox.r - bbox.l) * scale,
                height: (Math.abs(bbox.b - bbox.t) * scale),
                zIndex: 9999,
              }}
              onMouseEnter={() => onPointHover?.(cell.text, bbox)}
              onMouseLeave={() => onPointHover?.(null)}
            />
          )
        })
      )}

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

      {/* hoveredText 하이라이트 */}
      {hovered && (
        <HighlightBox
          bbox={hovered.bbox}
          scale={scale}
          pdfHeight={pdfHeight}
          type={'pdf'}
        />
      )}

      {/* 클릭된 highlight 하이라이트 */}
      {highlight && (
        <HighlightBox
          bbox={highlight.bbox}
          scale={scale}
          pdfHeight={pdfHeight}
          type={'json'}
        />
      )}
    </div>
  )
}

export default PdfViewer