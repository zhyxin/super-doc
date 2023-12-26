import { EditorConfig } from "@super-doc/types";
import { Dom as $, Module, getElementCoordinates } from "@super-doc/share";
import styles from "./styles/main.css";
import Command from "./components/command";
import Layout from "./components/layout";
import Menu from "./components/menu";
interface ModuleConfig {
  config: EditorConfig;
}

export default class Ui extends Module {
  public get CSS(): {
    commonShow: string;
    commonHidden: string;
    wrapper: string;
    content: string;
    editorWrapper: string;
    editorWrapperNarrow: string;
    editorZone: string;
    editorZoneHidden: string;
    editorEmpty: string;
    editorRtlFix: string;
    superDocToolbarWrapper: string;
    superDocToolbarOpen: string;
    superDocToolbarPlus: string;
    superDocToolbarPopover: string;
    superDocToolbarItem: string;
    superDocMenu: string;
    superDocMenuItemContainer: string;
    boldMenu: string;
    italicMenu: string;
    highlightMenu: string;

  } {
    return {
      commonShow: "super-doc-common-show",
      commonHidden: "super-doc-common-hidden",
      wrapper: "super-doc-block",
      content: "ce-block__content",
      editorWrapper: "super-doc-editor",
      editorWrapperNarrow: "super-doc-editor--narrow",
      editorZone: "super-doc-editor__redactor",
      editorZoneHidden: "super-doc-editor__redactor--hidden",
      editorEmpty: "super-doc-editor--empty",
      editorRtlFix: "super-doc-editor--rtl",
      superDocToolbarWrapper: "super-doc-toolbar",
      superDocToolbarOpen: "super-doc-toolbar--open",
      superDocToolbarPlus: "super-doc-toolbar--plus",
      superDocToolbarPopover: "super-doc-toolbar--popover",
      superDocToolbarItem: "super-doc-toolbar--item",
      superDocMenu: "super-doc-menu",
      superDocMenuItemContainer: "super-doc-menu-item-container",
      boldMenu: "super-doc-menu--bold",
      italicMenu: "super-doc-menu--italic",
      highlightMenu: "super-doc-menu--highlightMenu"
    };
  }
  public command: Command;
  public layout: Layout;
  public menu: Menu;

  constructor({ config: EditorConfig }) {
    super({ config: EditorConfig });
  }
  public async prepare(): Promise<void> {
    this.setCommandList();
    this.setLayoutList();
    this.make();
    this.loadStyles();
    this.setMenuList();
  }

  public setCommandList(): void {
    this.command = new Command(this);
  }
  public setLayoutList(): void {
    this.layout = new Layout(this);
  }
  public setMenuList(): void {
    this.menu = new Menu(this);
  }

  private make(): void {
    this.nodes.holder =
      typeof this.config.holder === "string"
        ? document.getElementById(this.config.holder)
        : this.config.holder;

    this.nodes.wrapper = $.make("div", [this.CSS.editorWrapper, ...[]]);
    this.nodes.redactor = $.make("div", this.CSS.editorZone);

    this.nodes.redactor.style.paddingBottom = this.config.minHeight + "px";

    this.nodes.wrapper.appendChild(this.nodes.redactor);
    this.nodes.holder.appendChild(this.nodes.wrapper);
    this.nodes.pluginContainer = this.makePluginContainer();
    this.nodes.layoutContainer = this.makeLayoutContainer();
    this.Editor.Event.addShowCommandListEvent(
      this.nodes.pluginContainer.element
    );
    this.Editor.Event.addShowLayoutToolListEvent(
      this.nodes.layoutContainer.element
    );
    // this.nodes.pluginContainer.element.addEventListener()
    const toolbarWrapper = this.makeToolbarContainer()
      .appendChild(
        this.nodes.pluginContainer.appendChild(this.command.element).element
      )
      .appendChild(
        this.nodes.layoutContainer.appendChild(this.layout.element).element
      );
    this.nodes.toolbarWrapper = toolbarWrapper.element;
    this.nodes.wrapper.appendChild(this.nodes.toolbarWrapper);
  }

  private loadStyles(): void {
    let blob = new Blob([styles as any], { type: "text/css" });
    const cssLink = $.make("link", null, {
      rel: "stylesheet",
      type: "text/css",
      href: URL.createObjectURL(blob),
    });

    document.head.appendChild(cssLink);
  }

  public generateBlockContainerDiv(): HTMLElement {
    const wrapperDiv = $.make("div", [this.CSS.wrapper], ...[]);
    const contentDiv = $.make("div", [this.CSS.content], ...[]);
    wrapperDiv.appendChild(contentDiv);
    return wrapperDiv;
  }

