import { useParsedSections } from '../hooks/useParsedSections'
import SectionBlockRenderer from './SectionList/SectionBlock'

const JsonList = () => {
  const sections = useParsedSections()

  return (
    <div className="h-full overflow-auto p-4 space-y-6 bg-gray-50">
      {sections.map((section, sectionIndex) => (
        <div key={`section-${sectionIndex}`}>
          {section.blocks.map((block) => (
            <SectionBlockRenderer key={block.id} block={block} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default JsonList