import type { TextBlock } from '../../types/ParsedSection'

type Props = {
  block: TextBlock
  onClick: () => void
  isHovered?: boolean
}

const SectionTitle = ({ block, onClick, isHovered }: Props) => {
  return (
    <h2
      onClick={onClick}
      className={`text-lg font-bold text-gray-800 mb-2 px-2 py-1 cursor-pointer rounded ${isHovered ? 'bg-yellow-200' : ''}`}
    >
      {block.text}
    </h2>
  )
}

export default SectionTitle