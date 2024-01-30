'use strict';

import { EditorConfig, OutputBlockData } from '@super-doc/types';

import Core from './components/code';
import * as _ from '@super-doc/share';
import { Block } from '@super-doc/block-manager';

export default class SuperDoc {

  public isReady: Promise<void>;

  public blocks: Block[] = [];
  
  public editor: Core = null;
  constructor(configuration?: EditorConfig) {

    let onReady = (): void => {};

    if (configuration && _.isObject(configuration) && _.isFunction(configuration.onReady)) {
        onReady = configuration.onReady;
    }
    this.editor = new Core(configuration);
    
    this.isReady = this.editor.isReady.then(() => {
    //   this.exportAPI(editor);
        // 调用用户传入的渲染完成后的回调
        onReady();
    });
  }

  /**
   * 设置blocks数据
  */
  public setData(jsonData: OutputBlockData[]) {
    const blockJson = _.deepClone(jsonData);
    this.editor.config.data.blocks.length = 0;
    blockJson.forEach(item => {
      item.id = item.id ? item.id : _.generateBlockId();
      this.editor.config.data.blocks.push(item)
    })
    
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

}
