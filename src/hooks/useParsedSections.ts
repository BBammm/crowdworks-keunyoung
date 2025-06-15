import { useMemo } from 'react';
import type { Section, SectionBlock, TextBlock, TableBlock, TableCell } from '../types/ParsedSection';
import rawData from '../assets/data/1.report.json';

enum BlockType {
  SectionHeader = 'section_header',
  GraphPoint = 'graph_point',
  Text = 'text',
  Table = 'table',
}

interface RefInfo {
  type: string;
  id: string;
}

function parseRef(ref: string): RefInfo | null {
  const parts = ref.split('/');
  if (parts.length < 3) return null;
  const type = parts[1];
  const id = parts[2];
  return { type, id };
}

export function useParsedSections(): Section[] {
  const parsedSections = useMemo(() => {
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

    const processBlock = (blockData: any, type: BlockType | 'table'): SectionBlock | null => {
      if (!blockData || !blockData.prov || !blockData.prov[0]) {
        console.warn('누락된 데이터:', blockData);
        return null;
      }
      const page = blockData.prov?.[0]?.page_no;
      const bbox = blockData.prov?.[0]?.bbox;
      if (!page || !bbox) {
        console.warn('bbbox 누락됨:', blockData);
        return null;
      }

      const blockId = `block-${blockData.self_ref.split('/').pop()}`;

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
      } else if (type === BlockType.Table) {
        const cells: TableCell[] =
          blockData.data?.table_cells?.map((cell: any) => ({
            row: cell.start_row_offset_idx,
            col: cell.start_col_offset_idx,
            text: cell.text,
            bbox: cell?.bbox ?? null,
            rowspan: cell.row_span,
            colspan: cell.col_span,
          })) || []

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
      console.warn('지원하지 않는 타입 유형:', type, blockData);
      return null;
    };

    rawData.body.children.forEach((childRef: any) => {
      const refInfo = parseRef(childRef.$ref);
      if (!refInfo) {
        console.warn('잘못된 참조:', childRef.$ref);
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
                    currentSection = { title: "타이틀이 존재하지 않습니다.", blocks: [] };
                    sections.push(currentSection);
                  }
                  currentSection.blocks.push(textBlock);
                }
              } else if (groupChildRefInfo) {
                console.warn('잘못된 groups 유형:', groupChildRefInfo.type, groupChildRef.$ref);
              }
            });
          }
          return;
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
                              currentSection = { title: "타이틀이 존재하지 않습니다", blocks: [] };
                              sections.push(currentSection);
                          }
                          currentSection.blocks.push(textBlock);
                      }
                  } else if (pictureChildRefInfo) {
                      console.warn('잘못된 picture 유형:', pictureChildRefInfo.type, pictureChildRef.$ref);
                  }
              });
          }
          return;
        }
        default:
          console.warn('잘못된 최상위 유형:', refInfo.type, childRef.$ref);
          return;
      }

      // 처리된 블록을 현재 섹션에 추가하거나 새 섹션을 시작합니다.
      if (block) {
        if (block.type === BlockType.SectionHeader || !currentSection) {
          currentSection = {
            title: block.type === BlockType.SectionHeader ? block.text : "타이틀이 존재하지 않습니다",
            blocks: [block],
          };
          sections.push(currentSection);
        } else {
          currentSection.blocks.push(block);
        }
      }
    });

    return sections;
  }, [rawData]);

  return parsedSections;
}