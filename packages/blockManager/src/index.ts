import { Module, generateBlockId, Dom as $ } from "@super-doc/share";
import TimeMachine from "@super-doc/time-machine";
import {
  EditorConfig,
  BlockToolData,
  BlockTuneData,
  OutputBlockData,
  BlockId,
} from "@super-doc/types";
import Blocks from "./components/blocks";
import { Block } from "./components/block";
import {
  batchInsertBlock,
  findBlockInstanceForId,
  insertBlockForBlockId,
  replaceBlockForBlockId,
  replaceCurrentBlock,
} from "./blockHandler";
export * from "./components/block";
interface ModuleConfig {
  config: EditorConfig;
}
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
    this._currentBlockId = value;
    this.Editor.UI.toolbarFollowFocusBlock();
    this.Editor.UI.command.visible = false;
    setTimeout(() => {
      $.querySelector(`[block-id="${this._currentBlockId}"]`)?.focus();
    }, 20);
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

  public prepare(): void {
    this.proxyBlocks();
    this.blocks.forEach((block, index) => {
      console.log(block.class);
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
          })
        );
      } catch (error) {
        console.error(error);
      }
    });
    this.loadTools();
    if(!this.config.isReadOnly) this.bindEvent();
    this.changeIsBindStatus(this.blockInstances);
  }

  proxyBlocks() {
    this.config.data.blocks = new TimeMachine(this.config.data.blocks, {
      events: {
        add: (blocks: OutputBlockData[]) => {
          const blockInstances = [];
          blocks.forEach((block) => {
            const blockInstance = new Block({ ...block, Editor: this.Editor });
            this.blockInstanceMap.set(block, blockInstance);
            blockInstances.push(blockInstance);
          });
          this.Editor.Renderer.reredner();
          blockInstances.forEach((item) => this.syncRendered(item));
          this.Editor.Event.addListeners.forEach(callback => callback(this.blocks, blocks));
        },
        update: (block: OutputBlockData, key: string, value: any) => {
          
          // TODO：更新这部分逻辑待补充
          this.listeners
            .get(block)
            ?.forEach((callback) => callback(this.blocks, block, key, value));
          this.Editor.Renderer.reredner();
          if(key !== 'text') return;
          const target = this.blocks.find(_block => {
            return _block.data === block
          });
          this.Editor.Event.updateListeners.forEach(callback => callback(this.blocks, target));
        },
        delete: (blocks: OutputBlockData[]) => {
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
          this.Editor.Event.deleteListeners.forEach(callback => callback(this.blocks, blocks));
        },
      },
    }).target;
    console.log(this.config, "---");
  }

  syncRendered(blockInstance: Block) {
    // 绑定事件
    this.bindEvent([blockInstance]);
    // 改变绑定状态
    this.changeIsBindStatus([blockInstance]);
    // 改变当前焦点
    this.currentBlockId = blockInstance.id;
    this.currentHoverBlockId = blockInstance.id;
  }

  bindEvent(blocks: Block[] = this.blockInstances) {
    const _blocks = blocks.filter((block) => !block.isBindEvent);
    if (!_blocks.length) return console.warn("不可重复绑定事件");
    this.Editor.Event.mouseEvent(_blocks);
    this.Editor.Event.bindKeydownEvent(_blocks);
  }

  public changeIsBindStatus(blockInstances: Block[] = this.blockInstances) {
    blockInstances.forEach((block) => (block.isBindEvent = true));
  }

  public replaceBlockForBlockId = replaceBlockForBlockId;
  public findBlockInstanceForId = findBlockInstanceForId;
  public insertBlockForBlockId = insertBlockForBlockId;
  public batchInsertBlock = batchInsertBlock;
  public replaceCurrentBlock = replaceCurrentBlock;

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

  public loadTools() {
    const { toolbar, inline } = this.config.tools;
    const { plugins, layout } = toolbar;
    plugins.forEach((Plugin) => {
      const plugin = new Plugin();
      this.toolInstances.toolbar.plugins.push(plugin);
    });
    layout?.forEach((Plugin) => {
      const plugin = new Plugin({ Editor: this.Editor });
      this.toolInstances.toolbar.layout.push(plugin);
    });
  }

  public removeBlock(blockId: BlockId) {
    // 同步config blocks
    this.blocks.some((block, index, target) => {
      if (block.id === blockId && index !== 0) {
        target.splice(index, 1);
        return true;
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
  }
  public moveUp(blockId: BlockId) {
    this.move(blockId, "UP");
  }

  public moveDown(blockId: BlockId) {
    this.move(blockId, "DOWN");
  }
}
