import { useEffect, useState } from 'react'
import jsonData from '../assets/data/1.report.json'
import type { TextBlock, TextSection } from '../types/ParsedTextBlock'

const JsonList = () => {
  const [sections, setSections] = useState<TextSection[]>([])

  useEffect(() => {
    const texts = (jsonData as any).texts || []

    const parsedSections: TextSection[] = []
    let currentSection: TextSection | null = null

    texts.forEach((t: any, i: number) => {
      const page = t.prov?.[0]?.page_no
      const bbox = t.prov?.[0]?.bbox
      if (!page || !bbox || !t.text) return

      const block: TextBlock = {
        id: `block-${i}`,
        text: t.text,
        page,
        bbox,
      }

      if (t.label === 'section_header') {
        currentSection = {
          title: t.text,
          blocks: [],
        }
        parsedSections.push(currentSection)
      } else {
        if (!currentSection) {
          // 첫 section_header가 나오기 전에 텍스트가 있는 경우
          currentSection = {
            title: t.text,
            blocks: [],
          }
          parsedSections.push(currentSection)
        } else {
          currentSection.blocks.push(block)
        }
      }
    })

    setSections(parsedSections)
  }, [])

  return (
    <div className="h-full overflow-auto p-4 space-y-6">
      {sections.map((section, idx) => (
        <div key={`section-${idx}`}>
          <h2 className="text-lg font-bold mb-2 text-blue-700">{section.title}</h2>
          <div className="space-y-1">
            {section.blocks.map((item) => (
              <div
                key={item.id}
                className="p-2 border rounded bg-white hover:bg-yellow-100 cursor-pointer"
              >
                <div className="text-sm text-gray-900">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default JsonList