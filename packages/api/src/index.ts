import { Module, generateBlockId } from "@super-doc/share";
import { BlockId, OutputBlockData } from "@super-doc/types";

/**
 * 对外暴露的plugin
 */
export * as Plugin from "./plugin/index";

export * as Constant from "./constant/index";

export * as event from "./event/index";
/**
 * 对外暴露的api
 */

export class API extends Module {
  public prepare() {}

  public batchInsertBlock(blockDatas: OutputBlockData[] = []) {
    this.Editor.BlockManager.batchInsertBlock(blockDatas);
  }

  public replaceCurrentBlock(blockDatas: OutputBlockData[], id: BlockId) {
    return this.Editor.BlockManager.replaceCurrentBlock(blockDatas, id);
  }

  /**
   * 更新blocks json 的方法
   */
  public superDocUpdateBlockData(
    id: BlockId,
    blockData: OutputBlockData
  ): boolean {
    const { data } = this.Editor.BlockManager.blocks.find(
      (item) => item.id === id
    );
    const keys = Object.keys(blockData);
    keys.forEach((key) => {
      data[key] = blockData[key];
    });
    return true;
  }

  /**
   * 监听blockData变化回调函数
   */
  public superDocListen(target: OutputBlockData, callback: Function) {
    const listeners = this.Editor.BlockManager.listeners.get(target);
    if (!listeners) this.Editor.BlockManager.listeners.set(target, new Set());
    this.Editor.BlockManager.listeners.get(target).add(callback);
  }

  /**
   *  返回光标位置
   */
  public getCursorPosition() {
    // return
  }

  /**
   * 获取每种插件的默认数据
   */
  // public getDefaultBlockData(): blockData {

  // }
}

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * 对外暴露使用的方法
 */
export const showCommand = () => {
  window["__SUPERDOC__"].UI.command.visible = true;
};

export const addListener = (type: string, callback) => {
  if (type === "add") {
    window["__SUPERDOC__"].Event.addListeners.add(callback);
  } else if (type === "delete") {
    window["__SUPERDOC__"].Event.deleteListeners.add(callback);
  } else if (type === "update") {
    window["__SUPERDOC__"].Event.updateListeners.add(callback);
  }
};

export const removeListener = (type, callback) => {
  if (type === "add") {
    window["__SUPERDOC__"].Event.addListeners.delete(callback);
  } else if (type === "delete") {
    window["__SUPERDOC__"].Event.deleteListeners.delete(callback);
  } else if (type === "update") {
    window["__SUPERDOC__"].Event.updateListeners.delete(callback);
  }
};

export const getBlockData = (id: BlockId) => {
  if (!id) return {};
  return window["__SUPERDOC__"].BlockManager.blocks.find(
    (block) => block.id === id
  );
};

export const generateParagraphData = () => {
  return {
    id: generateBlockId(),
    type: "Paragraph",
    data: {
      text: "",
    },
    class: "Paragraph",
  };
};
/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
