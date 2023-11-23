import { Tools } from '../tools';
import { OutputData} from '../index';
import {SanitizerConfig} from './sanitizer-config';

export interface EditorConfig {
  isReadOnly?: boolean;

  holder?: string | HTMLElement;

  autofocus?: boolean;

  defaultBlock?: string;

  
  initialBlock?: string;

  placeholder?: string|false;

  sanitizer?: SanitizerConfig;

  hideToolbar?: boolean;

  tools?: Tools<any>;

  data?: OutputData;

  minHeight?: number;

  onReady?(): void;

  // onChange?(api: API, event: BlockMutationEvent | BlockMutationEvent[]): void;

  inlineToolbar?: string[]|boolean;
  
}
