'use strict';

import { EditorConfig, OutputBlockData } from '@super-doc/types';

import Core from './core';
import * as _ from '@super-doc/share';
import { Block } from '@super-doc/block-manager';
import { generateParagraphData ,complieHTMLToBlockData, deComplieBlockDataToHTML} from '@super-doc/api';

export default class SuperDoc {

  public isReady: Promise<void>;

  public blocks: Block[] = [];
  
  public editor: Core = null;


  // 解析字符串html方法 转成blockData
  static complieHTMLToBlockData(htmlString:string){
    return complieHTMLToBlockData( htmlString);
  }

  static deComplieBlockDataToHTML(blockData:OutputBlockData[]){
   return deComplieBlockDataToHTML(blockData)
  }

  constructor(configuration?: EditorConfig) {

    let onReady = (): void => {};

    if (configuration && _.isObject(configuration) && _.isFunction(configuration.onReady)) {
        onReady = configuration.onReady;
    }
    this.editor = new Core(configuration);
    
    this.isReady = this.editor.isReady.then(() => {
    //   this.exportAPI(editor);
        // 调用用户传入的渲染完成后的回调
        if(this.editor.config.isReadOnly) {
          this.closeEditor();
        }
        onReady();

    });
  }

  closeEditor() {
    document.querySelectorAll('[contenteditable=true]').forEach(el => el.setAttribute('contenteditable', 'false'));
    this.editor.moduleInstances.UI.nodes.holder['style']['user-select'] = 'none';
  }

  /**
   * 设置blocks数据
  */
  public setData(jsonData: OutputBlockData[]) {
    let blockJson;
    if(!jsonData || !jsonData.length) {
      blockJson = [ generateParagraphData() ]
    } else {
      blockJson = _.deepClone(jsonData);
    }
    this.editor.config.data.blocks.length = 0;
    blockJson.forEach(item => {
      item.id = item.id ? item.id : _.generateBlockId();
      this.editor.config.data.blocks.push(item)
    })
    // TODO:待优化
    if(this.editor.config.isReadOnly) {
      setTimeout(()=>{
        this.closeEditor();
      })
    }
  }

  /**
   *  获取文本字符串
   */
  getTextContent() {
    return this.editor.moduleInstances.BlockManager.blockInstances.map(instance => {
      return instance?.element?.textContent;
    }).filter(text => !!text);  
  }

  /**
   * 获取json
  */
  getBlocks() {
    return this.editor.config.data.blocks;
  }

  on(type, callback) {
    if(type === 'add') {
      this.editor.moduleInstances.Event.addListeners.add(callback);
    } else if (type === 'delete') {
      this.editor.moduleInstances.Event.deleteListeners.add(callback);
    } else if (type === 'update') {
      this.editor.moduleInstances.Event.updateListeners.add(callback);
    }
  }

  remove(type, callback) {
    if(type === 'add') {
      this.editor.moduleInstances.Event.addListeners.delete(callback);
    } else if (type === 'delete') {
      this.editor.moduleInstances.Event.deleteListeners.delete(callback);
    } else if (type === 'update') {
      this.editor.moduleInstances.Event.updateListeners.delete(callback);
    }
  }

    // 解析字符串html方法 转成blockData
  complieHTMLToBlockData(htmlString:string){
    let manager = this.editor.moduleInstances.BlockManager
    console.log(`【superDoc】:解析html字符串转换成blockData`,htmlString)
    let body:HTMLBodyElement = document.createElement('body');
    body.innerHTML = htmlString;
    let blockData = []
    loopComplieNode(body,blockData)

    function loopComplieNode(container,blockData){
      container.childNodes.forEach((child:HTMLElement)=>{
        if(child.nodeName == "DIV"){
          loopComplieNode(child,blockData)
        }else {
          let toolPlugin = manager.getToolByNodeName(child.nodeName);
          toolPlugin && toolPlugin?.complieHTMLToBlockData(child,blockData)
          if(!toolPlugin){
            console.log('【superDoc】:解析节点失败，暂无该节点解析器',child)
          }
        }
      })
    }
    // 释放节点
    body.remove()
    return blockData  
  }
  
  // blockData解析字符串html方法
  deComplieBlockDataToHTML(blockData:OutputBlockData[]){
    let manager = this.editor.moduleInstances.BlockManager
    try{
      let htmlString =  blockData.map((block)=>{
        let toolPlugin = manager.getToolByType(block.type)
        if(toolPlugin && toolPlugin.deComplieBlockDataToHTML){
          return  toolPlugin.deComplieBlockDataToHTML(block)
        }else{
           console.log(`【superDoc】:${block.type}无识别该类型的解析`,block)
          return '空' 
       }
      }).join('\r\n');
      return `<html>\r\n<body>\r\n${htmlString}</body>\r\n</html>`
    }catch(e){
      console.error(`【superDoc_error】: 反解析为html失败${e}`)
    }
  }

  destroy() {
    this.editor.destroy();
  }
}
