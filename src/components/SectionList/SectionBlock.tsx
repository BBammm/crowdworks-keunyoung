import React, { useRef, useEffect } from 'react'
import type { SectionBlock, TextBlock, TableBlock, BBox } from '../../types/ParsedSection';
import SectionTitle from './SectionTitle';
import TextBlockItem from './TextBlockItem';
import TableViewer from './TableViewer';
import GraphPointItem from './GraphPointItem';

type Props = {
  block: SectionBlock;
  onTextClick: (text: string, bbox: BBox) => void;
  hoveredId?: string | null;
  hovered?: { text: string; bbox: BBox } | null;
  pdfHeight: number;
};

const SectionBlockRenderer = ({ block, onTextClick, hoveredId, hovered, pdfHeight }: Props) => {
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

  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [isActive])

  let content: React.ReactNode
  switch (block.type) {
    case 'section_header':
      content = (
        <SectionTitle
          block={block as TextBlock}
          onClick={() => onTextClick(block.text, block.bbox)}
          isHovered={isActive}
        />
      )
      break

    case 'text':
      content = (
        <TextBlockItem
          block={block as TextBlock}
          onClick={() => onTextClick(block.text, block.bbox)}
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
        />
      )
      break

    case 'graph_point':
      content = (
        <GraphPointItem
          block={block as TextBlock}
          onClick={() => onTextClick(block.text, block.bbox)}
          isHovered={isActive}
        />
      )
      break

    default:
      content = null
  }
  return (
    <div ref={ref}>
      {content}
    </div>
  )
};

export default SectionBlockRenderer;