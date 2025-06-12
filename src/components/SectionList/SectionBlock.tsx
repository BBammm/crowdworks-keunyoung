import type { SectionBlock, TextBlock, TableBlock, BBox } from '../../types/ParsedSection';
import SectionTitle from './SectionTitle';
import TextBlockItem from './TextBlockItem';
import TableViewer from './TableViewer';
import GraphPointItem from './GraphPointItem';

type Props = {
  block: SectionBlock;
  onTextClick: (text: string, bbox: BBox) => void;
  hoveredText?: string | null;
  pdfHeight: number;
};

const SectionBlockRenderer = ({ block, onTextClick, hoveredText, pdfHeight }: Props) => {
  switch (block.type) {
    case 'section_header':
      return (
        <SectionTitle
          block={block as TextBlock}
          onClick={() => onTextClick(block.text, block.bbox)}
          isHovered={hoveredText === block.text}
        />
      );
    case 'text':
      return (
        <TextBlockItem
          block={block as TextBlock}
          onClick={() => onTextClick(block.text, block.bbox)}
          isHovered={hoveredText === block.text}
        />
      );
    case 'table':
      return (
        <TableViewer
          block={block as TableBlock}
          onTextClick={onTextClick}
          isHovered={hoveredText === block.text} // ✅ 통일된 방식
          pdfHeight={pdfHeight}
        />
      );
    case 'graph_point':
      return (
        <GraphPointItem
          block={block as TextBlock}
          onClick={() => onTextClick(block.text, block.bbox)}
          isHovered={hoveredText === block.text}
        />
      );
    default:
      return null;
  }
};

export default SectionBlockRenderer;