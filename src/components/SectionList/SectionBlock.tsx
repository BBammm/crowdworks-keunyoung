import type { SectionBlock } from '../../types/ParsedSection'
import SectionTitle from './SectionTitle'
import TextBlockItem from './TextBlockItem'
import TableViewer from './TableViewer'
import GraphPointItem from './GraphPointItem'

type Props = {
  block: SectionBlock
}

const SectionBlockRenderer = ({ block }: Props) => {
  switch (block.type) {
    case 'section_header':
      return <SectionTitle block={block} />
    case 'text':
      return <TextBlockItem block={block} />
    case 'table':
      return <TableViewer block={block} />
    case 'graph_point':
      return <GraphPointItem block={block} />
    default:
      return null
  }
}

export default SectionBlockRenderer