export type CURSOR_POSITION_START = 0;
export type CURSOR_POSITION_MIDDLE = 1;
export type CURSOR_POSITION_END = 2;
export type CURSOR_DIRECTION = CURSOR_POSITION_START | CURSOR_POSITION_MIDDLE | CURSOR_POSITION_END;

// 复制事件的信息状态
export interface CurrentCopyBlockInfo{
  id: string, //  blockId
  status: number, // 复制的状态
  content: string, // 复制的内容
  [prop:string]:any,
}