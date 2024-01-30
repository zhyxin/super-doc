  import { Block } from "@super-doc/block-manager";
  import { Module, Dom as $, isString, isDOM } from "@super-doc/share";
  import interComponents from "@super-doc/components";
import { MountedCallback } from "@super-doc/types";
  export default class Renderer extends Module {
    public block2html(block: Block): [HTMLElement, MountedCallback] {
      const [dom, callback] = this.blockTypeTrans(block);
      const element = this.assembleBlockEl(dom);
      return [element, callback];
    }
  
    blockTypeTrans(block: Block): [HTMLElement, MountedCallback] {
      if (block.class) {
        const _class = window[block.class] ?? interComponents.blocks[block.class];
        const blockInstance = new _class({
          config: block,
          "block-id": block.id,
        });
        return blockInstance._render();
      } else {
        throw "不存在block对应的class";
      }
    }
  
    public assembleBlockEl(el: HTMLElement): HTMLElement {
      const blockContainerDiv = this.Editor.UI.generateBlockContainerDiv();
      blockContainerDiv.firstChild.appendChild(el)
      return blockContainerDiv;
    }
  
    public firstInsert(): void {
      const blockInstances = this.Editor.BlockManager.blockInstances;
      let wrapEl = null;
      if (isString(this.config.holder)) {
        wrapEl = $.querySelector(this.config.holder as string);
      } else if (isDOM(this.config.holder)) {
        wrapEl = this.config.holder;
      }
      if (!wrapEl) throw `不存在元素${this.config.holder}`;
      wrapEl = wrapEl.querySelector(`.${this.Editor.UI.CSS.editorZone}`);
      blockInstances.forEach((block) => wrapEl.appendChild(block.element));
    }
  
    public getEditorZone() {
      const { UI } = this.Editor;
      return $.get(UI.CSS.editorZone);
    }
  
    public renderForBlockDataId(blockId: string) {
      const blockInstances = this.Editor.BlockManager.blockInstances;
      let block = null;
      blockInstances.some((_block, index, target) => {
        if (_block.id === blockId) {
          target[index - 1].element.insertAdjacentElement(
            "afterend",
            _block.element
          );
          block = _block;
          return true;
        }
      });
      return block;
    }
  
    public reredner() {
      const { blockInstances } = this.Editor.BlockManager;
      const blockInstanceElement = blockInstances.map((block) => block.element);
      const { editorZone, wrapper } = this.Editor.UI.CSS;
  
      const blocksContainer = $.querySelector(`.${editorZone}`);
      let blockDocEls = Array.from(
        blocksContainer.querySelectorAll(`.${wrapper}`)
      );
  
      // 删除不存在
      blockDocEls.forEach((element: any) => {
        if (!blockInstanceElement.includes(element)) {
          element.remove();
        }
      });
      blockDocEls = Array.from(
        blocksContainer.querySelectorAll(`.${wrapper}`)
      );
  
      // 添加
      blockInstances.forEach((block, index) => {
        if(!blockDocEls.includes(block.element)) {
          if(index > blockDocEls.length - 1) {
            blocksContainer.appendChild(block.element);
          } else {
            blocksContainer.insertBefore(block.element, blockDocEls[index]);
          }
          block.mountedCallback();
        }
      })
  
      // 调换位置
      // TODO: 这里需要优化 当使用splice插入多个block时，会存在新的block数量跟旧的的数量不相同
      blockDocEls = Array.from(
        blocksContainer.querySelectorAll(`.${wrapper}`)
      );
      if(blockInstances.length !== blockDocEls.length) return

      blockInstances.forEach((block, index, _t) => {
        blockDocEls = Array.from(
          blocksContainer.querySelectorAll(`.${wrapper}`)
        );
        if (block.element !== blockDocEls[index]) {
          let node1 = block.element;
          let node2 = blockDocEls[index];
          let sibling = node2.nextSibling === node1 ? node2 : node2.nextSibling; 
          blocksContainer.insertBefore(node2, node1);
          blocksContainer.insertBefore(node1, sibling);
        }
      });
    }
  }
  