import { BlockId, BlockInstance } from "@super-doc/types";
import { getElementCoordinates, keyCodes } from "@super-doc/share";
import Event from "../index";

export default class KeyDown {
  public isBindEvent = false;
  public Event: Event;
  constructor(blockInstances: BlockInstance[], Event: Event) {
    this.Event = Event;

    // TODO: 依赖于渲染后才能添加事件，但是该事件绑定是在new Block时注册的，所以采用了setTimeout，后续看看如何去除setTimeout
    setTimeout(() => {
      this.bindBlockKeydownEvents(blockInstances);
    }, 0)
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
    if (event.keyCode === keyCodes.UP || event.keyCode === keyCodes.DOWN) {
      this.checkoutBlockEvent(event);
    } else if (event.keyCode === keyCodes.BACKSPACE) {
      this.backspaceEvent(event);
    } else if (event.keyCode === keyCodes.ENTER) {
      this.enterEvent(event);
    }
  };

  /**
   * 上下箭头
   */
  private checkoutBlockEvent(event: KeyboardEvent) {
    const isUP = event.key === "ArrowUp";
    const isDOWN = event.key === "ArrowDown";
    const element = event.target as Element;
    if (!isUP && !isDOWN) return;
    const id: BlockId = element.getAttribute("block-id");
    // TODO: 此处有问题 就是当是非block根元素按下上下箭头时会报错
    if(!id) return;
    event.preventDefault();
    const { pre, next } =
      this.Event["Editor"].BlockManager.findBlockInstanceForId(id);
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const { left: x } = getElementCoordinates(range.getBoundingClientRect());
    if (isUP && pre.state) {
      this.setCursorForX(pre.state.currentElement, x);
      this.Event['Editor'].BlockManager.changeCurrentBlockId(pre.state.id);
    } else if (isDOWN && next.state) {
      this.setCursorForX(next.state.currentElement, x);
      this.Event['Editor'].BlockManager.changeCurrentBlockId(next.state.id);
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
      const lastChild = node.childNodes.length ? node.childNodes[node.childNodes.length - 1] : node;
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
   */
  private enterEvent(event) {
    event.preventDefault();
    this.Event["Editor"].BlockManager.insertBlockForBlockId();
  }

  private backspaceEvent(event) {
    const { BlockManager } = this.Event["Editor"];
    const element =
      BlockManager.curentFocusBlock.element.querySelector(`[block-id]`);
    if (element.childNodes.length === 0) {
      BlockManager.removeBlock(BlockManager.curentFocusBlock.id);
      event.preventDefault();
    } else if (element.childNodes.length > 0) {
    }
  }
  
  /**
   * 移动一个字符
   */

  /**
   * 移动一个字母
   */
}
