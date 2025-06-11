import { useState } from 'react'
import type { BBox } from '../types/ParsedSection'

export function useGraphOverlay() {
  const [highlight, setHighlight] = useState<{ text: string; bbox: BBox } | null>(null)

  const onHighlight = (text: string, bbox: BBox) => setHighlight({ text, bbox })
  const onClearHighlight = () => setHighlight(null)

  return { highlight, onHighlight, onClearHighlight }
}