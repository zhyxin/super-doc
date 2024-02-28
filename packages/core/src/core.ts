import { EditorConfig, ModuleConfig } from "@super-doc/types";
import BlockManager from "@super-doc/block-manager";
import UI from "@super-doc/ui";
import Renderer from "@super-doc/renderer";
import { EditorModules } from "@super-doc/types";
import * as _ from "@super-doc/share";
import Event from "@super-doc/event";
import { API, generateHeadData, generateParagraphData } from "@super-doc/api";
import interComponents from "@super-doc/components";
import Menu from "@super-doc/menu";

const Modules = {
  BlockManager,
  Renderer,
  API,
  UI,
  Menu,
  Event,
};
export default class Core {
  public config: EditorConfig;
  public isReady: Promise<void>;
  public moduleInstances: EditorModules = {} as EditorModules;

  constructor(config?: EditorConfig) {
    this.configuration = config;
    let onReady: (value?: void | PromiseLike<void>) => void;
    let onFail: (reason?: unknown) => void;

    this.validate();
    this.init();

    this.isReady = new Promise((resolve, reject) => {
      onReady = resolve;
      onFail = reject;
    });
    Promise.resolve().then(async () => {
      await this.start();
      await this.render();
    });
  }

  validate(): void {}
  init(): void {
    // 实例化模块
    this.constructModules();

    // 给各个模块挂载其他模块的实例
    this.configureModules();
  }

  // 运行所有module的prepare方法
  public async start(): Promise<void> {
    const modulesToPrepare = ["UI", "Menu", "BlockManager", "Event"];
    return modulesToPrepare.reduce(
      (promise, module) =>
        promise.then(async () => {
          await this.moduleInstances[module].prepare();
        }),
      Promise.resolve()
    );
  }

  /**
   * @description 加载core模块
   * block、blockManager、renderer模块
   */
  public async render(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.moduleInstances.Renderer.firstInsert();
      resolve();
    });
  }

  private constructModules(): void {
    Object.entries(Modules).forEach(([key, module]) => {
      try {
        this.moduleInstances[key] = new module({
          config: this.configuration,
        });
      } catch (e) {
        console.error(`加载${key}模块失败`, e);
      }
    });
    _.setModules(this.moduleInstances);
  }

  private configureModules(): void {
    for (const name in this.moduleInstances) {
      if (Object.prototype.hasOwnProperty.call(this.moduleInstances, name)) {
        // this.getModulesDiff(name); TODO: 返回除了自身外的所有module实例
        this.moduleInstances[name].state = this.getModulesDiff(name);
      }
    }
  }

  public set configuration(config: EditorConfig) {
    if (_.isObject(config)) {
      this.config = {
        ...config,
      };
    } else {
      this.config = {
        holder: config,
      };
    }

    if (this.config.holder == null) {
      this.config.holder = "#editorjs";
    }

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    this.config.minHeight =
      this.config.minHeight !== undefined ? this.config.minHeight : 300;

    const defaultBlockData = generateHeadData('h1');
    defaultBlockData.data.text = '标题'
    this.config.placeholder = this.config.placeholder || false;

    this.config.hideToolbar = this.config.hideToolbar
      ? this.config.hideToolbar
      : false;
    this.config.data =
      this.config.data && this.config.data.blocks?.length
        ? this.config.data
        : { blocks: [] };
    this.config.onReady = this.config.onReady || ((): void => {});
    this.config.inlineToolbar =
      this.config.inlineToolbar !== undefined
        ? this.config.inlineToolbar
        : true;

    if (
      _.isEmpty(this.config.data) ||
      !this.config.data.blocks ||
      this.config.data.blocks.length === 0
    ) {
      this.config.data = { blocks: [defaultBlockData] };
    }
    const [
      AITool,
      ParagraphTool,
      HeadTool1,
      HeadTool2,
      HeadTool3,
      HeadTool4,
      ImageTool,
      TableTool,
      ListTool,
      TodoListTool,
    ] = interComponents.tools.plugins;
    this.config.tools = {
      toolbar: {
        plugins: this.config?.tools?.toolbar?.plugins
          ? [
              AITool,
              ...this.config?.tools?.toolbar?.plugins,
              ParagraphTool,
              HeadTool1,
              HeadTool2,
              HeadTool3,
              HeadTool4,
              ImageTool,
              TableTool,
              ListTool,
              TodoListTool,
            ]
          : interComponents.tools.plugins,
        layout: this.config?.tools?.toolbar?.layout
          ? [
              ...this.config?.tools?.toolbar?.layout,
              ...interComponents.tools.layout,
            ]
          : interComponents.tools.layout,
      },
      menu: this.config?.tools?.menu
        ? [...this.config?.tools?.menu, ...interComponents.menu]
        : [...interComponents.menu],
    };

    // if(!this.config?.tools) {

    //     this.config.tools = {
    //         toolbar: {
    //             plugins: interComponents.tools.plugins,
    //             layout: interComponents.tools.layout
    //         },
    //         menu: [
    //             ...interComponents.menu
    //         ]
    //     };
    // } else {
    //     this.config.tools.toolbar.plugins.unshift(...interComponents.tools.plugins);
    //     this.config.tools.toolbar.layout.unshift(...interComponents.tools.layout);
    // }
  }

  public get configuration(): EditorConfig {
    return this.config;
  }

  private getModulesDiff(name: string): EditorModules {
    const diff = {} as EditorModules;
    for (const moduleName in this.moduleInstances) {
      if (moduleName === name) {
        continue;
      }
      diff[moduleName] = this.moduleInstances[moduleName];
    }

    return diff;
  }

  destroy() {
    _.setModules(null);
    if (_.isString(this.configuration.holder)) {
      _.Dom.querySelector(this.configuration.holder as string)["innerHTML"] =
        "";
    } else if (_.isDOM(this.configuration.holder)) {
      this.configuration.holder["innerHTML"] = "";
    }
  }
}
