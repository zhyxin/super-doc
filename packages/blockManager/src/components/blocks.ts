import * as _ from '@super-doc/share';
import { Block } from './block';

/**
 * @class Blocks
 * @classdesc Class to work with Block instances array
 *            用来存储block实例的数组
 * @private 
 * @property {HTMLElement} workingArea — editor`s working node
 */
export default class Blocks {
  public blocks: Block[];

  public workingArea: HTMLElement;

  constructor(workingArea: HTMLElement) {
    this.blocks = [];
    this.workingArea = workingArea;
  }

  public get length(): number {
    return this.blocks.length;
  }

  public get array(): Block[] {
    return this.blocks;
  }

  public get nodes(): HTMLElement[] {
    return _.array(this.workingArea.children);
  }

  public static set(instance: Blocks, property: PropertyKey, value: Block | unknown): boolean {

    if (isNaN(Number(property))) {
      Reflect.set(instance, property, value);

      return true;
    }

    instance.insert(+(property as number), value as Block);
    console.log(instance);
    return true;
  }

  public static get(instance: Blocks, property: PropertyKey): Block | unknown {

    if (isNaN(Number(property))) {
      return Reflect.get(instance, property);
    }

    return instance.get(+(property as number));
  }

  public push(block: Block): void {
    this.blocks.push(block);
    // this.insertToDOM(block);
  }


  public insert(index: number, block: Block, replace = false): void {
    if (!this.length) {
      this.push(block);

      return;
    }

    if (index > this.length) {
      index = this.length;
    }

    if (replace) {
      this.blocks[index].holder.remove();
    //   this.blocks[index].call(BlockToolAPI.REMOVED);
    }

    const deleteCount = replace ? 1 : 0;

    this.blocks.splice(index, deleteCount, block);

    // if (index > 0) {
    //   const previousBlock = this.blocks[index - 1];

    //   this.insertToDOM(block, 'afterend', previousBlock);
    // } else {
    //   const nextBlock = this.blocks[index + 1];

    //   if (nextBlock) {
    //     this.insertToDOM(block, 'beforebegin', nextBlock);
    //   } else {
    //     this.insertToDOM(block);
    //   }
    // }
  }

  public insertMany(blocks: Block[], index: number ): void {
    const fragment = new DocumentFragment();

    for (const block of blocks) {
      fragment.appendChild(block.holder);
    }
    console.log(this, '================================================================')
    if (this.length > 0) {
      if (index > 0) {
        const previousBlockIndex = Math.min(index - 1, this.length - 1);
        const previousBlock = this.blocks[previousBlockIndex];

        previousBlock.holder.after(fragment);
      } else if (index === 0) {
        this.workingArea.prepend(fragment);
      }

      this.blocks.splice(index, 0, ...blocks);
    } else {
      this.blocks.push(...blocks);
      this.workingArea.appendChild(fragment);
    }

  }

  public remove(index: number): void {
    if (isNaN(index)) {
      index = this.length - 1;
    }

    this.blocks[index].holder.remove();

    // this.blocks[index].call(BlockToolAPI.REMOVED);

    this.blocks.splice(index, 1);
  }

  public get(index: number): Block | undefined {
    return this.blocks[index];
  }

  public indexOf(block: Block): number {
    return this.blocks.indexOf(block);
  }
  
}
