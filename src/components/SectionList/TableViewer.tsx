// src/components/TableViewer.tsx
import React, { useRef, useLayoutEffect } from 'react'
import type { TableBlock, TableCell, BBox } from '../../types/ParsedSection'
import { normalizeBBox } from '../../uitils/bboxUtils'

type Props = {
  block: TableBlock
  onTextClick: (text: string, bbox: BBox) => void
  pdfHeight: number
  hovered?: { text: string; bbox: BBox } | null
}

const TableViewer: React.FC<Props> = ({
  block, onTextClick, pdfHeight, hovered
}) => {
  const { num_rows, num_cols, cells } = block.table

  // 1) cells → 2D 배열
  const rows: TableCell[][] = Array.from({ length: num_rows }, () => [])
  cells.forEach(cell => rows[cell.row].push(cell))
  rows.forEach(row => row.sort((a, b) => a.col - b.col))

  // 2) hovered bbox 정규화
  const hoveredNorm = hovered?.bbox
    ? normalizeBBox(hovered.bbox, pdfHeight)
    : null

  // 3) 현재 활성(hover) 셀을 가리킬 ref
  const activeCellRef = useRef<HTMLTableCellElement>(null)

  // 4) hovered 가 바뀔 때마다 해당 셀로 스크롤
  useLayoutEffect(() => {
    if (activeCellRef.current) {
      activeCellRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [hovered])

  return (
    <table className="table-fixed border border-gray-700 border-collapse w-full text-sm">
      <colgroup>
        {Array.from({ length: num_cols }).map((_, ci) => {
          const widthClass = ci === 0 ? 'w-1/5' : `w-${Math.floor(4 / (num_cols - 1))}/5`
          return <col key={ci} className={widthClass} />
      })}
      </colgroup>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri}>
            {row.map(cell => {
              const norm = normalizeBBox(cell.bbox, pdfHeight)
              const isActive =
                hoveredNorm &&
                norm.l === hoveredNorm.l &&
                norm.t === hoveredNorm.t &&
                norm.r === hoveredNorm.r &&
                norm.b === hoveredNorm.b

              return (
                <td
                  key={cell.col}
                  rowSpan={cell.rowspan ?? 1}
                  colSpan={cell.colspan ?? 1}
                  className={`
                    border border-gray-700 
                    px-2 py-1 
                    text-center 
                    align-middle 
                    cursor-pointer
                    ${isActive ? 'bg-yellow-200' : ''}
                  `}
                  onClick={() => {
                    const nb = normalizeBBox(cell.bbox, pdfHeight)
                    onTextClick(cell.text, nb)
                  }}
                >
                  {cell.text}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TableViewer