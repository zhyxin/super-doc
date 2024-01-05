import { Module, generateBlockId, dom2json as _dom2json, json2dom as _json2dom } from "@super-doc/share";
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

export const generateHeadData = (level) => {
  return {
    id: generateBlockId(),
    type: "Head",
    data: {
      text: "",
      level,
    },
    class: "Head",
  };
};

export const dom2json = _dom2json;
export const json2dom = _json2dom;

function insertAfter(originElement, newElement) {
  var parent = originElement.parentNode;
  if (parent.lastChild == originElement) {
      // 如果最后的节点是目标元素，则直接添加。因为默认是最后
      parent.appendChild(newElement);
  } else {
      //如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
      parent.insertBefore(newElement, originElement.nextSibling);
  }
}

export function syncDom(targetDom:HTMLElement, newDom: HTMLElement) {
  if(targetDom.innerHTML === newDom.innerHTML) return;
  const newNodes = Array.from(newDom.childNodes);
  newNodes.forEach((nNode, index) => {
    const nodes = Array.from(targetDom.childNodes);
    const oNode = nodes[index] as HTMLElement;
    if (!oNode) {
      let i = index -1
      while(!nodes[i] && i >= 0) {
        i -= 1;
      }
      insertAfter(nodes[i], nNode);
    } else if(nNode.nodeType === oNode.nodeType) {
      if(nNode.nodeType === 3 && nNode.textContent !== oNode.textContent) {
        oNode.textContent = nNode.textContent;
      } else if (nNode.nodeName !== oNode.nodeName) {
        insertAfter(oNode, nNode);
      } else if(nNode.nodeName === oNode.nodeName) {
        syncDom(oNode, nNode as HTMLElement);
      } else {
        throw '有问题：' + nNode.nodeName + '---' + oNode.nodeName;
      }
    } else if(nNode) {
      oNode.replaceWith(nNode);
    }
  });
  const nodes = Array.from(targetDom.childNodes);
  nodes.slice(newNodes.length).forEach(el => el.remove())
}

export function markdownSyntaxTransform(content: string, id: BlockId) {
  if(/`([^`]+)`\s/.test(content)) {
    content = content.replace(/`([^`]+)`\s/g, '<code class="super-doc-code">$1</code>&nbsp;<span>&#xFEFF;</span>');
  }
  if(/`([^`]+)`&nbsp;/.test(content)) {
    content = content.replace(/`([^`]+)`&nbsp;/g, '<code class="super-doc-code">$1</code>&nbsp;<span>&#xFEFF;</span>');
  }
  

  if(content.indexOf('# ') === 0) {
    const headData = generateHeadData('h1');
    content = content.replace('# ', '');
    headData.data = {
      text: content,
      level: 'h1'
    };
    window["__SUPERDOC__"].BlockManager.replaceBlockForBlockId(headData, id);
  } else if(content.indexOf('## ') === 0) {
    const headData = generateHeadData('h2');
    content = content.replace('## ', '');
    console.log('更新后的content', content);
    headData.data = {
      text: content,
      level: 'h2'
    };
    window["__SUPERDOC__"].BlockManager.replaceBlockForBlockId(headData, id);
  } else if(content.indexOf('### ') === 0) {
    const headData = generateHeadData('h3');
    content = content.replace('### ', '');
    headData.data = {
      text: content,
      level: 'h3'
    };
    window["__SUPERDOC__"].BlockManager.replaceBlockForBlockId(headData, id);
  } else if(content.indexOf('#### ') === 0) {
    const headData = generateHeadData('h4');
    content = content.replace('#### ', '');
    headData.data = {
      text: content,
      level: 'h4'
    };
    window["__SUPERDOC__"].BlockManager.replaceBlockForBlockId(headData, id);
  } else if(content.indexOf('##### ') === 0) {
    const headData = generateHeadData('h5');
    content = content.replace('##### ', '');
    headData.data = {
      text: content,
      level: 'h5'
    };
    window["__SUPERDOC__"].BlockManager.replaceBlockForBlockId(headData, id);
  } else if(content.indexOf('+ ') === 0 || content.indexOf('- ') === 0) {

  } else {

  }
  return content;
}

export function findBlockDataForId(id: BlockId): OutputBlockData {
  return window["__SUPERDOC__"].BlockManager.findBlockConfigForId(id).data
}
/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
