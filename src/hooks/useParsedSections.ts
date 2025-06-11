import { useMemo } from 'react'; // useMemo 훅을 임포트합니다.
import type { Section, SectionBlock, TextBlock, TableBlock, TableCell } from '../types/ParsedSection';
import rawData from '../assets/data/1.report.json'; // 1.report.json 파일을 참조합니다.

// 1. 블록 타입을 위한 Enum 정의
enum BlockType {
  SectionHeader = 'section_header',
  GraphPoint = 'graph_point',
  Text = 'text',
  Table = 'table',
}

// 2. 참조 문자열 파싱을 위한 헬퍼 함수
interface RefInfo {
  type: string;
  id: string;
}

function parseRef(ref: string): RefInfo | null {
  const parts = ref.split('/');
  if (parts.length < 3) return null; // 유효하지 않은 참조 형식
  const type = parts[1]; // 'texts', 'tables', 'groups', 'pictures'
  const id = parts[2];   // 숫자 ID
  return { type, id };
}

export function useParsedSections(): Section[] {
  // useMemo를 사용하여 rawData가 변경될 때만 파싱 로직을 재실행합니다.
  const parsedSections = useMemo(() => {
    // 각 콘텐츠 타입별로 빠른 조회를 위한 Map을 생성합니다.
    const textsMap = new Map<string, any>();
    rawData.texts.forEach((t: any) => textsMap.set(t.self_ref, t));

    const tablesMap = new Map<string, any>();
    rawData.tables.forEach((t: any) => tablesMap.set(t.self_ref, t));

    const groupsMap = new Map<string, any>();
    rawData.groups.forEach((g: any) => groupsMap.set(g.self_ref, g));

    const picturesMap = new Map<string, any>();
    rawData.pictures.forEach((p: any) => picturesMap.set(p.self_ref, p));

    const sections: Section[] = [];
    let currentSection: Section | null = null;

    // 개별 블록(텍스트, 테이블)을 처리하고 SectionBlock 형태로 반환하는 헬퍼 함수
    const processBlock = (blockData: any, type: BlockType | 'table'): SectionBlock | null => {
      // 필수 데이터(prov, page_no, bbox)가 없으면 처리하지 않습니다.
      if (!blockData || !blockData.prov || !blockData.prov[0]) {
        console.warn('Block data missing essential provenance information:', blockData);
        return null;
      }
      const page = blockData.prov?.[0]?.page_no;
      const bbox = blockData.prov?.[0]?.bbox;
      if (!page || !bbox) {
        console.warn('Block data missing page or bbox information:', blockData);
        return null;
      }

      const blockId = `block-${blockData.self_ref.split('/').pop()}`; // ID 생성 로직 중앙화

      if (type === BlockType.Text || type === BlockType.SectionHeader || type === BlockType.GraphPoint) {
        const isSectionHeader = blockData.label === BlockType.SectionHeader;
        const isGraphPoint = !!blockData.parent?.$ref?.includes('/pictures/');

        const block: TextBlock = {
          id: blockId,
          text: blockData.text,
          page,
          bbox,
          type: isSectionHeader ? BlockType.SectionHeader : isGraphPoint ? BlockType.GraphPoint : BlockType.Text,
        };
        return block;
      } else if (type === BlockType.Table) { // type string 'table'
        const cells: TableCell[] =
          blockData.data?.table_cells?.map((cell: any) => ({
            row: cell.start_row_offset_idx,
            col: cell.start_col_offset_idx,
            text: cell.text,
            bbox: cell.prov?.[0]?.bbox,
            rowspan: cell.row_span,
            colspan: cell.col_span,
          })) || [];

        const block: TableBlock = {
          type: BlockType.Table,
          id: blockId,
          page,
          bbox,
          table: {
            num_rows: blockData.data?.num_rows || 0,
            num_cols: blockData.data?.num_cols || 0,
            cells,
          },
        };
        return block;
      }
      console.warn('Unsupported block type in processBlock:', type, blockData);
      return null;
    };

    // rawData.body.children 배열을 순회하며 문서 순서대로 콘텐츠를 처리합니다.
    rawData.body.children.forEach((childRef: any) => {
      const refInfo = parseRef(childRef.$ref);
      if (!refInfo) {
        console.warn('Invalid ref format:', childRef.$ref);
        return;
      }

      let block: SectionBlock | null = null;

      switch (refInfo.type) {
        case 'texts': {
          const textData = textsMap.get(childRef.$ref);
          block = processBlock(textData, textData?.label === 'section_header' ? BlockType.SectionHeader : BlockType.Text);
          break;
        }
        case 'tables': {
          const tableData = tablesMap.get(childRef.$ref);
          block = processBlock(tableData, BlockType.Table);
          break;
        }
        case 'groups': {
          const groupData = groupsMap.get(childRef.$ref);
          if (groupData && groupData.children) {
            groupData.children.forEach((groupChildRef: any) => {
              const groupChildRefInfo = parseRef(groupChildRef.$ref);
              if (groupChildRefInfo && groupChildRefInfo.type === 'texts') {
                const textData = textsMap.get(groupChildRef.$ref);
                const textBlock = processBlock(textData, BlockType.Text);
                if (textBlock) {
                  if (!currentSection) {
                    currentSection = { title: "Untitled Section", blocks: [] };
                    sections.push(currentSection);
                  }
                  currentSection.blocks.push(textBlock);
                }
              } else if (groupChildRefInfo) {
                console.warn('Unsupported child type in group:', groupChildRefInfo.type, groupChildRef.$ref);
              }
            });
          }
          return; // 그룹은 자식을 처리했으므로 다음 최상위 자식으로 넘어갑니다.
        }
        case 'pictures': {
          const pictureData = picturesMap.get(childRef.$ref);
          if (pictureData && pictureData.children) {
              pictureData.children.forEach((pictureChildRef: any) => {
                  const pictureChildRefInfo = parseRef(pictureChildRef.$ref);
                  if (pictureChildRefInfo && pictureChildRefInfo.type === 'texts') {
                      const textData = textsMap.get(pictureChildRef.$ref);
                      const textBlock = processBlock(textData, BlockType.Text);
                      if (textBlock) {
                          if (!currentSection) {
                              currentSection = { title: "Untitled Section", blocks: [] };
                              sections.push(currentSection);
                          }
                          currentSection.blocks.push(textBlock);
                      }
                  } else if (pictureChildRefInfo) {
                      console.warn('Unsupported child type in picture:', pictureChildRefInfo.type, pictureChildRef.$ref);
                  }
              });
          }
          return; // 그림 내 자식 텍스트들은 처리되었으므로 다음 최상위 자식으로 넘어갑니다.
        }
        default:
          console.warn('Unhandled top-level reference type:', refInfo.type, childRef.$ref);
          return;
      }

      // 처리된 블록을 현재 섹션에 추가하거나 새 섹션을 시작합니다.
      if (block) {
        if (block.type === BlockType.SectionHeader || !currentSection) {
          currentSection = {
            title: block.type === BlockType.SectionHeader ? block.text : "Untitled Section",
            blocks: [block],
          };
          sections.push(currentSection);
        } else {
          currentSection.blocks.push(block);
        }
      }
    });

    return sections;
  }, [rawData]); // rawData가 변경될 때만 useMemo 내부 로직이 재실행됩니다.

  return parsedSections;
}