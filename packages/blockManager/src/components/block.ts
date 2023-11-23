import { BlockToolData, BlockTuneData } from "@super-doc/types";
import { EditorModules } from "@super-doc/typing";
import * as _ from "@super-doc/share";
import BlockManager from "..";
/**
 * Interface describes Block class constructor argument
 */
interface BlockConstructorOptions {
  id?: string;
  index?: number;
  type: string;
  data: BlockToolData;
  Editor: EditorModules;
  class?: any;
  // readOnly?: boolean;
  // tunesData: { [name: string]: BlockTuneData };
}

export class Block {
  public readonly holder: HTMLDivElement;

  public element: HTMLElement;
  public id: string;
  public type: string;
  public data: BlockToolData;
  public index: number;
  public class: any;
  public isBindEvent: boolean = false;
  private _Editor: EditorModules;

  public _isEditable: boolean = false;
  get isEditable(): boolean {
    return this._isEditable;
  }

  set isEditable(value: boolean) {
    this.element.contentEditable = !!value + "";
    this._isEditable = value;
  }

  get Editor(): EditorModules {
    return this._Editor;
  }
  set Editor(editor: EditorModules) {
    this._Editor = editor;
  }

  get currentElement(): HTMLElement {
    return this.element.querySelector("[block-id]");
  }
  get xPosition(): number {
    return (this.element.querySelector(`.${this.Editor.UI.CSS.content}`) as HTMLElement).offsetLeft;
  }
  get yPosition(): number {
    return (this.element.querySelector(`.${this.Editor.UI.CSS.content}`) as HTMLElement).offsetTop;
  }
  constructor({
    index,
    id = _.generateBlockId(),
    type,
    data,
    Editor,
    class: _class,
  }: BlockConstructorOptions) {
    this.index = index;
    this.id = id;
    this.type = type;
    this.data = data;
    this.Editor = Editor;
    this.class = _class;
    this.block2html();
  }

  public call(methodName: string, params?: object): void {}

  block2html() {
    this.element = this.Editor.Renderer.block2html([this]);
  }
}
