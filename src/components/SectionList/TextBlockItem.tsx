import React from 'react';
import type { TextBlock, BBox } from '../../types/ParsedSection';

interface TextBlockItemProps {
  block: TextBlock;
  onHighlight: (page: number, bbox: BBox) => void;
  onClearHighlight: () => void;
}

const TextBlockItem: React.FC<TextBlockItemProps> = ({ block, onHighlight, onClearHighlight }) => {
  return (
    <p
      className="text-gray-700 leading-relaxed mb-2"
      onMouseEnter={() => onHighlight(block.page, block.bbox)}
      onMouseLeave={onClearHighlight}
      style={{ cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
    >
      {block.text}
    </p>
  );
};

export default TextBlockItem;
