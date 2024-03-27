import {
  Module,
  deepFindBlockIdElement,
  getBlockIdForElement,
  getElementCoordinates,
  keyCodes,
  isString,
  isDOM
} from "@super-doc/share";
import { Dom as $ } from "@super-doc/share";
import { event, generateParagraphData } from "@super-doc/api";
import { BlockInstance } from "@super-doc/types";

import KeyDown from "./modules/keyDown";
import { getSelectionBlockData } from "./modules/utils/execCommand";

export default class Event extends Module {
  [x: string]: any;
  public addListeners: Set<Function> = new Set();
  public deleteListeners: Set<Function> = new Set();
  public updateListeners: Set<Function> = new Set();

  public globalClickListenerList: Function[] = [];

  public viewPort: number;
  public viewPortY: number;

  private SELECT_TIME: any;
  private DOWN_TIME:any
  public Selection: any = {};

  public keyDownInstance: KeyDown = null;

  isSelecting = false; // 是否处于框选状态
  public selectionChange

  public prepare(): void {
    if(this.config.isReadOnly) return;
    this.registerSelectionEvent()
    this.registerGlobalEvent();
    this.registerBlankAreaEvent();
    this.registerMenuEvent();
    this.regiterateGlobalClickEvent();
  }

  /**
   * 全局事件
   */
  private registerGlobalEvent() {
    this.registerGlobalDocumentMousemove();
    this.registerGlobalClickEvent();
    this.regiterGlobalKeyDownEvent()

  }

  /**
   * 注册光标方向的事件
   */
  public bindKeydownEvent(blockInstance: BlockInstance[], Event: Event) {
    this.keyDownInstance = new KeyDown(blockInstance, Event);
  }

  public registerSelectionEvent(element?: Element): void {
    this.selectionChangeEvent = this.bindEventListener(document,"selectionchange",this.sectionHandler.bind(this))()
    // document.removeEventListener(
    //   "selectionchange",
    //   this.sectionHandler.bind(this)
    // );
    // document.addEventListener(
    //   "selectionchange",
    //   this.sectionHandler.bind(this)
    // );
    this.mouseUpEvent = this.bindEventListener(document,"mouseup",this.mouseUpHandler.bind(this))()
    this.mouseDownEvent = this.bindEventListener(document,"mousedown",this.mouseDownHandler.bind(this))()
    this.mouseMoveEvent = this.bindEventListener(document,"mousemove",this.mouseMoveHandler.bind(this))()

    // document.removeEventListener("mouseup", this.mouseUpHandler.bind(this));
    // document.addEventListener("mouseup", this.mouseUpHandler.bind(this));

    // document.removeEventListener("mousedown", this.mouseDownHandler.bind(this));
    // document.addEventListener("mousedown", this.mouseDownHandler.bind(this));
  }

  private mouseUpHandler(event) {
    clearTimeout(this.SELECT_TIME);
    const selection = window.getSelection();
    if (!selection.isCollapsed && selection.rangeCount > 0) {
      this.SELECT_TIME = setTimeout(() => {
        this.Editor.UI.menu.visible = true;
      }, 100);
    } else {
      this.Editor.UI.menu.visible = false;
    }
    clearTimeout(this.DOWN_TIME)
    this.setContentEdiableBySelector("false")
    this.isSelecting = false;
  }
  private mouseDownHandler(event) {
    this.Editor.UI.menu.visible = false;
    // 保证页面的框选功能有效
    clearTimeout(this.SELECT_TIME);
    this.isSelecting = true;
    // 设置编辑态到最外层。增加range的选择范围
    this.setContentEdiableBySelector("true")
    let range = document.caretRangeFromPoint(event.clientX, event.clientY);
  }
  private sectionHandler(event) {
    const selection = window.getSelection();
    if (selection.type !== "Range") return;
    this.Selection = window.getSelection().getRangeAt(0);
    this.Selection["content"] = selection.toString();

    clearTimeout(this.SELECT_TIME);
    let manager = this.Editor.BlockManager;
    getSelectionBlockData.call(this,event,manager.curentFocusBlock)
  }

  public registerGlobalDocumentMousemove() {
    // document.addEventListener("mousemove", this.mouseMoveHandler.bind(this));
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
    const [id, element] = getBlockIdForElement(event.currentTarget);
    const block = this.Editor.BlockManager.findBlockConfigForId(id);
    block.data.text = element.innerHTML;
  }

  public mouseClick(event: any) {
    // BUGGER 事件触发了两次
    console.log('【super_doc】block点击')
    if(!document.contains(event.currentTarget)) return;
    const [id] = getBlockIdForElement(event.currentTarget);
    this.Editor.BlockManager.changeCurrentBlockId(id);
    this.Editor.BlockManager.cursor.block = this.Editor.BlockManager.curentFocusBlock;
    this.Editor.UI.command.visible = false;
    this.Editor.UI.layout.visible = false;
    this.setContentEdiableBySelector("false")

  }

