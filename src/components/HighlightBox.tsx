import type { BBox } from '../types/ParsedSection'

type Props = {
  bbox: BBox
  scale?: number
  pdfHeight?: number
  type: string
}

const HighlightBox = ({ bbox, scale = 1, pdfHeight = 1000, type }: Props) => {
  if (!bbox || typeof bbox.l !== 'number') return null

  const top = (pdfHeight - bbox.t) * scale
  const height = Math.abs(bbox.b - bbox.t) * scale

  const style = {
    position: 'absolute' as const,
    left: bbox.l * scale,
    top: top - 5,
    width: (bbox.r - bbox.l) * scale,
    height: height + 10,
    backgroundColor: type === 'pdf' ? 'rgba(0, 255, 255, 0.3)' : 'rgba(255, 255, 0, 0.3)', // 💡 여기 분기
    border: type === 'pdf' ? '1px solid cyan' : undefined,
    pointerEvents: 'none' as const,
    zIndex: 10,
  }

  return <div style={style} />
}

export default HighlightBox