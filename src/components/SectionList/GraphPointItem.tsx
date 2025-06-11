import React from 'react';
import type { TextBlock, BBox } from '../../types/ParsedSection'; // BBox 타입 임포트

// `onHighlight` 콜백의 타입 정의를 명확히 합니다.
interface GraphPointItemProps {
  block: TextBlock; // 'graph_point' 타입의 TextBlock 데이터
  onHighlight: (page: number, bbox: BBox) => void; // 하이라이트 시작 콜백 (bbox는 BBox 타입)
  onClearHighlight: () => void; // 하이라이트 해제 콜백
}

const GraphPointItem: React.FC<GraphPointItemProps> = ({ block, onHighlight, onClearHighlight }) => {
  const handleMouseEnter = () => {
    // 마우스 호버 시 PDF에 해당 영역을 하이라이트하도록 콜백 호출
    // block.bbox가 BBox 타입임을 가정합니다.
    onHighlight(block.page, block.bbox);
  };

  const handleMouseLeave = () => {
    // 마우스가 떠나면 하이라이트 해제 콜백 호출
    onClearHighlight();
  };

  const handleClick = () => {
    // 클릭 시에도 하이라이트를 유지하거나 PDF 스크롤 이동 등의 추가 기능 구현 가능
    onHighlight(block.page, block.bbox);
  };

  return (
    <div
      style={{
        padding: '10px 12px',
        margin: '6px 0',
        backgroundColor: '#e6f7ff', // 연한 파란색 배경
        borderLeft: '5px solid #1890ff', // 파란색 왼쪽 경계선
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer', // 마우스 커서 변경
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)', // 그림자 효과
        transition: 'all 0.2s ease-in-out', // 부드러운 전환 효과
        fontFamily: 'Inter, sans-serif', // Inter 폰트 적용
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <span style={{ marginRight: '10px', fontSize: '1.4em', color: '#1890ff' }}>📈</span> {/* 그래프 아이콘 */}
      <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>{block.text}</p>
    </div>
  );
};

export default GraphPointItem;