  public setContentEdiableBySelector(contenteditable: string){
    const editorZoneElement = $.querySelector(
      `.${this.Editor.UI.CSS.editorZone}`
    );
    if(!editorZoneElement) return
    if(contenteditable == "false"){
      editorZoneElement.removeAttribute("contenteditable")
    }else{
      editorZoneElement.setAttribute('contenteditable',contenteditable)
    }
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
      // 这里不应该用window作为依据
      // let {
      //   left: x,
      //   top: y,
      //   rect,
      // } = getElementCoordinates(target.getBoundingClientRect());
      let holder
      if (isString(this.config.holder)) {
        holder =  $.querySelector(this.config.holder as string)
      } else if (isDOM(this.config.holder)) {
        holder = this.config.holder
      }
      let rect = target.getBoundingClientRect()
      let hodlerRect = holder.getBoundingClientRect();
      toolbar.style = !!toolbar.style ? toolbar.style : {};
      toolbar.style.left = rect.left - hodlerRect.left - 60 + "px";
      toolbar.style.top = rect.top - hodlerRect.top + 3 + "px";

      event.stopPropagation();
      toolbar.classList.add(this.Editor.UI.CSS.superDocToolbarOpen);
      this.Editor.BlockManager.currentHoverBlockId = blockId;
    }
  }

  public enter(event: KeyboardEvent): void {
    event.preventDefault();
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
    const editorZoneElement = $.querySelector(
      `.${this.Editor.UI.CSS.editorZone}`
    );
    editorZoneElement.addEventListener(
      "click",
      (event:any) => {
        if(window.getSelection().isCollapsed){
          event.target.focus();
          this.Editor.BlockManager.clearSelectionBlockInfo();
        }
        if (event.target !== editorZoneElement) return;
        const lastBlock = this.Editor.BlockManager.blocks.slice(-1);
        if (
          lastBlock &&
          !!lastBlock.length &&
          lastBlock[0].type.toLowerCase() !== "paragraph"
        ) {
          this.Editor.BlockManager.blocks.push(generateParagraphData());
        } else {
          console.log(this.Editor.BlockManager.blocks.slice(-1)[0].id);
          this.Editor.BlockManager.changeCurrentBlockId(
            this.Editor.BlockManager.blocks.slice(-1)[0].id
          );
        }
      },
      true
    );
    
  }

  public registerGlobalClickEvent() {
    this.Editor.UI.nodes.wrapper.addEventListener("click", (event) => {
      this.Editor.BlockManager.checkAllStatus(false);
    });
  }
  public registerMenuEvent() {
    const { menuElMap } = this.Editor.UI.menu;
    const { menuInstanceMap } = this.Editor.Menu;
    this.config.tools.menu.forEach((Menu) => {
      const el = menuElMap.get(Menu);
      const menuInstance = menuInstanceMap.get(Menu);
      el.addEventListener("click", (event: any) => {
        const placing = menuInstance.action(this.Selection?.content, this.Editor.BlockManager.curentFocusBlock);
        if(placing) {
          this.Selection.deleteContents();
          this.Selection.insertNode(placing);
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(this.Selection);
        }
      });
    });
  }

  public regiterateGlobalClickEvent() {
    this.Editor.UI.nodes.holder.addEventListener("click", (event: any) => {
      this.globalClickListenerList.forEach((fn) => fn());
    });
  }

  // 注册window的keydown事件
  public regiterGlobalKeyDownEvent(){
    // const editorZoneElement = $.querySelector(
    //   `.${this.Editor.UI.CSS.editorZone}`
    // );
    // editorZoneElement.addEventListener('keydown',(e)=>{})
    // 暂时这么做。其他dom的获取keydom好像都不行。
    this.windowKeyDownEvent = this.bindEventListener(window,"keydown",this.windowKeyDownHanlder.bind(this))()
  }

  public windowKeyDownHanlder(event){
    let manager = this.Editor.BlockManager;
    let curentFocusBlock = manager.curentFocusBlock;
    let  that = this;
    if (event.keyCode === keyCodes.BACKSPACE) {
      let selection = window.getSelection();
      let selectedRange 
      if(selection.type !== "None"){
        selectedRange = selection?.getRangeAt(0);
      }
      if(manager.currentSelectionBlockInfo.data.length!==0 && manager.currentSelectionBlockInfo.type == 'block'){
        if(that.keyDownInstance.isCheckAllStatus()){
          JSON.parse(JSON.stringify(manager.currentSelectionBlockInfo.data)).forEach((item,index)=>{
              manager.removeBlock(item.id);
          })
          event.preventDefault()
          return
        }
        // 清除选中内容
        selectedRange && selectedRange.extractContents();
        manager.currentSelectionBlockInfo.data.forEach((item,index)=>{
          let block = manager.findBlockInstanceForId(item.id);
          // 逻辑是选取的内容中间全部去除。执行剪切事件。 (不严谨暂时处理)
          if(index == 0 || manager.currentSelectionBlockInfo.data.length - 1 ==index){
            let cutEventCallBack  = block.target?.state?.instance?.cutEventCallBack
            cutEventCallBack && cutEventCallBack({Event:that},event,item,block.target.state)
          }else{
            manager.removeBlock(item.id);
          }
        })
        event.preventDefault()
      }else if(manager.currentBlockId && curentFocusBlock.type=="ImageDoc"){
        // manager.removeBlock(manager.currentBlockId);
      }
    } 
  }

  mouseMoveHandler(event){
    this.viewPortX = event.x;
    this.viewPortY = event.y;
  }


  // 注销事件
  public destory(){
    this.mouseMoveEvent();
    this.mouseDownEvent()
    this.mouseUpEvent()
    this.selectionChangeEvent()
    this.windowKeyDownEvent()
  }


  // 事件总代理实现
  public bindEventListener(target:any,key:string,fn:Function){
    return ()=>{
        target?.addEventListener(key,fn)
      return ()=>{
        target?.removeEventListener(key,fn)
      }
    }
  }
   
}

