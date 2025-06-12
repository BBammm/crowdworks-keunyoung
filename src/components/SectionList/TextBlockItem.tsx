import type { TextBlock } from '../../types/ParsedSection'

type Props = {
  block: TextBlock
  onClick: () => void
  isHovered?: boolean
}

const TextBlockItem = ({ block, onClick, isHovered }: Props) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer px-2 py-1 rounded ${isHovered ? 'bg-yellow-200' : ''}`}
    >
      {block.text}
    </div>
  )
}

export default TextBlockItem