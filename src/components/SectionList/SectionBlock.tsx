import React, { useRef, useEffect } from 'react'
import type { SectionBlock, TextBlock, TableBlock, BBox } from '../../types/ParsedSection'
import SectionTitle from './SectionTitle'
import TextBlockItem from './TextBlockItem'
import TableViewer from './TableViewer'
import GraphPointItem from './GraphPointItem'

type Props = {
  block: SectionBlock
  onTextClick: (text: string, bbox: BBox, id: string) => void
  hovered?: { text: string; bbox: BBox } | null
  selectedId?: string | null
  onSelect: (id: string) => void
  pdfHeight: number
}

const SectionBlockRenderer: React.FC<Props> = ({
  block,
  onTextClick,
  hovered,
  selectedId,
  onSelect,
  pdfHeight,
}) => {
  let isActive = false
  if (hovered) {
    const hb = hovered.bbox
    const bb = block.bbox
    if (block.type === 'table') {
      isActive =
        hb.l >= bb.l &&
        hb.r <= bb.r &&
        hb.b >= bb.b &&
        hb.t <= bb.t
    } else {
      isActive =
        hb.l === bb.l &&
        hb.t === bb.t &&
        hb.r === bb.r &&
        hb.b === bb.b
    }
  }

  const isSelected = selectedId === block.id

  const wrapperClass = [
    isActive ? 'bg-yellow-100' : null,
    block.type !== 'table' && isSelected ? 'bg-cyan-200' : null,
  ]
  .filter(Boolean)
  .join(' ')

  const clickAndSelect = (text: any, bbox: any) => {
    onTextClick(text, bbox, block.id)
    onSelect(block.id)
  }

  // 스크롤용 ref
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [isActive])

  // 실제 렌더링할 콘텐츠 결정
  let content: React.ReactNode
  switch (block.type) {
    case 'section_header':
      content = (
        <SectionTitle
          block={block as TextBlock}
          onClick={() => clickAndSelect(block.text, block.bbox)}
          isHovered={isActive}
        />
      )
      break

    case 'text':
      content = (
        <TextBlockItem
          block={block as TextBlock}
          onClick={() => clickAndSelect(block.text, block.bbox)}
          isHovered={isActive}
        />
      )
      break

    case 'graph_point':
      content = (
        <GraphPointItem
          block={block as TextBlock}
          onClick={() => clickAndSelect(block.text, block.bbox)}
          isHovered={isActive}
        />
      )
      break

    case 'table':
      content = (
        <TableViewer
          block={block as TableBlock}
          onTextClick={onTextClick}
          hovered={hovered}
          pdfHeight={pdfHeight}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      )
      break

    default:
      content = null
  }

  return (
    <div ref={ref} className={wrapperClass.trim()}>
      {content}
    </div>
  )
}

export default SectionBlockRenderer