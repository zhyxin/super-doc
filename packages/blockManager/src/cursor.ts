import { Block } from "./block";
import {
  CURSOR_DIRECTION,
  CURSOR_POSITION_START,
  CURSOR_POSITION_MIDDLE,
  CURSOR_POSITION_END,
} from "@super-doc/types";

/**
 * 记录光标记录的最后block
 */
export default class Cursor {
  public CURSOR_POSITION_START: CURSOR_POSITION_START = 0;
  public CURSOR_POSITION_MIDDLE: CURSOR_POSITION_MIDDLE = 1;
  public CURSOR_POSITION_END: CURSOR_POSITION_END = 2;

  public cursorPosition: CURSOR_DIRECTION = 0;
  public cursorRange:Range;

  private _block: Block;
  get block(): Block {
    return this._block;
  }
  set block(block: Block) {
    this.updateCursorPosition(block);
    this._block = block;
  }

  updateCursorPosition(block: Block) {
    // TODO menu有问题 临时filter处理
    const elementList = Array.from(block.currentElement.childNodes).filter(
      (el) => el.textContent.length !== 0
    );
    const { anchorOffset, anchorNode } = window.getSelection();
    if (anchorNode === elementList[0] && anchorOffset === 0) {
      this.cursorPosition = this.CURSOR_POSITION_START;
    } else if ( 
      anchorNode === elementList[elementList.length - 1] &&
      elementList[elementList.length - 1].textContent.length === anchorOffset
    ) {
      this.cursorPosition = this.CURSOR_POSITION_END;
    } else {
      this.cursorPosition = this.CURSOR_POSITION_MIDDLE;
    }
    // 上述方法是记录在block内光标的位置。
  }

  public removeAllRanges() {
    window.getSelection().removeAllRanges();
  }
}
