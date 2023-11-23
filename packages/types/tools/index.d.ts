import { BlockTool, BlockToolConstructable } from './block-tool';
import { InlineTool, InlineToolConstructable } from './inline-tool';
import { BlockTune, BlockTuneConstructable } from '../block-tunes';

export * from './block-tool-data';

// 泛型接口
export interface Toolbar<T extends { new (...args: any[]): any }> {
    plugins: T[];
    layout: T[];
  }
  
export interface Tools<T extends { new (...args: any[]): any }> {
    toolbar: Toolbar<T>;
    inline: T[];
}