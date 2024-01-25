import { BlockId, CURSOR_POSITION_END, CURSOR_POSITION_MIDDLE, CURSOR_POSITION_START } from "@super-doc/types";

export const BlockType = {
  LIST_DOC: "ListDoc",
  HEAD: "Head",
  PARAGRAPH: "Paragraph",
  IMAGE: "Image",
};


export const cursorPositionType: {
  CURSOR_POSITION_START: CURSOR_POSITION_START,
  CURSOR_POSITION_MIDDLE: CURSOR_POSITION_MIDDLE,
  CURSOR_POSITION_END: CURSOR_POSITION_END
} = {
  CURSOR_POSITION_START: 0,
  CURSOR_POSITION_MIDDLE: 1,
  CURSOR_POSITION_END: 2
};

/**
 * 获取blockId
 */
export const getBlockIdForElement = (el: HTMLElement): [BlockId, Element] => {
  let id: BlockId = el.getAttribute("block-id");
  let element = null;
  if (!id) {
    const subElement = el.querySelector("[block-id]");
    id = subElement.getAttribute("block-id");
    if(!id) {
      throw new Error(`${el}非文档元素`);
    }
    element = subElement;
  } else {
    element = el;
  }
  return [id, element];
};
