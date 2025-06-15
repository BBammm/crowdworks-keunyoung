// src/components/TableViewer.tsx
import React, { useState, useRef, useLayoutEffect, useEffect } from 'react'
import type { TableBlock, TableCell, BBox } from '../../types/ParsedSection'
import { normalizeBBox } from '../../uitils/bboxUtils'

type Props = {
  block: TableBlock
  onTextClick: (text: string, bbox: BBox, cellId: any) => void
  pdfHeight: number
  hovered?: { text: string; bbox: BBox } | null
  selectedId?: string | null
  onSelect: (cellId: string) => void
}

const TableViewer: React.FC<Props> = ({
  block,
  onTextClick,
  pdfHeight,
  hovered,
  selectedId,
  onSelect,
}) => {
  const [selectedCellId, setSelectedCellId] = useState<string|null>(null)
  useEffect(() => {
    if (!selectedId?.startsWith(`${block.id}-`)) {
      setSelectedCellId(null)
    }
  }, [selectedId, block.id])
  
  const { num_rows, num_cols, cells } = block.table
  const rows: TableCell[][] = Array.from({ length: num_rows }, () => [])
  cells.forEach(cell => rows[cell.row].push(cell))
  rows.forEach(row => row.sort((a,b)=>a.col-b.col))

  // PDF hover highlight 용
  const hoveredNorm = hovered?.bbox ? normalizeBBox(hovered.bbox, pdfHeight) : null
  const activeRef = useRef<HTMLTableCellElement>(null)
  useLayoutEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior:'smooth', block:'center' })
    }
  }, [hoveredNorm])

  return (
    <table className="table-auto border-collapse w-full text-sm">
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri}>
            {row.map(cell => {
              const norm = normalizeBBox(cell.bbox, pdfHeight)
              const isActive = hoveredNorm
                && norm.l===hoveredNorm.l
                && norm.t===hoveredNorm.t
                && norm.r===hoveredNorm.r
                && norm.b===hoveredNorm.b

              const cellId = `${block.id}-${cell.row}-${cell.col}`
              const isSelected = selectedCellId === cellId

              return (
                <td
                  key={cell.col}
                  rowSpan={cell.rowspan ?? 1}
                  colSpan={cell.colspan ?? 1}
                  // hover 시 스크롤
                  ref={ isActive ? activeRef : undefined }
                  className={`
                    border px-2 py-1 cursor-pointer
                    ${isActive   ? 'bg-yellow-200' : ''}
                    ${isSelected ? 'bg-cyan-200'    : ''}
                  `}
                  onClick={() => {
                    setSelectedCellId(cellId)
                    onSelect(cellId)
                    console.log('TableViewer cell click: onSelect(', cellId, ')')
                    const nb = normalizeBBox(cell.bbox, pdfHeight)
                    onTextClick(cell.text, nb, cellId)
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