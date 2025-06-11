import type { BBox } from '../types/ParsedSection'

type Props = {
  bbox: BBox
  scale?: number
  pdfHeight?: number
}

const HighlightBox = ({ bbox, scale = 1, pdfHeight = 1000 }: Props) => {
  const style = {
    position: 'absolute' as const,
    left: bbox.l * scale,
    top: (pdfHeight - bbox.t) * scale,
    width: (bbox.r - bbox.l) * scale,
    height: (bbox.t - bbox.b) * scale,
    border: '2px solid #ff0',
    backgroundColor: 'rgba(255, 255, 0, 0.3)',
    pointerEvents: 'none' as const,
    zIndex: 10,
  }

  return <div style={style} />
}

export default HighlightBox