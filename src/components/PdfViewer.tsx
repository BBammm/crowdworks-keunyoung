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
      const top = highlight.bbox.t * scale
      containerRef.current.scrollTo({
        top: pdfHeight - top - 50, // 좀 더 중앙을 위해 -50 계산.
        behavior: 'smooth',
      })
    }
  }, [highlight, scale, pdfHeight])

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-y-scroll">
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