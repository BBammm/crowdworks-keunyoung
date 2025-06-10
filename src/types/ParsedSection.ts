// 기본 bbox 타입
export type BBox = {
  l: number
  t: number
  r: number
  b: number
  coord_origin: string
}

// 텍스트 블록 (일반 텍스트, 제목, 그래프 점 포함)
export type TextBlock = {
  type: 'text' | 'section_header' | 'graph_point'
  id: string
  text: string
  page: number
  bbox: BBox
}

// 표 셀
export type TableCell = {
  row: number
  col: number
  text: string
  bbox: BBox
  rowspan?: number
  colspan?: number
}

// 표 블록
export type TableBlock = {
  type: 'table'
  id: string
  page: number
  table: {
    num_rows: number
    num_cols: number
    cells: TableCell[]
  }
}

// 전체 블록 통합 타입
export type SectionBlock = TextBlock | TableBlock

// 섹션 구조
export type Section = {
  title: string
  blocks: SectionBlock[]
}