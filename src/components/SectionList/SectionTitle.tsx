import React from 'react';
import type { TextBlock, BBox } from '../../types/ParsedSection';

interface SectionTitleProps {
  block: TextBlock; // section_header 타입의 TextBlock
  onHighlight: (page: number, bbox: BBox) => void;
  onClearHighlight: () => void;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ block, onHighlight, onClearHighlight }) => {
  return (
    <h3
      className="text-xl font-semibold mb-3 text-blue-700"
      onMouseEnter={() => onHighlight(block.page, block.bbox)}
      onMouseLeave={onClearHighlight}
      style={{ cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
    >
      {block.text}
    </h3>
  );
};

export default SectionTitle;
