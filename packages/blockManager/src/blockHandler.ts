import { OutputBlockData, BlockId } from "@super-doc/types";
import { generateBlockId } from "@super-doc/share";
import { Block } from ".";

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
  blockId: BlockId = this.currentBlockId
): void {
  const { target } = this.findBlockInstanceForId(blockId);
  try {
    block.data.text = target.state.data.text;
  } catch (error) {
    console.error(error);
  }
  this.blocks.splice(target.index, 1, { ...block, id: generateBlockId() });
};

export const insertBlockForBlockId = function (
  blockData?: OutputBlockData,
  blockId?: BlockId
): void {
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
      _target.splice(index + 1, 0, target);
      return true;
    }
  });
};

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
