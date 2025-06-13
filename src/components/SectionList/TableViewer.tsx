// src/components/TableViewer.tsx
import React from 'react'
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

  // 1) 셀을 row, col 키로 빠르게 찾아쓰기 위한 맵
  const cellMap = new Map<string, TableCell>()
  cells.forEach(cell => {
    cellMap.set(`${cell.row}_${cell.col}`, cell)
  })

  // 2) 스팬(병합) 처리용 마커 배열
  const skip: boolean[][] = Array.from({ length: num_rows }, () =>
    Array(num_cols).fill(false)
  )

  // 3) JSON hover 시 넘어오는 bbox 정규화
  const hoveredNorm = hovered?.bbox
    ? normalizeBBox(hovered.bbox, pdfHeight)
    : null

  return (
    <table className="table-auto border-collapse w-full text-sm">
      <tbody>
        {Array.from({ length: num_rows }, (_, r) => (
          <tr key={r}>
            {Array.from({ length: num_cols }, (_, c) => {
              // 이미 상단 셀의 rowspan/colspan에 걸려서 스킵해야 하는 자리면 비웁니다
              if (skip[r][c]) return null

              const cell = cellMap.get(`${r}_${c}`)
              if (!cell) {
                // 빈 셀(데이터가 없이 병합만 되어 있는 자리)
                return <td key={c} className="border px-2 py-1" />
              }

              // rowspan, colspan 디폴트 1
              const rowspan = cell.rowspan ?? 1
              const colspan = cell.colspan ?? 1

              // 이 셀로부터 확장된 영역(skip) 표시
              for (let dr = 0; dr < rowspan; dr++) {
                for (let dc = 0; dc < colspan; dc++) {
                  if (dr === 0 && dc === 0) continue
                  skip[r + dr][c + dc] = true
                }
              }

              // 현재 셀도 highlight 검사
              let isActive = false
              if (hoveredNorm) {
                const norm = normalizeBBox(cell.bbox, pdfHeight)
                isActive =
                  norm.l === hoveredNorm.l &&
                  norm.t === hoveredNorm.t &&
                  norm.r === hoveredNorm.r &&
                  norm.b === hoveredNorm.b
              }

              return (
                <td
                  key={c}
                  rowSpan={rowspan}
                  colSpan={colspan}
                  className={`border px-2 py-1 ${isActive ? 'bg-yellow-200' : ''}`}
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
