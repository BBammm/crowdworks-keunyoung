const TextBlockItem = ({ block }: { block: { text: string } }) => (
  <div className="text-sm text-gray-900 mb-1">{block.text}</div>
)
export default TextBlockItem