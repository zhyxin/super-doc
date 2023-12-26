import {
  Module,
  deepFindBlockIdElement,
  getElementCoordinates,
  keyCodes,
} from "@super-doc/share";
import { Dom as $ } from "@super-doc/share";
import { generateParagraphData } from "@super-doc/api";
import { BlockInstance } from "@super-doc/types";

export default class Event extends Module {
  public addListeners: Set<Function> = new Set();
  public deleteListeners: Set<Function> = new Set();
  public updateListeners: Set<Function> = new Set();

  public mouseX: number;
  public mouseY: number;

  private SELECT_TIME: number = 0;
  public Selection:any= {};
  public prepare(): void {
    this.registerGlobalEvent();
    this.registerBlankAreaEvent();
    this.registerMenuEvent();
  }

  /**
   * 全局事件
   */
  private registerGlobalEvent() {
    this.registerGlobalSelectionEvent();
    this.registerGlobalMouseUpEvent();
    this.registerGlobalMouseDownEvent();
    this.registerGlobalDocumentMousemove();
  }

  private registerGlobalSelectionEvent() {
    document.removeEventListener(
      "selectionchange",
      this.sectionHandler.bind(this)
    );
    document.addEventListener(
      "selectionchange",
      this.sectionHandler.bind(this)
    );
  }

  private registerGlobalMouseUpEvent() {
    document.removeEventListener("mouseup", this.mouseUpHandler.bind(this));
    document.addEventListener("mouseup", this.mouseUpHandler.bind(this));
  }
  private registerGlobalMouseDownEvent() {
    document.removeEventListener("mousedown", this.mouseDownHandler.bind(this));
    document.addEventListener("mousedown", this.mouseDownHandler.bind(this));
  }
  private mouseUpHandler() {
    clearTimeout(this.SELECT_TIME);
    const selection = window.getSelection();
    if (!selection.isCollapsed && selection.rangeCount > 0) {
      this.SELECT_TIME = setTimeout(() => {
        const rang = selection.getRangeAt(0);
        this.Editor.UI.menu.visible = true;
      }, 100);
    } else {
      this.Editor.UI.menu.visible = false;
    }
  }
  private mouseDownHandler() {
    this.Editor.UI.menu.visible = false;
    clearTimeout(this.SELECT_TIME);
  }

  private sectionHandler(event) {
    const selection = window.getSelection();
    if(selection.type !== "Range") return;
    // [
    //   'collapsed',
    //   'commonAncestorContainer',
    //   'endContainer',
    //   'endOffset',
    //   'startContainer',
    //   'startOffset'
    // ].forEach((key) => {
    //   this.Selection[key] = selection.getRangeAt(0)[key];
    // });
    this.Selection = window.getSelection().getRangeAt(0);
    this.Selection['content'] = selection.toString();

    clearTimeout(this.SELECT_TIME);
  }

  public bindKeydownEvent(blocks): void {
    blocks.forEach((block) => {
      block.element.addEventListener("keydown", this.keydownEvent.bind(this));
    });
  }

  public registerGlobalDocumentMousemove() {
    document.addEventListener("mousemove", (event) => {
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

  public menuEvent(blocks: BlockInstance[]) {}

  public inputEvent(event: any): void {
    const el = event.target;
    if (!el) return;
    const blockId = deepFindBlockIdElement(el);
    if (!blockId) return;
    const block = this.Editor.BlockManager.findBlockConfigForId(blockId);
    // block.data.text = el.textContent;
    /**
     * 光标处理，解决innerHTML后光标重置到开头的问题
    */
    // let selection = window.getSelection();
    // let range = selection.getRangeAt(0);
    // let caretPosition = range ? range.startOffset : 0;
    /**
     * 同步数据到block
    */
    block.data.text = el.innerHTML;
    console.log('内置');
    /**
     * 光标处理，解决innerHTML后光标重置到开头的问题
    */
    // selection.removeAllRanges()
    // range?.setStart(el.firstChild, caretPosition);
    // selection.addRange(range);
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
      console.error(e);
    }
  }

  public mouseClick(event: any) {
    let el = event.currentTarget.getAttribute("[block-id]");
    if (!el) {
      el = event.currentTarget.querySelector("[block-id]");
    }
    if (!el) return;
    let blockId = el.getAttribute("block-id");
    this.Editor.BlockManager.currentBlockId = blockId;
    // this.Editor.BlockManager.findBlockForId(blockId);
  }

  public onmouseout(event: any) {}

  public onmouseover(event: any) {
    let target = event.currentTarget;
    target = target.querySelector("[block-id]");
    if (!target) {
      console.log(event);
      return;
    }
    const blockId = target.getAttribute("block-id");
    const toolbar = this.Editor.UI.nodes.toolbarWrapper;
    // TODO: 这里有bug 临时处理
    if (!this.Editor.BlockManager?.currentHoverBlock?.element) {
      debugger;
      return;
    }
    if (this.Editor.UI.command.visible || this.Editor.UI.layout.visible) return;
    if (blockId) {
      let { left: x, top: y, rect } = getElementCoordinates(target);
      toolbar.style = !!toolbar.style ? toolbar.style : {};
      toolbar.style.left = x - 50 + "px";
      if (rect.height <= 45) {
        toolbar.style.top = y + (rect.height - 24) / 2 + "px";
      } else {
        toolbar.style.top = y + 3 + "px";
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
    if (type === "add") {
      this.addListeners.add(callback);
    } else if (type === "delete") {
      this.deleteListeners.add(callback);
    } else if (type === "update") {
      this.updateListeners.add(callback);
    }
  }

  public registerBlankAreaEvent() {
    $.querySelector(`.${this.Editor.UI.CSS.editorZone}`).addEventListener(
      "click",
      () => {
        const lastBlock = this.Editor.BlockManager.blocks.slice(-1);
        if (
          lastBlock &&
          !!lastBlock.length &&
          lastBlock[0].type.toLowerCase() !== "paragraph"
        ) {
          this.Editor.BlockManager.blocks.push(generateParagraphData());
        } else {
          this.Editor.BlockManager.currentBlockId =
            this.Editor.BlockManager.blocks.slice(-1)[0].id;
          this.Editor.BlockManager.currentHoverBlockId =
            this.Editor.BlockManager.blocks.slice(-1)[0].id;
        }
      },
      true
    );
  }

  public registerMenuEvent() {
    const { menuElMap } = this.Editor.UI.menu;
    const { menuInstanceMap } = this.Editor.Menu;
    this.config.tools.menu.forEach((Menu) => {
      const el = menuElMap.get(Menu);
      const menuInstance = menuInstanceMap.get(Menu);
      el.addEventListener("click", (event: any) => {
        const placing = menuInstance.action(this.Selection?.content);
        this.Selection.deleteContents();
        this.Selection.insertNode(placing);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(this.Selection);
      });
    });
  }
}
