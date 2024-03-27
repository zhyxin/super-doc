import { Tools } from './tools';
import { OutputData} from '../index';
export interface EditorConfig {
  isReadOnly?: boolean;

  holder?: string | HTMLElement;

  autofocus?: boolean;

  defaultBlock?: string;

  
  initialBlock?: string;

  placeholder?: string|false;

  hideToolbar?: boolean;

  tools?: Tools;

  data?: OutputData;

  minHeight?: number;

  onReady?(): void;

  // onChange?(api: API, event: BlockMutationEvent | BlockMutationEvent[]): void;

  inlineToolbar?: string[]|boolean;
}
