import { Module, generateBlockId, dom2json as _dom2json, json2dom as _json2dom, IMAGE_MD_REGEX, getMDImage, getModules } from "@super-doc/share";
import { BlockId, OutputBlockData } from "@super-doc/types";
import * as _ from '@super-doc/share';
import axios from "../../../axios.min.js";

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
export const showCommand = (isCurrentBlockPos = false) => {
  getModules().UI.command.visible = true;
  // 增加当前行替换内容判断
  getModules().UI.isCurrentBlockPos = isCurrentBlockPos;
};

export const addListener = (type: string, callback) => {
  if (type === "add") {
    getModules().Event.addListeners.add(callback);
  } else if (type === "delete") {
    getModules().Event.deleteListeners.add(callback);
  } else if (type === "update") {
    getModules().Event.updateListeners.add(callback);
  }
};

export const removeListener = (type, callback) => {
  if (type === "add") {
    getModules().Event.addListeners.delete(callback);
  } else if (type === "delete") {
    getModules().Event.deleteListeners.delete(callback);
  } else if (type === "update") {
    getModules().Event.updateListeners.delete(callback);
  }
};

export const getBlockData = (id: BlockId) => {
  if (!id) return {};
  return getModules().BlockManager.blocks.find(
    (block) => block.id === id
  );
};

export const generateParagraphData = () => {
  return {
    id: generateBlockId(),
    type: "Paragraph",
    data: {
      text: "",
      translate: ''
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
      translate: ''
    },
    class: "Head",
  };
};

export const generateListData = (type) => {
  if(type === 'ul') {
    return {
      id: generateBlockId(),
      type: "ListDoc",
      data: {
        type: 'ul',
        list: []
      },
      class: "ListDoc",
    }
  } if (type === 'ol') {
    return {
      id: generateBlockId(),
      type: "ListDoc",
      data: {
        type: 'ol',
        list: []
      },
      class: "ListDoc",
    }
  }
}
export const generateTodoData = () => {
  return {
    id: generateBlockId(),
    type: "TodoList",
    data: {
      list: []
    },
    class: "TodoList",
  }
}

