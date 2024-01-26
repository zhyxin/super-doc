import { BlockId, BlockInstance } from "@super-doc/types";
import { Dom as $ } from "@super-doc/share";

import {
  getBlockIdForElement,
  getElementCoordinates,
  getModules,
  getParagraphElements,
  isCursorAtFirstOrLastLine,
  keyCodes,
} from "@super-doc/share";
import Event from "../index";
export default class KeyDown {
  public isBindEvent = false;
  public Event: Event;
  constructor(blockInstances: BlockInstance[], Event: Event) {
    this.Event = Event;

    // TODO: 依赖于渲染后才能添加事件，但是该事件绑定是在new Block时注册的，所以采用了setTimeout，后续看看如何去除setTimeout
    setTimeout(() => {
      this.bindBlockKeydownEvents(blockInstances);
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
      console.log("全选");
      getModules().BlockManager.blockInstances.forEach((block) => {
        block.checkAll = true;
      });
    } else if (
      (event.metaKey || event.ctrlKey) &&
      event.keyCode === keyCodes.C
    ) {
      console.log("复制");
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
   * 粘贴事件
   */
  public bindCopyEvent(blockInstances: BlockInstance[]) {
    blockInstances.forEach((instance) => {
      instance.element.addEventListener("copy", (event: ClipboardEvent) => {
        event.clipboardData.setData("text", event.target["getInnerHTML"]());
        event.preventDefault();
      });
    });
  }
}
