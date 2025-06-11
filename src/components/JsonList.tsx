import React from 'react';
import { useParsedSections } from '../hooks/useParsedSections';
import SectionBlockRenderer from './SectionList/SectionBlock';
import type { BBox } from '../types/ParsedSection'; // BBox 타입 임포트

// JsonList 컴포넌트가 받을 props의 타입을 정의합니다.
interface JsonListProps {
  onHighlight: (page: number, bbox: BBox) => void; // App.tsx로부터 전달받는 하이라이트 콜백
  onClearHighlight: () => void; // App.tsx로부터 전달받는 하이라이트 해제 콜백
}

// JsonList 컴포넌트를 props를 받는 함수 컴포넌트로 수정합니다.
const JsonList: React.FC<JsonListProps> = ({ onHighlight, onClearHighlight }) => {
  const sections = useParsedSections();

  return (
    <div className="h-full overflow-auto p-4 space-y-6 bg-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      {sections.map((section, sectionIndex) => (
        <div key={`section-${sectionIndex}`} className="mb-6 pb-4 border-b border-gray-200">
          {/* <h3 className="text-xl font-semibold mb-3 text-blue-700">{section.title}</h3> */}
          {section.blocks.map((block) => (
            // SectionBlockRenderer에 onHighlight와 onClearHighlight 콜백을 전달합니다.
            <SectionBlockRenderer
              key={block.id}
              block={block}
              onHighlight={onHighlight} // prop 전달
              onClearHighlight={onClearHighlight} // prop 전달
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default JsonList;
