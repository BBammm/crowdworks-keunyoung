import type { BBox } from '../types/ParsedSection'

export function normalizeBBox(bbox: BBox, pdfHeight: number): BBox {
  if (bbox.coord_origin === 'TOPLEFT') {
    return {
      ...bbox,
      t: pdfHeight - bbox.t,
      b: pdfHeight - bbox.b,
    }
  }
  return bbox
}