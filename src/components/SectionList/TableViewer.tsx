import React from 'react';
import type { TableBlock, TableCell, BBox } from '../../types/ParsedSection';

interface TableViewerProps {
  block: TableBlock;
  onHighlight: (page: number, bbox: BBox) => void;
  onClearHighlight: () => void;
}

const TableViewer: React.FC<TableViewerProps> = ({ block, onHighlight, onClearHighlight }) => {
  return (
    <div className="border border-gray-300 rounded-md my-4 p-3 bg-gray-50 shadow-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
      <h4 className="text-lg font-medium mb-2 text-indigo-700">표 데이터</h4>
      <table className="w-full border-collapse">
        <tbody>
          {Array.from({ length: block.table.num_rows }).map((_, rowIndex) => (
            <tr key={`table-${block.id}-row-${rowIndex}`} className="hover:bg-gray-100 transition-colors">
              {Array.from({ length: block.table.num_cols }).map((_, colIndex) => {
                const cell = block.table.cells.find(c => c.row === rowIndex && c.col === colIndex);
                // 각 셀의 bbox가 있으면 셀의 bbox를, 없으면 테이블 블록 전체의 bbox를 사용합니다.
                const cellBbox = cell?.bbox || block.bbox;
                const cellPage = cell?.page || block.page; // 셀에 페이지 정보가 없으면 블록 페이지 사용

                return (
                  <td
                    key={`table-${block.id}-cell-${rowIndex}-${colIndex}`}
                    className="border border-gray-300 px-4 py-2 text-sm text-gray-800"
                    onMouseEnter={() => onHighlight(cellPage, cellBbox)}
                    onMouseLeave={onClearHighlight}
                    style={{ cursor: 'pointer' }}
                  >
                    {cell?.text || ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableViewer;
