import type { Section } from '../types/ParsedSection'
import SectionBlock from './SectionList/SectionBlock'

type Props = {
  sections: Section[]
  onTextClick: (text: string, bbox: any) => void
  hoveredText?: string | null
  pdfHeight: number;
}

const JsonList = ({ sections, onTextClick, hoveredText, pdfHeight }: Props) => {
  return (
    <div className="space-y-4 text-sm overflow-y-auto h-full pr-2">
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          {section.blocks.map((block) => (
            <SectionBlock
              key={block.id}
              block={block}
              onTextClick={onTextClick}
              hoveredText={hoveredText}
              pdfHeight={pdfHeight}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default JsonList