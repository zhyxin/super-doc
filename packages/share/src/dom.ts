export class Dom {
  public static get(id: string): HTMLElement | null {
    return document.getElementById(id);
  }

  public static querySelector(selector: string): HTMLElement | null {
    return document.querySelector(selector);
  }

  // 在某元素的父元素的开头添加一个或者多个元素
  public static prepend(parent: Element, elements: Element | Element[]): void {
    if (Array.isArray(elements)) {
      elements = elements.reverse();
      elements.forEach((el) => parent.prepend(el));
    } else {
      parent.prepend(elements);
    }
  }

  public static make(
    tagName: string,
    classNames: string | string[] = null,
    attributes: object = {}
  ): HTMLElement {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      if (Object.prototype.hasOwnProperty.call(attributes, attrName)) {
        // el[attrName] = attributes[attrName];
        el.setAttribute(attrName, attributes[attrName]);
      }
    }
    return el;
  }

  public static makeNS(
    namespaceURI: string,
    qualifiedName: string,
    classNames: string | string[] = null,
    attributes: object = {}
  ) {
    const el = document.createElementNS(namespaceURI, qualifiedName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      if (Object.prototype.hasOwnProperty.call(attributes, attrName)) {
        // el[attrName] = attributes[attrName];
        el.setAttribute(attrName, attributes[attrName]);
      }
    }
    return el;
  }
}


export const keyCodes = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  ESC: 27,
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  DOWN: 40,
  RIGHT: 39,
  DELETE: 46,
  META: 91,
  A: 65,
};


export function getElementCoordinates(rect) {

  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;

  const docX = rect.left + scrollX;
  const docY = rect.top + scrollY;

  return {
    left: docX,
    top: docY,
    right: docX + rect.width,
    bottom: docY + rect.height,
    rect
  };
}

export function setCursorForEnd (element: HTMLElement) {
  const range = document.createRange();
  const selection = document.getSelection();
  const child = Array.from(element.childNodes);
  if(child.length) {
    const lastChild = child.slice(child.length - 1)[0];
    if(lastChild.nodeType === Node.TEXT_NODE) {
      range.setStart(lastChild, (lastChild as Text).length);
      range.setEnd(lastChild, (lastChild as Text).length);
    } else if (lastChild.nodeType === Node.ELEMENT_NODE) {
      range.setStart(lastChild, 0);
      range.setEnd(lastChild, 0);
    }
  } else {
    range.setStart(element, 0);
    range.setEnd(element, 0);
  }
  selection.removeAllRanges();
  selection.addRange(range);
}

export function isCursorAtFirstOrLastLine(element:Element): {isFirstLine: Boolean, isLastLine: Boolean} {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return null; // No selection
  const range = selection.getRangeAt(0);
  const rangeRect = range.getBoundingClientRect();
  const elemRect = element.getBoundingClientRect();

  const isFirstLine = rangeRect.top <= elemRect.top + rangeRect.height;
  const isLastLine = rangeRect.bottom >= elemRect.bottom - rangeRect.height;

  return { isFirstLine, isLastLine };
}