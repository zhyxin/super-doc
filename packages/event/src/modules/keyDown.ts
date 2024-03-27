import { BlockInstance, OutputBlockData, CURSOR_DIRECTION} from "@super-doc/types";
import { Dom as $, compileParagraph,deepCloneRefreshId } from "@super-doc/share";

import {
  getBlockIdForElement,
  getElementCoordinates,
  getModules,
  getParagraphElements,
  isCursorAtFirstOrLastLine,
  keyCodes,
} from "@super-doc/share";
import Event from "../index";
import { copyEventByClipboardCallBack, copyEventByKeyBoardCallBack, cutEventByClipboardCallBack, pasteEventByClipboardCallBack, pasteEventByKeyBoardCallBack } from "./utils/execCommand";
import { generateImageData, generateParagraphData, uploadImage } from "@super-doc/api";
export default class KeyDown {
  public isBindEvent = false;
  public Event: Event;
  constructor(blockInstances: BlockInstance[], Event: Event) {
    this.Event = Event;

    // TODO: 依赖于渲染后才能添加事件，但是该事件绑定是在new Block时注册的，所以采用了setTimeout，后续看看如何去除setTimeout
    setTimeout(() => {
      this.bindBlockKeydownEvents(blockInstances);
      // TODO：优化复制粘贴事件，由于copy、paste事件在全选的适合触发不了，所以这里用了两种事件监听 keydown 和 copy | paste
      this.bindCopyEvent(blockInstances);
    }, 0);
  }

  /**
   * 注册上下箭头事件
   */
  public bindBlockKeydownEvents(blockInstances: BlockInstance[]) {
    if (this.isBindEvent) return;
    blockInstances.forEach((blockInstance) => {
      const element = blockInstance.currentElement;
      element.removeEventListener("keydown", this.keydownHandler);
      element.addEventListener("keydown", this.keydownHandler);
    });
  }

  private keydownHandler = (event: KeyboardEvent) => {
    console.log('keydownxiaoguokeydownxiaoguokeydownxiaoguokeydownxiaoguokeydownxiaoguo')
    const { BlockManager } = getModules();
    const { curentFocusBlock, blockInstances } = BlockManager;
    if (event.keyCode === keyCodes.UP || event.keyCode === keyCodes.DOWN) {
      this.checkoutBlockEvent(event);
    } else if (event.keyCode === keyCodes.BACKSPACE) {
      this.backspaceEvent(event);
    } else if (event.keyCode === keyCodes.ENTER) {
      this.enterEvent(event);
    } else if (
      (event.metaKey || event.ctrlKey) &&
      event.keyCode === keyCodes.A
    ) {
      curentFocusBlock.CURRENT_CHECKOUT_COUNT += 1;
      if(curentFocusBlock.CHECKOUT_ALL_NUMBER == curentFocusBlock.CURRENT_CHECKOUT_COUNT){
        // 设置全选数据
        BlockManager.setSelectionBlockInfo({id:curentFocusBlock.id,content:"",block:curentFocusBlock,data:BlockManager.blocks,type : "block"})
      }
      if(curentFocusBlock.CURRENT_CHECKOUT_COUNT < curentFocusBlock.CHECKOUT_BLOCK_NUMBER ) return;
      event.preventDefault();
    } else if (
      (event.metaKey || event.ctrlKey) &&
      event.keyCode === keyCodes.C
    ) {
      copyEventByKeyBoardCallBack.call(this,event)
    }else if( (event.metaKey || event.ctrlKey) && event.keyCode === keyCodes.V){
     
      pasteEventByKeyBoardCallBack.call(this,event)
    }else if( (event.metaKey || event.ctrlKey) && event.keyCode === keyCodes.X){
      if(this.isCheckAllStatus()){
        console.log('剪切lfjs');
        // 设置全局剪切事件
        let currentSelection = JSON.parse(JSON.stringify(BlockManager.currentSelectionBlockInfo.data))
        let refreshBlockData = deepCloneRefreshId(currentSelection,["id"])
        BlockManager.setCurrentBlockInfo("currentCopyBlockInfo",{id:curentFocusBlock.id,content:"",block:curentFocusBlock,data: refreshBlockData,type : "block"})
        currentSelection.forEach((item,index)=>{
          BlockManager.removeBlock(item.id);
        })
        event.stopPropagation();
      }
    }else if((event.metaKey || event.ctrlKey) && event.keyCode === keyCodes.S){
      console.log(event.keyCode,'yyjs');
      event.preventDefault();
    }
    
  };

  /**
   * 上下箭头
   */
  private checkoutBlockEvent(event: KeyboardEvent) {
    const isUP = event.key === "ArrowUp";
    const isDOWN = event.key === "ArrowDown";
    if (!isUP && !isDOWN) return;
    // 判断是否为第一行
    const { isFirstLine, isLastLine } = isCursorAtFirstOrLastLine(
      event.target as Element
    );
    if ((isUP && !isFirstLine) || (isDOWN && !isLastLine)) return;
    event.preventDefault();
    const [blockId, currentTarget] = getBlockIdForElement(
      event.currentTarget as HTMLElement
    );
    const target = event.target;
    if ($.getAttr(target, "id") !== "superdoc-paragraph") return;
    const allParagraphs = getParagraphElements();
    let focusEl = null;
    allParagraphs.some((el, i, _element) => {
      if (el === target) {
        if (i === _element.length - 1) {
          focusEl = isUP ? _element[i - 1] : el;
        } else if (i === 0) {
          focusEl = isDOWN ? _element[i + 1] : el;
        } else {
          if (isDOWN) {
            focusEl = _element[i + 1];
          } else if (isUP) {
            focusEl = _element[i - 1];
          }
        }
        return true;
      }
    });
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const { left: x } = getElementCoordinates(range.getBoundingClientRect());
    this.setCursorForX(focusEl, x);

    // TODO: 解决多个paragraph属于同一个block下导致焦点切换出错问题
    if (!currentTarget.contains(focusEl)) {
      const { pre, next } =
        this.Event["Editor"].BlockManager.findBlockInstanceForId(blockId);
      if (isUP && pre.state) {
        this.Event["Editor"].BlockManager.changeCurrentBlockId(pre.state.id);
      } else if (isDOWN && next.state) {
        this.Event["Editor"].BlockManager.changeCurrentBlockId(next.state.id);
      }
    }
  }

