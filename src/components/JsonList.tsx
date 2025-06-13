import type { BBox, Section } from '../types/ParsedSection'
import SectionBlock from './SectionList/SectionBlock'

type Props = {
  sections: Section[]
  onTextClick: (text: string, bbox: any) => void
  hoveredId?: string | null
  hovered?: { text: string; bbox: BBox } | null
  pdfHeight: number;
}

const JsonList = ({ sections, onTextClick, hoveredId, hovered, pdfHeight }: Props) => {
  return (
    <div className="space-y-4 text-sm overflow-y-auto h-full pr-2">
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          {section.blocks.map((block) => (
            <SectionBlock
              key={block.id}
              block={block}
              onTextClick={onTextClick}
              hoveredId={hoveredId}
              hovered={hovered}
              pdfHeight={pdfHeight}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default JsonList