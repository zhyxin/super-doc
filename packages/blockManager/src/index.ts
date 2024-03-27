import { Module, Dom as $, getElementCoordinates } from "@super-doc/share";
import TimeMachine from "@super-doc/time-machine";
import {
  OutputBlockData,
  BlockId,
  CurrentCopyBlockInfo,
} from "@super-doc/types";
import { generateParagraphData } from "@super-doc/api"
import { Block } from "./block";
import Cursor from './cursor';
import {
  batchInsertBlock,
  findBlockInstanceForId,
  insertBlockForBlockId,
  replaceBlockForBlockId,
  replaceCurrentBlock,
  updateBlockData,
} from "./blockHandler";
export * from "./block";

export default class BlockManager extends Module {
  // 事件存储
  public listeners: WeakMap<OutputBlockData, Set<Function>> = new WeakMap();

  // WeakMap
  public blockInstanceMap: WeakMap<OutputBlockData, Block> = new WeakMap<
    OutputBlockData,
    Block
  >();
  public toolInstances: {
    toolbar: {
      plugins: any[];
      layout: any[];
    };
    inline: any[];
  } = {
    toolbar: {
      plugins: [],
      layout: [],
    },
    inline: [],
  };

  // TODO 后续改成proxy代理
  public get blockInstances(): Block[] {
    const blocks = [];
    this.blocks.forEach((block) => {
      if (this.blockInstanceMap.has(block)) {
        blocks.push(this.blockInstanceMap.get(block));
      }
    });
    return blocks;
  }

  private _currentHoverBlockId: string = null;
  public get currentHoverBlockId(): string {
    if (!this._currentHoverBlockId) {
      return this.blockInstances[0].id;
    } else {
      return this._currentHoverBlockId;
    }
  }

  public set currentHoverBlockId(blockId: string) {
    this._currentHoverBlockId = blockId;
  }

