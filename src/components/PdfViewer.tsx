import { useRef, useState, useEffect } from 'react'
import { Document, Page } from 'react-pdf'
import type { BBox } from '../types/ParsedSection'
import GraphOverlay from './Graph/GraphOverlay'
import HighlightBox from './HighlightBox'

type Props = {
  pdfUrl: string
  pictures: any[]
  textsMap: Map<string, any>
  highlight?: { text: string; bbox: BBox } | null
  onPointClick?: (text: string, bbox: BBox) => void
}

const PdfViewer = ({
  pdfUrl,
  pictures,
  textsMap,
  highlight,
  onPointClick,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(800)
  const [scale, setScale] = useState(1)
  const [pdfHeight, setPdfHeight] = useState(1000)

  // container 크기 감지
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

  // 하이라이트 시 PDF 내 해당 위치로 스크롤 이동
  useEffect(() => {
    if (containerRef.current && highlight?.bbox) {
      const top = (pdfHeight - highlight.bbox.t) * scale
      containerRef.current.scrollTo({
        top: top - 40,
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
          }}
        />
      </Document>

      <GraphOverlay
        pictures={pictures}
        textsMap={textsMap}
        onPointClick={onPointClick}
        highlight={highlight}
        scale={scale}
        pdfHeight={pdfHeight}
      />

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