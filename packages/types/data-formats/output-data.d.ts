import { BlockToolData } from '../tools';
import { BlockId } from './block-id';

export interface OutputBlockData<Type extends string = string, Data extends object = any> {
  id?: BlockId;
  type: Type;
  data: BlockToolData<Data>;
  class?: any;
}

export interface OutputData {
  version?: string;
  time?: number;
  blocks: OutputBlockData[];
}
