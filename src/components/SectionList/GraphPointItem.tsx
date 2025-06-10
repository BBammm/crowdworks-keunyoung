import type { TextBlock } from '../../types/ParsedSection'

type Props = {
  block: TextBlock
}

const GraphPointItem = ({ block }: Props) => {
  const handleClick = () => {
    // TODO: PDFViewer에서 bbox를 하이라이트하는 로직과 연결 예정
    console.log('클릭된 그래프 텍스트:', block.text, block.bbox)
  }

  return (
    <div
      onClick={handleClick}
      className="text-sm text-green-700 mb-1 cursor-pointer hover:underline"
    >
      📈 {block.text}
    </div>
  )
}

export default GraphPointItem