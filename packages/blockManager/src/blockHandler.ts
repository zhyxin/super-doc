import { OutputBlockData, BlockId, BlockToolData, CURSOR_DIRECTION } from "@super-doc/types";
import { generateBlockId, BlockType, cursorPositionType } from "@super-doc/share";
import { Block } from ".";
import { generateParagraphData } from "@super-doc/api";

export const findBlockInstanceForId = function (blockId: BlockId): {
  pre: { state: Block; index: number };
  target: { state: Block; index: number };
  next: { state: Block; index: number };
} {
  let pre: { state: Block; index: number } = null;
  let target: { state: Block; index: number } = null;
  let next: { state: Block; index: number } = null;
  this.blockInstances.some((block, index, _t) => {
    if (block.id === blockId) {
      pre = { state: index === 0 ? null : _t[index - 1], index: index - 1 };
      target = { state: block, index: index };
      next = {
        state: index === this.blockInstances.length - 1 ? null : _t[index + 1],
        index: index + 1,
      };
    }
  });
  return {
    pre,
    target,
    next,
  };
};

export const replaceBlockForBlockId = function (
  block: Block,
  blockId: BlockId = this.currentBlockId,
): void {

  const { target: oldBlock } = this.findBlockInstanceForId(blockId);
  /**
   * 保留数据
  */
  try {
    if(block.type === BlockType.PARAGRAPH || block.type === BlockType.HEAD) {
      block.data.text = !!block.data.text ? block.data.text : oldBlock.state.data.text;
    } else if(block.type === BlockType.LIST_DOC) {
      if((oldBlock.state.type === BlockType.PARAGRAPH || oldBlock.type === BlockType.HEAD) && oldBlock.state.data.text) {
        block.data.list[0].text = oldBlock.state.data.text;
      }
    }
  } catch (error) {
    console.error(error);
  }
  this.blocks.splice(oldBlock.index, 1, { ...block, id: generateBlockId() });
};

export const insertBlockForBlockId = function (
  blockData: OutputBlockData = generateParagraphData(),
  blockId: BlockId = this.currentBlockId,
  direction: CURSOR_DIRECTION = cursorPositionType.CURSOR_POSITION_END
): void {
  blockData.id = blockData.id ? blockData.id : generateBlockId();
  this.blocks.some(({ id }, index, _target) => {
    if (id === blockId) {
      let i = index;
      if(direction === cursorPositionType.CURSOR_POSITION_END) {
        i = index + 1;
      } else if (direction === cursorPositionType.CURSOR_POSITION_MIDDLE) {
        i = index + 1;
      } else if (direction === cursorPositionType.CURSOR_POSITION_START) {
        i = index;
      }
      _target.splice(i, 0, blockData);
      return true;
    }
  });
};

 export const changeBlockForBlockId = function(
  blockData?: OutputBlockData,
  blockId?: BlockId
){
  let insertFn:Function;
  const {CURRENT_CURSOR_START,foucsCursor} = this.curentFocusBlock
  switch (foucsCursor){
    case CURRENT_CURSOR_START: insertFn = insertBeforeBlockForBlockId.bind(this);break;
    default: insertFn = insertBlockForBlockId.bind(this);
  }
  console.log(foucsCursor,'位置')
  insertFn && insertFn(blockData,blockId)
}

// 往前插入
export const insertBeforeBlockForBlockId = function(
  blockData?: OutputBlockData,
  blockId?: BlockId
){
  const target = blockData ?? {
    id: generateBlockId(),
    type: "Paragraph",
    data: {
      text: '',
    },
    class: 'Paragraph',
  };
  if (!target.id) {
    target.id = generateBlockId();
  }
  this.blocks.some((blockData, index, _target) => {
    if (blockData.id === this.currentBlockId) {
      if(index ==  0){
        _target.unshift(target)
      }else{
        _target.splice(index, 0, target);
      }
      return true;
    }
  });
}

export const batchInsertBlock = function (blockDatas: OutputBlockData[] = []) {
  blockDatas.forEach(blockData => {
    insertBlockForBlockId(blockData);
  })
};

export const replaceCurrentBlock = function (blockDatas: OutputBlockData[], id: BlockId) {
  blockDatas.forEach(block => block.class = block.class);
  const currentBlockIndex = this.blocks.findIndex(block => block.id === (id ? id : this.currentBlockId));
  this.blocks.splice(currentBlockIndex, 1, ...blockDatas);
}

export const updateBlockData = function (id: BlockId, data: BlockToolData) {
  if(!id || !data) return;
  const blockData = this.blocks.find(block => block.id === id);
  blockData.data = data;
}