  public makeToolbarContainer() {
    const div = $.make("div", [this.CSS.superDocToolbarWrapper], ...[]);
    const handler = {
      element: div,
      appendChild: (el: HTMLElement) => {
        div.appendChild(el);
        return handler;
      },
    };
    return handler;
  }

  public makePluginContainer() {
    const plus = $.make("div", [this.CSS.superDocToolbarPlus], ...[]);
    const svg = $.makeNS("http://www.w3.org/2000/svg", "svg", [], {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      fill: "none",
      viewBox: "0 0 24 24",
    });
    const path = $.makeNS("http://www.w3.org/2000/svg", "path", [], {
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-width": "2",
      d: "M12 7V12M12 17V12M17 12H12M12 12H7",
    });
    svg.appendChild(path);
    plus.appendChild(svg);
    const handler = {
      element: plus,
      appendChild: (el: HTMLElement) => {
        plus.appendChild(el);
        return handler;
      },
    };
    return handler;
  }

  public makeLayoutContainer() {
    const plus = $.make("div", [this.CSS.superDocToolbarPlus], ...[]);
    const svg = $.makeNS("http://www.w3.org/2000/svg", "svg", [], {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      fill: "none",
      viewBox: "0 0 24 24",
    });
    const pathD = [
      "M9.40999 7.29999H9.4",
      "M14.6 7.29999H14.59",
      "M9.30999 12H9.3",
      "M14.6 12H14.59",
      "M9.40999 16.7H9.4",
      "M14.6 16.7H14.59",
    ];
    for (let i = 0; i < pathD.length; i++) {
      const path = $.makeNS("http://www.w3.org/2000/svg", "path", [], {
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-width": "2.6",
        d: pathD[i],
      });
      svg.appendChild(path);
    }

    plus.appendChild(svg);
    const handler = {
      element: plus,
      appendChild: (el: HTMLElement) => {
        plus.appendChild(el);
        return handler;
      },
    };
    return handler;
  }

  public makePopover() {
    // TODO: 后续改成动态构建工具栏popover
    const popover = $.make("div", ...[this.CSS.superDocToolbarPopover], ...[]);
    const handler = {
      element: popover,
      appendChild: (el: HTMLElement | HTMLElement[]) => {
        if (Array.isArray(el)) {
          el.forEach((e) => popover.appendChild(e));
        } else {
          popover.appendChild(el);
        }
        return handler;
      },
    };
    return handler;
  }

  public makePopoverPluginItem() {
    const elements = [];
    this.Editor.BlockManager.toolInstances.toolbar.plugins.forEach((plugin) => {
      const popoverItem = $.make(
        "div",
        ...[this.CSS.superDocToolbarItem],
        ...[]
      );
      popoverItem.textContent = plugin.text;
      popoverItem.addEventListener("click", () => {
        this.Editor.BlockManager.replaceBlockForBlockId({
          ...plugin.blockData,
        });
      });
      elements.push(popoverItem);
    });

    const handler = {
      element: elements as HTMLElement[],
    };
    return handler;
  }

  public makePopoverLayoutItem() {
    const elements = [];
    this.Editor.BlockManager.toolInstances.toolbar.layout.forEach((layout) => {
      const popoverItem = $.make(
        "div",
        ...[this.CSS.superDocToolbarItem],
        ...[]
      );
      popoverItem.textContent = layout.text;
      popoverItem.addEventListener("click", (event) => {
        layout.action({ Editor: this.Editor });
        event.stopPropagation();
      });
      elements.push(popoverItem);
    });
    const handler = {
      element: elements as HTMLElement[],
    };
    return handler;
  }

  public toolbarFollowFocusBlock() {
    // TODO: 这里有bug 临时处理
    const focusBlockElement =
      this.Editor.BlockManager?.curentFocusBlock?.currentElement;
    if (!focusBlockElement) return;
    let { left: x, top: y, rect } = getElementCoordinates(focusBlockElement.getBoundingClientRect());
    this.nodes.toolbarWrapper.style = !!this.nodes.toolbarWrapper.style
      ? this.nodes.toolbarWrapper.style
      : {};
    this.nodes.toolbarWrapper.style.left = x - 50 + "px";
    if (rect.height <= 45) {
      this.nodes.toolbarWrapper.style.top = (y + ((rect.height - 24)/2)) + 'px';
    } else {
      this.nodes.toolbarWrapper.style.top = (y + 3) + 'px';
    }
  }
}
