import { useRef, useState, useEffect } from 'react'
import { Document, Page } from 'react-pdf'
import type { BBox } from '../types/ParsedSection'
import HighlightBox from './HighlightBox'

type Props = {
  pdfUrl: string
  pictures: any[]
  textsMap: Map<string, any>
  highlight?: { text: string; bbox: BBox } | null
  hoveredText?: string | null
  onPointClick?: (text: string, bbox: BBox) => void
  onPointHover?: (text: string | null) => void
  onHeightChange?: (height: number) => void
}

const PdfViewer = ({
  pdfUrl,
  pictures,
  textsMap,
  highlight,
  hoveredText,
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
              zIndex: 9999
            }}
            onMouseEnter={() => onPointHover?.(t.text)}
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

      {/* hoveredText 하이라이트 */}
      {hoveredText && (() => {
        const item = Array.from(textsMap.values()).find((t: any) => t.text === hoveredText)
        const bbox = item?.prov?.[0]?.bbox
        return bbox ? (
          <HighlightBox
            bbox={bbox}
            scale={scale}
            pdfHeight={pdfHeight}
          />
        ) : null
      })()}

      {/* 클릭된 highlight 하이라이트 */}
      {highlight && (
        <HighlightBox
          bbox={highlight.bbox}
          scale={scale}
          pdfHeight={pdfHeight}
        />
      )}
    </div>
  )
}

export default PdfViewer