export type TextBlock = {
  id: string
  text: string
  page: number
  bbox: { l: number; t: number; r: number; b: number; coord_origin: string }
}

export type TextSection = {
  title: string
  blocks: TextBlock[]
}