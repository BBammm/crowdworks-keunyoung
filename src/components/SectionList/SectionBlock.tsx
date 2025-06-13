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
  console.log(block)
  const isActive = hovered
    ? (
        hovered.bbox.l === block.bbox.l &&
        hovered.bbox.t === block.bbox.t &&
        hovered.bbox.r === block.bbox.r &&
        hovered.bbox.b === block.bbox.b
      )
    : false;

  switch (block.type) {
    case 'section_header':
      return (
        <SectionTitle
          block={block as TextBlock}
          onClick={() => onTextClick(block.text, block.bbox)}
          isHovered={isActive}
        />
      );
    case 'text':
      return (
        <TextBlockItem
          block={block as TextBlock}
          onClick={() => onTextClick(block.text, block.bbox)}
          isHovered={isActive}
        />
      );
    case 'table':
      return (
        <TableViewer
          block={block as TableBlock}
          onTextClick={onTextClick}
          hovered={hovered}
          pdfHeight={pdfHeight}
        />
      );
    case 'graph_point':
      return (
        <GraphPointItem
          block={block as TextBlock}
          onClick={() => onTextClick(block.text, block.bbox)}
          isHovered={isActive}
        />
      );
    default:
      return null;
  }
};

export default SectionBlockRenderer;