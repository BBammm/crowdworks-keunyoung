import React from 'react';
import type { SectionBlock, TextBlock, TableBlock, BBox } from '../../types/ParsedSection'; // BBox 타입 임포트
import SectionTitle from './SectionTitle';
import TextBlockItem from './TextBlockItem';
import TableViewer from './TableViewer';
import GraphPointItem from './GraphPointItem';

type Props = {
  block: SectionBlock;
  onHighlight: (page: number, bbox: BBox) => void; // onHighlight 콜백 추가
  onClearHighlight: () => void; // onClearHighlight 콜백 추가
};

const SectionBlockRenderer = ({ block, onHighlight, onClearHighlight }: Props) => {
  switch (block.type) {
    case 'section_header':
      // SectionTitle 컴포넌트도 필요하다면 onHighlight/onClearHighlight를 받도록 수정해야 합니다.
      // 현재는 텍스트만 보여주므로 직접 처리합니다.
      const sectionTitleBlock = block as TextBlock;
      return (
        <SectionTitle
          block={sectionTitleBlock}
          onHighlight={() => onHighlight(sectionTitleBlock.page, sectionTitleBlock.bbox)}
          onClearHighlight={onClearHighlight}
        />
      );
    case 'text':
      const textBlock = block as TextBlock;
      return (
        <TextBlockItem
          block={textBlock}
          onHighlight={() => onHighlight(textBlock.page, textBlock.bbox)}
          onClearHighlight={onClearHighlight}
        />
      );
    case 'table':
      const tableBlock = block as TableBlock;
      return (
        <TableViewer
          block={tableBlock}
          onHighlight={onHighlight} // TableViewer 내에서 각 셀의 bbox를 전달해야 합니다.
          onClearHighlight={onClearHighlight}
        />
      );
    case 'graph_point':
      // GraphPointItem에 필요한 props를 전달합니다.
      return <GraphPointItem block={block as TextBlock} onHighlight={onHighlight} onClearHighlight={onClearHighlight} />;
    default:
      return null;
  }
};

export default SectionBlockRenderer;