  private _currentBlockId: string = "";
  public get currentBlockId(): string {
    if (!this._currentBlockId) {
      return this.blockInstances[0].id;
    } else {
      return this._currentBlockId;
    }
  }
  public set currentBlockId(value: string) {
    if(value === this._currentBlockId) return;
    this._currentBlockId = value;
    this.Editor.UI.toolbarFollowFocusBlock();
    this.Editor.UI.command.visible = false;
    this.Editor.UI.layout.visible = false;
    // TODO 这里待优化 回车新增block获取焦点和上下箭头获取焦点逻辑冲突了
    if(document.activeElement !== $.querySelector(`[block-id="${this._currentBlockId}"]`)) {
      const blockElement = $.querySelector(`[block-id="${this._currentBlockId}"]`);
      const paragraphEl = blockElement.querySelector('#superdoc-paragraph') as HTMLElement;
      if(paragraphEl) {
        try {
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);
          const { left: x } = getElementCoordinates(range.getBoundingClientRect());
          this.Editor.Event.keyDownInstance.setCursorForX(paragraphEl, x === 0 ? 1000 : x);
        } catch (error) {
          this.Editor.Event.keyDownInstance.setCursorForX(paragraphEl, 0);
        }
      } 
    }
  }

  public get curentFocusBlock(): Block {
    return this.blockInstances.find(
      (block) => block.id === this.currentBlockId
    );
  }

  public get currentHoverBlock(): Block {
    const block = this.blockInstances.find(
      (block) => block.id === this.currentHoverBlockId
    );
    if (!block) {
      debugger;
    }
    return block;
  }


  public get blocks(): OutputBlockData[] {
    return this.config.data.blocks;
  }

  public currentCopyBlockId:string = ""
  public currentCopyBlockInfo: CurrentCopyBlockInfo = {id: "" , 
    status: 0 , 
    content: "" ,
    block: null, 
    data:[],
    type: "text",
  }
  public currentSelectionBlockInfo: CurrentCopyBlockInfo = {id: "" ,  // foucsId
    status: 0 , 
    content: "" , // 文本内容string
    block: null, // 当前focus的实例block
    data:[], // 选择的内容
    type: "text", // 文本类型
  }
  // 被复制的block
  public get currentCopyBlock(): Block[]{
    if(this.currentCopyBlockInfo.status == this.curentFocusBlock.CHECKOUT_ALL_NUMBER){
      return this.blockInstances;
    }
    const block = this.blockInstances.find(
      (block) => block.id === this.currentCopyBlockInfo.id
    );
    if (!block) {
      console.error('获取当前复制的信息状态，block 不存在')
      debugger;
    }
    return [block];
  }

  public cursor:Cursor;

  public prepare(): void {
    this.cursor = new Cursor();
    this.proxyBlocks();
    this.instanceBlocks();
    this.loadTools();
    this.Editor.UI.makeMounted();
    this.Editor.Renderer.reredner();
    if(!this.config.isReadOnly) this.bindEvent();
  }

  proxyBlocks() {
    this.config.data.blocks = new TimeMachine(this.config.data.blocks, {
      events: {
        add: (blocks: OutputBlockData[]) => {
          try {
            const blockInstances = [];
            blocks.forEach((block) => {
              const blockInstance = new Block({ ...block, Editor: this.Editor, BlockManager: this});
              this.blockInstanceMap.set(block, blockInstance);
              blockInstances.push(blockInstance);
            });
            this.Editor.Renderer.reredner();
            blockInstances.forEach((item) => {
              this.syncRendered(item)
              this.changeCurrentBlockId(item.id);
            });
            this.Editor.Event.addListeners.forEach(callback => callback(blocks, this.blocks));
          } catch (error) {
            console.log('添加不是block类型数据', error,blocks);
          }
        },
        update: (proxy: any, key: string, value: any) => {
          console.log('访问路径：', proxy.OBJECT_PATH);
          const blockIndex = Number(proxy.OBJECT_PATH.split('.')[0].replace('[', '').replace(']', ''));
          const block = this.blocks[blockIndex];
          this.Editor.Renderer.reredner();
          const target = this.blocks.find(_block => {
            return _block === block
          });
          this.Editor.Event.updateListeners.forEach(callback => callback(target, this.blocks));
        },
        delete: (blocks: OutputBlockData[]) => {
          console.log('删除内容....')
          try {
            const { id } = blocks[0];
            // TODO 这里需要优化 不能从页面获取上一个block-id
            const preId = document
              .querySelector(`[block-id="${id}"]`)
              .parentNode.parentNode["previousElementSibling"]?.querySelector(
                "[block-id]"
              )
              ?.getAttribute("block-id");
    
            this.currentHoverBlockId = preId || id;
            this.currentBlockId = preId || id;
            this.Editor.Renderer.reredner();
            this.Editor.Event.deleteListeners.forEach(callback => callback(blocks, this.blocks));
          } catch (error) {
            console.log('删除不是block类型数据', blocks);
          }
        },
      },
    }).target;
  }
  private instanceBlocks() {
    this.blocks.forEach((block, index) => {
      try {
        this.blockInstanceMap.set(
          block,
          new Block({
            index,
            id: block.id,
            type: block.type,
            data: block.data,
            Editor: this.Editor,
            class: block.class,
            BlockManager: this,
          })
        );
      } catch (error) {
        console.error(error);
      }
    });
  }
  syncRendered(blockInstance: Block) {
    if(this.config.isReadOnly) return;
    // 绑定事件
    this.bindEvent([blockInstance]);
  }
  public changeCurrentBlockId(id: BlockId) {
    this.currentBlockId = id;
    this.currentHoverBlockId = id;
  }

  bindEvent(blocks: Block[] = this.blockInstances) {
    const _blocks = blocks.filter((block) => !block.isBindEvent);
    if (!_blocks.length) return console.warn("不可重复绑定事件");
    this.Editor.Event.mouseEvent(_blocks);
  }

  public replaceBlockForBlockId = replaceBlockForBlockId;
  public findBlockInstanceForId = findBlockInstanceForId;
  public insertBlockForBlockId = insertBlockForBlockId;
  public batchInsertBlock = batchInsertBlock;
  public replaceCurrentBlock = replaceCurrentBlock;
  public updateBlockData = updateBlockData;
  
  public findBlockConfigForId(blockId: BlockId): OutputBlockData {
    return this.blocks.find(
      (block) => block.id === blockId
    );
  }

  public addToolbarPlugin(plugin) {
    const isExist = this.toolInstances.toolbar.plugins.find(
      (p) => p === plugin
    );
    if (!isExist) return;
    this.toolInstances.toolbar.plugins.push(plugin);
  }

  public getToolByType(type){
    return this.toolInstances.toolbar.plugins.find(item=>item.type == type)
  }
  public getToolByNodeName(nodeName){
    return this.toolInstances.toolbar.plugins.find(item=>item.nodeName?.includes(nodeName))
  }

  public loadTools() {
    const { toolbar } = this.config.tools;
    const { plugins, layout } = toolbar;
    plugins.forEach((Plugin) => {
      const plugin = new Plugin();
      this.toolInstances.toolbar.plugins.push(plugin);
    });
    layout?.forEach((Plugin) => {
      const layout = new Plugin({ Editor: this.Editor });
      this.toolInstances.toolbar.layout.push(layout);
    });
  }

  public removeBlock(blockId: BlockId) {
    // 同步config blocks
    this.blocks.some((block, index, target) => {
      if (block.id === blockId) {
        if(index !== 0) {
          target.splice(index, 1);
          return true;
        } else {
          target.splice(index, 1, generateParagraphData());
        }
      }
    });
  }

  public move(blockId: BlockId, type: string) {
    const { pre, target, next } = this.findBlockInstanceForId(blockId);
    if (type === "UP") {
      // 同步config blocks
      if (!pre || !pre.state) return;
      this.config.data.blocks.splice(
        pre.index,
        2,
        ...[
          this.config.data.blocks[target.index],
          this.config.data.blocks[pre.index],
        ]
      );
      // 同步block instances
      this.blockInstances.splice(
        pre.index,
        2,
        ...[this.blockInstances[target.index], this.blockInstances[pre.index]]
      );
    } else if (type === "DOWN") {
      // 同步config blocks
      if (!next || !next.state) return;
      this.config.data.blocks.splice(
        target.index,
        2,
        ...[
          this.config.data.blocks[next.index],
          this.config.data.blocks[target.index],
        ]
      );
      // 同步block instances
      this.blockInstances.splice(
        target.index,
        2,
        ...[this.blockInstances[next.index], this.blockInstances[target.index]]
      );
    }
    this.Editor.Renderer.reredner();
    this.Editor.UI.layout.visible = false;
  }
  public moveUp(blockId: BlockId) {
    this.move(blockId, "UP");
  }

  public moveDown(blockId: BlockId) {
    this.move(blockId, "DOWN");
  }

  /**
   * 让block处于全选状态
   * TODO：待优化 不应使用findBlockInstanceForId方法
  */
  public checkAllStatus(status: boolean) {
    this.blockInstances.forEach((blockInstance) => {
      blockInstance.checkAll = status;
    });
  }

  public clearSelectionBlockInfo(){
    this.currentSelectionBlockInfo = {
      id: "" ,  // foucsId
      status: 0 , 
      content: "" , // 文本内容string
      block: null, // 当前focus的实例block
      data:[], // 选择的内容
      type: "text", // 文本类型
    }
  }
  public setSelectionBlockInfo(selectionData){
    const {
      id,  // foucsId
      status, 
      content, // 文本内容string
      block, // 当前focus的实例block
      data, // 选择的内容
      type, // 文本类型
    } = selectionData;

    this.currentSelectionBlockInfo = {
      id,  // foucsId
      status, 
      content , // 文本内容string
      block, // 当前focus的实例block
      data, // 选择的内容
      type, // 文本类型
    }
  }
  public setCurrentBlockInfo(key,object){
    const {
      id,  // foucsId
      status, 
      content, // 文本内容string
      block, // 当前focus的实例block
      data, // 选择的内容
      type, // 文本类型
    } = object;

    this[key] = {
      id,  // foucsId
      status, 
      content , // 文本内容string
      block, // 当前focus的实例block
      data, // 选择的内容
      type, // 文本类型
    }
  }



}