export const generateImageData = ({desc, url}) => {
  return {
    id: generateBlockId(),
    type: 'ImageDoc',
    data: {
      desc,
      url
    },
    class: 'ImageDoc',
  }
}

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
      if(i === -1) {
        targetDom.appendChild(nNode);
      } else {
        insertAfter(nodes[i], nNode);
      }
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
    content = content.replace(/`([^`]+)`\s/g, '&nbsp;<code class="super-doc-code">$1</code>&nbsp;');
  }
  if(/`([^`]+)`&nbsp;/.test(content)) {
    content = content.replace(/`([^`]+)`&nbsp;/g, '&nbsp;<code class="super-doc-code">$1</code>&nbsp;');
  }
  

  if(content.indexOf('# ') === 0) {
    const headData = generateHeadData('h1');
    content = content.replace('# ', '');
    headData.data = {
      text: content,
      level: 'h1',
      translate: ''
    };
    getModules().BlockManager.replaceBlockForBlockId(headData as any, id);
  } else if(content.indexOf('## ') === 0) {
    const headData = generateHeadData('h2');
    content = content.replace('## ', '');
    console.log('更新后的content', content);
    headData.data = {
      text: content,
      level: 'h2',
      translate: ''
    };
    getModules().BlockManager.replaceBlockForBlockId(headData as any, id);
  } else if(content.indexOf('### ') === 0) {
    const headData = generateHeadData('h3');
    content = content.replace('### ', '');
    headData.data = {
      text: content,
      level: 'h3',
      translate: ''
    };
    getModules().BlockManager.replaceBlockForBlockId(headData as any, id);
  } else if(content.indexOf('#### ') === 0) {
    const headData = generateHeadData('h4');
    content = content.replace('#### ', '');
    headData.data = {
      text: content,
      level: 'h4',
      translate: ''
    };
    getModules().BlockManager.replaceBlockForBlockId(headData as any, id);
  } else if(content.indexOf('##### ') === 0) {
    const headData = generateHeadData('h5');
    content = content.replace('##### ', '');
    headData.data = {
      text: content,
      level: 'h5',
      translate: ''
    };
    getModules().BlockManager.replaceBlockForBlockId(headData as any, id);
  } else if(content.indexOf('- ') === 0) {
    let blockData = generateListData('ul');
    content = content.replace('- ', '');
    blockData.data.list[0] = { text: content ? content : '', id: generateBlockId() };
    getModules().BlockManager.replaceBlockForBlockId(blockData as any, id);
  } else if(content.indexOf('+ ') === 0) {
    let blockData = generateListData('ol');
    content = content.replace('+ ', '');
    blockData.data.list[0] = { text: content ? content : '', id: generateBlockId() };
    getModules().BlockManager.replaceBlockForBlockId(blockData as any, id);
  } else if(IMAGE_MD_REGEX.test(content)) {
    const blockData = generateImageData(getMDImage(content));
    if(blockData.data.url) getModules().BlockManager.replaceBlockForBlockId(blockData as any, id);
  }
  return content;
}

export function findBlockDataForId(id: BlockId): OutputBlockData {
  return getModules().BlockManager.findBlockConfigForId(id).data
}

export function generateId() :BlockId{
  return generateBlockId();
}

export function bindMenu(element: Element) {
  getModules().Event.registerSelectionEvent(element);
}


function loopComplieNode(container:HTMLElement,blockData:OutputBlockData[]){
  container.childNodes.forEach((child:HTMLElement)=>{
    if(child.nodeName == "DIV"){
      loopComplieNode(child,blockData)
    }else if(child.nodeName == "P"){
      if(typeof child.innerHTML !== "undefined") 
        blockData.push(..._.compileParagraph(child.innerHTML))
    }else if(["H1","H2","H3","H4","H5","H6"].includes(child.nodeName)){
      if(typeof child.innerHTML !== "undefined") 
        blockData.push(..._.compileHead(child.innerHTML,child.nodeName.toLowerCase()))
    }else if(["OL","UL"].includes(child.nodeName)){
      let list = []
      child.childNodes.forEach((c:HTMLElement)=> {
        if(typeof c.innerHTML !== "undefined") list.push({text:c.innerHTML})
      });
      blockData.push(_.compileListData(list,child.nodeName.toLowerCase()))
    }else if (child.nodeName == "IMG"){
      let desc = child.getAttribute("alt")
      let url = child.getAttribute("src")
      blockData.push(_.compileImageData({desc,url}))
    }else {
      console.log('【superDoc】:解析节点失败，暂无该节点解析器',child)

    }
  })
}
/**
 * 解析html字符串转换成blockData
 * @param htmlString 
 * @returns blockData[]
 */
export function complieHTMLToBlockData(htmlString:string):OutputBlockData[]{
  console.log(`【superDoc】:解析html字符串转换成blockData`,htmlString)
  let container:HTMLBodyElement = document.createElement('body');
  container.innerHTML = htmlString;
  let blockData = []
  loopComplieNode(container,blockData)
  // 释放节点
  container.remove()
  return blockData  
}


export function deComplieBlockDataToHTML(blockData:OutputBlockData[]){
  try{
    let htmlString =  blockData.map((block)=>{
      if(block.type == "Head"){
        return `<${block.data.level}>${block.data.text}</${block.data.level}>`
      }else if(block.type == "ListDoc"){
        return `<${block.data.type}>${block.data.list.map(item=>{ return `<li>${item.text}</li>`}).join('\r\n')}</${block.data.type}>`
      }else if(block.type == "Paragraph"){
        return `<p>${block.data.text}</p>`
      }else if(block.type == "ImageDoc") {
        return `<div class="">\r\n <img alt="${block.data.desc}" src="${block.data.url}" />\r\n </div>`
      }else {
        console.log(`【superDoc】:${block.type}无识别该类型的解析`)
        return '空' 
      }
    }).join('\r\n');
    return `<html>\r\n<body>\r\n${htmlString}</body>\r\n</html>`
  }catch(e){
    console.error(`【superDoc_error】: 反解析为html失败${e}`)
  }
}

// 上传图片
export async function uploadImage(event:any,url:string, menuId?:any){
      const fd = new FormData();
      !menuId && (menuId = 149);
      fd.append("menuId", menuId);
      fd.append("file", event.file);
      fd.append("img", event.file);
      console.log('upload:lfjs',event.file,event)
     return await axios({
        method: "POST",
        url: url || "/akb/knowledge/resource",
        headers: {
          "content-type": "multipart/form-data",
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: fd,
      });
}
/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
