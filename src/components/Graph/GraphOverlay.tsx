import { CSSProperties } from 'react'
import type { BBox } from '../../types/ParsedSection'

type Props = {
  pictures: any[]
  textsMap: Map<string, any>
  onPointClick?: (text: string, bbox: BBox) => void
  highlight?: { text: string; bbox: BBox } | null
}

const scale = 1 / 1.5

const getStyleFromBBox = (bbox: BBox): CSSProperties => ({
  position: 'absolute',
  left: bbox.l * scale,
  top: (1000 - bbox.t) * scale,
  width: (bbox.r - bbox.l) * scale,
  height: (bbox.t - bbox.b) * scale,
  fontSize: '10px',
  lineHeight: 1,
  color: '#222',
  backgroundColor: 'rgba(0,0,0,0.05)',
  cursor: 'pointer',
})

const GraphOverlay = ({ pictures = [], textsMap, onPointClick, highlight }: Props) => {
  if (!Array.isArray(pictures)) return null

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {pictures.map((picture) => {
        if (!picture?.bbox || !picture.children) return null

        const pictureStyle: CSSProperties = {
          position: 'absolute',
          left: picture.bbox.l * scale,
          top: (1000 - picture.bbox.t) * scale,
          width: (picture.bbox.r - picture.bbox.l) * scale,
          height: (picture.bbox.t - picture.bbox.b) * scale,
          border: '1px solid rgba(0,0,0,0.1)',
        }

        return (
          <div key={picture.self_ref} style={pictureStyle}>
            {Array.isArray(picture.children) &&
              picture.children.map((childRef: any) => {
                const textData = textsMap.get(childRef.$ref)
                const bbox = textData?.prov?.[0]?.bbox
                if (!textData?.text || !bbox) return null

                const isHighlighted = highlight?.text === textData.text
                return (
                  <div
                    key={childRef.$ref}
                    style={{
                      ...getStyleFromBBox(bbox),
                      backgroundColor: isHighlighted
                        ? 'rgba(255, 255, 0, 0.5)'
                        : 'rgba(0, 0, 0, 0.05)',
                      pointerEvents: 'auto',
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