  /**
   * 设置最接近x轴距离的坐标
   */
  public setCursorForX = (node: HTMLElement, x: number) => {
    let isFind = null;
    let firstLineY = null;
    const range = document.createRange();
    for (let i = 0; i < node.childNodes.length; i++) {
      if (isFind) break;
      const child = node.childNodes[i] as any;
      if (child.nodeType === Node.TEXT_NODE) {
        for (let j = 0; j < child.length; j++) {
          range.setStart(child, j);
          range.setEnd(child, j);
          const { left, top } = getElementCoordinates(
            range.getBoundingClientRect()
          );
          firstLineY = firstLineY ? firstLineY : top;
          if (firstLineY === top && x - left <= 0) {
            range.setStart(child, j);
            range.setEnd(child, j);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            isFind = true;
            break;
          }
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        this.setCursorForX(child as HTMLElement, x);
      }
    }
    if (!isFind) {
      const lastChild = node.childNodes.length
        ? node.childNodes[node.childNodes.length - 1]
        : node;
      if (lastChild.nodeType === Node.TEXT_NODE) {
        range.setStart(lastChild, (lastChild as Text).length);
        range.setEnd(lastChild, (lastChild as Text).length);
      } else if (lastChild.nodeType === Node.ELEMENT_NODE) {
        range.setStart(lastChild, 0);
        range.setEnd(lastChild, 0);
      }
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }
  };

  /**
   * 回车增加段落
   * 不单纯的增加段落 (原先获取光标位置的判断有问题,这里直接判断处理)
   * 1.如果是在首位
   * 2.中间
   * 3.尾部
   */
  private enterEvent(event) {
    let manager = this.Event["Editor"].BlockManager
    let selection = window.getSelection();
    let cursorPosition: CURSOR_DIRECTION = 2
    if(selection.isCollapsed && selection.anchorOffset == 0){
      cursorPosition = 0
    }
    event.preventDefault();
    manager.insertBlockForBlockId(generateParagraphData(), manager.currentHoverBlockId,cursorPosition);
  }

  // bug：删不了表格图片等无编辑状态的内容
  private backspaceEvent(event) {
    const { BlockManager } = this.Event["Editor"];
    if(this.isCheckAllStatus()){
      // TODO：待优化，现在全选的删除被代理到了全局
    }else{
      const element =
        BlockManager.curentFocusBlock.element.querySelector(`[block-id]`);
      if (event.target.childNodes.length === 0) {
        BlockManager.removeBlock(BlockManager.curentFocusBlock.id);
        event.preventDefault();
      } else if (event.target.childNodes.length > 0) {
      }
    }
  }

  /**
   * 复制、粘贴、剪切事件
   */
  public bindCopyEvent(blockInstances: BlockInstance[]) {
    // TODO: 事件队列入栈
    const that = this;
    blockInstances.forEach((instance) => {
      instance.element.addEventListener("copy", (event: ClipboardEvent) => {
        // event.clipboardData.setData("text", event.target['innerHTML']);
        copyEventByClipboardCallBack.call(that,event,instance)
        event.preventDefault();
      });
      instance.element.addEventListener("paste", (event: ClipboardEvent) => {
        // if(event.target['getAttribute']('id') !== 'superdoc-paragraph') return;
        var clipboardData = event.clipboardData || window['clipboardData']; // 获取剪贴板数据对象
        if (clipboardData && clipboardData.getData) {
          // event.preventDefault();
          var text = clipboardData.getData("text/plain");// 获取纯文本格式的复制内容
          const blocks = compileParagraph(
            text.split('\n')
              .filter(content => !!content)
              .join("\n")
          );
          // const blockId = that.Event['Editor'].BlockManager.insertBlockForBlockId();
          // that.Event['Editor'].BlockManager.replaceCurrentBlock(blocks, blockId)
          
          // 真实粘贴代码
          pasteEventByClipboardCallBack.call(that,event)
        }
      });
      // 剪切
      instance.element.addEventListener("cut", (event: ClipboardEvent) => {
        cutEventByClipboardCallBack.call(that,event,instance)
      });
    });
  }


  // 判断是否全选
  public isCheckAllStatus(){
    let { curentFocusBlock } = this.Event['Editor'].BlockManager;
    return curentFocusBlock.CURRENT_CHECKOUT_COUNT  == curentFocusBlock.CHECKOUT_ALL_NUMBER
  }

  // 判断是否单段block的选择
  public isCheckSingleBlockStatus(){
    let { curentFocusBlock } = this.Event['Editor'].BlockManager;
    return curentFocusBlock.CURRENT_CHECKOUT_COUNT  == curentFocusBlock.CHECKOUT_BLOCK_NUMBER
  }
  
}
