import type { BBox } from '../types/ParsedSection'

type Props = {
  texts: any[]
  onTextClick: (text: string, bbox: BBox) => void
}

const JsonList = ({ texts, onTextClick }: Props) => {
  return (
    <div className="space-y-2 text-sm">
      {texts.map((t: any) => {
        const bbox = t.prov?.[0]?.bbox
        if (!t.text || !bbox) return null
        return (
          <div
            key={t.self_ref}
            className="cursor-pointer hover:text-blue-600"
            onClick={() => onTextClick(t.text, bbox)}
          >
            {t.text}
          </div>
        )
      })}
    </div>
  )
}

export default JsonList