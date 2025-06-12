import type { TableBlock, TableCell, BBox } from '../../types/ParsedSection'

type Props = {
  block: TableBlock
  onTextClick: (text: string, bbox: BBox) => void
}

const TableViewer = ({ block, onTextClick }: Props) => {
  const { table } = block
  const rows: TableCell[][] = Array.from({ length: table.num_rows }, () => [])

  // 셀을 행렬 구조로 정리
  table.cells.forEach((cell) => {
    if (cell.row != null && cell.col != null) {
      rows[cell.row].push(cell)
    }
  })

  return (
    <div className="overflow-x-auto border border-gray-300 rounded-md my-2">
      <table className="table-auto w-full text-sm text-left border-collapse">
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => {
                const bbox = cell.bbox
                const isClickable =
                  bbox &&
                  typeof bbox.l === 'number' &&
                  typeof bbox.t === 'number' &&
                  typeof bbox.r === 'number' &&
                  typeof bbox.b === 'number'

                return (
                  <td
                    key={colIndex}
                    rowSpan={cell.rowspan}
                    colSpan={cell.colspan}
                    className={`border border-gray-300 px-2 py-1 ${
                      isClickable ? 'cursor-pointer hover:bg-yellow-100' : ''
                    }`}
                    onClick={() => {
                      if (isClickable) {
                        onTextClick(cell.text, bbox)
                      }
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
    </div>
  )
}

export default TableViewer