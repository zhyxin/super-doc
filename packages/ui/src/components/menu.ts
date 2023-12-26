import UI from "../index";
import { Dom as $, Module, getElementCoordinates } from "@super-doc/share";

export default class Menu {
  private _visible: boolean = false;
  public element: HTMLElement = null;
  public ELEMENT_HEIGHT_TOP: number = 50;
  public ELEMENT_HEIGHT_BUTTOM: number = 16;
  public UI: UI;

  public menuNodes: { [key: string]: HTMLElement } = {};
  public menuElMap: WeakMap<Menu, HTMLElement> = new WeakMap();
  set visible(v: boolean) {
    // TODO: 这里可以抽
    try {
      const rangeBound = window
        .getSelection()
        .getRangeAt(0)
        .getBoundingClientRect();
      const coord = getElementCoordinates(rangeBound);
      if (!!v) {
        this.element.style.left = `${coord.left + coord.rect.width / 4}px`;
        this.element.style.top = `${
          coord.top - this.ELEMENT_HEIGHT_TOP < this.ELEMENT_HEIGHT_TOP
            ? coord.top + this.ELEMENT_HEIGHT_BUTTOM
            : coord.top - this.ELEMENT_HEIGHT_TOP
        }px`;
        this.element.classList.remove(this.UI.CSS.commonHidden);
        this.element.classList.add(this.UI.CSS.commonShow);
      } else {
        this.element.classList.remove(this.UI.CSS.commonShow);
        this.element.classList.add(this.UI.CSS.commonHidden);
      }
      this._visible = v;
    } catch (error) {
      console.error(error);
    }
  }
  get visible() {
    return this._visible;
  }

  constructor(UI: UI) {
    this.UI = UI;
    this.createMenuWarpper();
  }

  public createMenuWarpper() {
    const container = $.make("div", [
      this.UI.CSS.superDocMenu,
      this.UI.CSS.commonHidden,
    ]);
    const { menu } = this.UI["config"].tools;
    menu.forEach((Menu) => {
      const menuInstanceMap = this.UI["Editor"].Menu.menuInstanceMap;
      const menuInstance = menuInstanceMap.get(Menu);
      let itemContainer = $.make("div", [
        this.UI.CSS.superDocMenuItemContainer,
      ]);
      this.menuElMap.set(Menu, itemContainer);
      itemContainer.appendChild(menuInstance.getIcon());
      container.appendChild(itemContainer);
    });
    this.UI.nodes.redactor.appendChild(container);
    this.element = container;
  }
}
