import { BlockToolData } from './index';
export interface StubData extends BlockToolData {
    title: string;
    savedData: BlockToolData;
}