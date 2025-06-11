import type { CSSProperties } from 'react'
import type { BBox } from '../../types/ParsedSection'

type Props = {
  pictures: any[]
  textsMap: Map<string, any>
  onPointClick?: (text: string, bbox: BBox) => void
  highlight?: { text: string; bbox: BBox } | null
  scale: number
  pdfHeight: number
}

function getStyleFromBBox(bbox: BBox, scale: number, pdfHeight: number): CSSProperties {
  return {
    position: 'absolute',
    left: bbox.l * scale,
    top: (pdfHeight - bbox.t) * scale,
    width: (bbox.r - bbox.l) * scale,
    height: (bbox.t - bbox.b) * scale,
    fontSize: '10px',
    lineHeight: 1,
    color: 'blue',
    backgroundColor: 'rgba(255,255,0,0.2)',
    cursor: 'pointer',
    pointerEvents: 'auto',
  }
}

const GraphOverlay = ({
  pictures,
  textsMap,
  onPointClick,
  highlight,
  scale,
  pdfHeight,
}: Props) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {pictures.map((picture) => {
        if (!picture?.bbox || !picture.children) return null

        return (
          <div key={picture.self_ref}>
            {picture.children.map((childRef: any) => {
              const textData = textsMap.get(childRef.$ref)
              const bbox = textData?.prov?.[0]?.bbox
              if (!textData?.text || !bbox) return null

              const isHighlighted = highlight?.text === textData.text

              return (
                <div
                  key={childRef.$ref}
                  style={{
                    ...getStyleFromBBox(bbox, scale, pdfHeight),
                    backgroundColor: isHighlighted
                      ? 'rgba(255, 255, 0, 0.5)'
                      : 'rgba(0, 0, 0, 0.05)',
                  }}
                  onClick={() => onPointClick?.(textData.text, bbox)}
                >
                  {textData.text}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default GraphOverlay