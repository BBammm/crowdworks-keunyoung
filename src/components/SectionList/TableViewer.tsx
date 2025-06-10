import type { TableBlock } from '../../types/ParsedSection'

type Props = {
  block: TableBlock
}

const TableViewer = ({ block }: Props) => {
  const { num_rows, num_cols, cells } = block.table

  // 2차원 배열로 초기화
  const grid: (string | null)[][] = Array.from({ length: num_rows }, () =>
    Array.from({ length: num_cols }, () => null)
  )

  // 셀 위치에 값 채우기
  cells.forEach((cell) => {
    grid[cell.row][cell.col] = cell.text
  })

  return (
    <table className="table-auto border text-sm bg-white mb-2">
      <tbody>
        {grid.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
              <td
                key={colIndex}
                className="border px-2 py-1 text-center text-gray-800"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TableViewer