import type { BBox } from '../types/ParsedSection'

type Props = {
  bbox: BBox
  scale?: number
  pdfHeight?: number
}

const HighlightBox = ({ bbox, scale = 1, pdfHeight = 1000 }: Props) => {
  if (!bbox || typeof bbox.l !== 'number') return null

  const top = (pdfHeight - bbox.t) * scale
  const height = Math.abs(bbox.b - bbox.t) * scale

  console.log('pdfHeight = ', pdfHeight);
  console.log('bbox.t = ', bbox.t);
  console.log('scale = ', scale);
  console.log('pdfHeight - bbox.t = ', pdfHeight - bbox.t);

  const style = {
    position: 'absolute' as const,
    left: bbox.l * scale,
    top: top - 5,
    width: (bbox.r - bbox.l) * scale,
    height: height + 10,
    backgroundColor: 'rgba(255, 255, 0, 0.3)',
    pointerEvents: 'none' as const,
    zIndex: 10,
  }

  return <div style={style} />
}

export default HighlightBox