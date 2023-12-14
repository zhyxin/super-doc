import { Module, deepFindBlockIdElement, getElementCoordinates, keyCodes } from "@super-doc/share";
import { Dom as $ } from "@super-doc/share";
import { generateParagraphData } from '@super-doc/api';
export default class Event extends Module {

  public addListeners: Set<Function> = new Set();
  public deleteListeners: Set<Function> = new Set();
  public updateListeners: Set<Function> = new Set();
  
  public mouseX: number;
  public mouseY: number;

  

  public prepare(): void {
    // this.state.BlockManager.blockInstances
    this.documentMousemove();
    this.blankAreaEvent();
  }

  public bindKeydownEvent(blocks): void {
    blocks.forEach((block) => {
      block.element.addEventListener("keydown", this.keydownEvent.bind(this));
    });
  }

  public documentMousemove() {
    document.addEventListener('mousemove', (event) => {
        this.mouseX = event.pageX;
        this.mouseY = event.pageY;
    });
  }

  public mouseEvent(blocks) {
    blocks.forEach((block) => {
      block.element.addEventListener("click", this.mouseClick.bind(this));
      block.element.addEventListener("input", this.inputEvent.bind(this));
      // block.element.addEventListener("mouseout", this.onmouseout.bind(this));
      block.element.addEventListener(
        "mouseover",
        this.onmouseover.bind(this),
        true
      );
    });
  }

  public inputEvent(event: any): void {
    const el = event.target;
    if(!el) return;
    const blockId = deepFindBlockIdElement(el);
    if(!blockId) return;
    const block = this.Editor.BlockManager.findBlockConfigForId(blockId);
    block.data.text = el.textContent;

  }

  public keydownEvent(event: any): void {
    try {
      switch (event.keyCode) {
        case keyCodes.ENTER:
          this.Editor.BlockManager.insertBlockForBlockId();
          event.preventDefault();
          break;
        case keyCodes.BACKSPACE:
          const { BlockManager } = this.Editor;
          const element =
            BlockManager.curentFocusBlock.element.querySelector(`[block-id]`);
          if (element.childNodes.length === 0) {
            BlockManager.removeBlock(BlockManager.curentFocusBlock.id);
            event.preventDefault();
          } else if (element.childNodes.length > 0) {
          }
          break;
      }
    } catch (e) {
      console.error(e)
    }
  }

  public mouseClick(event: any) {
    let el = event.currentTarget.getAttribute('[block-id]');
    if(!el) {
      el = event.currentTarget.querySelector('[block-id]');
    }
    if(!el) return;
    let blockId = el.getAttribute("block-id");
    this.Editor.BlockManager.currentBlockId = blockId;
    // this.Editor.BlockManager.findBlockForId(blockId);
  }

  public onmouseout(event: any) {
  }

  public onmouseover(event: any) {
    let target = event.currentTarget;
    target = target.querySelector('[block-id]')
    if(!target) {
      console.log(event)
      return;
    };
    const blockId = target.getAttribute('block-id');
    const toolbar = this.Editor.UI.nodes.toolbarWrapper;
    // TODO: 这里有bug 临时处理
    if(!this.Editor.BlockManager?.currentHoverBlock?.element) {
      debugger
      return;
    }
    if(this.Editor.UI.command.visible || this.Editor.UI.layout.visible) return;
    if (blockId) {
      let { left:x, top:y, rect } = getElementCoordinates(target);
      toolbar.style = !!toolbar.style ? toolbar.style : {};
      toolbar.style.left = (x - 50)+ "px";
      if(rect.height <= 45) {
        toolbar.style.top = (y + ((rect.height - 24)/2)) + 'px';
      } else {
        toolbar.style.top = (y + 3) + 'px';
      }
      
      event.stopPropagation();
      toolbar.classList.add(this.Editor.UI.CSS.superDocToolbarOpen);
      this.Editor.BlockManager.currentHoverBlockId = blockId;
    }
  }
  
  public enter(event: KeyboardEvent): void {
    event.preventDefault();
  }

  // clickEditorEvent() {
  //     const blockInstances = this.Editor.BlockManager.blockInstances;
  //     blockInstances.forEach(block => {
  //         block.element
  //     })
  // }

  public addShowCommandListEvent(element: HTMLElement) {
    element.addEventListener("click", () => {
      this.Editor.UI.layout.visible = false;
      this.Editor.UI.command.visible = true;
    });
  }

  public addShowLayoutToolListEvent(element: HTMLElement) {
    element.addEventListener("click", () => {
      this.Editor.UI.command.visible = false;
      this.Editor.UI.layout.visible = true;
    });
  }

  public on(type: string, callback: Function) {
    if(type === 'add') {
      this.addListeners.add(callback);
    } else if(type === 'delete') {
      this.deleteListeners.add(callback);
    } else if (type === 'update') {
      this.updateListeners.add(callback);
    }
  }

  public blankAreaEvent() {
    $.querySelector(`.${this.Editor.UI.CSS.editorZone}`).addEventListener('click', () => {
      const lastBlock = this.Editor.BlockManager.blocks.slice(-1);
      if(lastBlock && !!lastBlock.length && lastBlock[0].type.toLowerCase() !== "paragraph") {
        this.Editor.BlockManager.blocks.push(generateParagraphData());
      } else {  
        this.Editor.BlockManager.currentBlockId = this.Editor.BlockManager.blocks.slice(-1)[0].id;
        this.Editor.BlockManager.currentHoverBlockId = this.Editor.BlockManager.blocks.slice(-1)[0].id;
      }
    }, true)
  }
}
