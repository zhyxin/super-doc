export class BlockBase {
  _config = null;
  _blockId: string;
  _contentEditable: string;
  // native ｜ vue ｜ react
  platform = "native";
  constructor({ config, ...other }) {
    this._blockId = other["block-id"];
    this._contentEditable = other["contentEditable"];
    this._config = config;
  }

  _render() {
    if (!this["render"]) {
      return console.error(`${this._blockId}没有实现render方法`);
    }
    return this._pack(this["render"]());
  }

  _injectionForVue() {
      window["Vue"].prototype['$blocks'] = () => this._config.Editor.UI.Editor.BlockManager.blocks;
      window["Vue"].prototype['$replaceCurrentBlock'] = (...args) => this._config.Editor.API.replaceCurrentBlock(...args);
      window["Vue"].prototype['$superDocUpdateBlockData'] = (...args) => this._config.Editor.API.superDocUpdateBlockData(...args);
      window["Vue"].prototype['$superDocListen'] = (...args) => this._config.Editor.API.superDocListen(...args);
  }

  // 子类生产的dom进行最后的包装
  _pack = function (dom) {
    if (this.platform === "native" && dom instanceof HTMLElement) {
      dom.setAttribute("contentEditable", "true");
      dom.setAttribute("block-id", this._blockId);
      return dom;
    } else if (this.platform.toLowerCase() === "vue") {
      // 设置原型
      this._injectionForVue();
      const contaienr = document.createElement("div");
      // TODO: 模拟插入到页面后执行
      setTimeout(() => {
        const instance = new window["Vue"]({
          el: contaienr,
          components: {
            comp: dom,
          },

          render: (h) => {
            return  h("comp", {
              attrs: {
                "block-id": this._blockId,
              },
              props: {
                '$superConfig': {
                  blockData: this._config,
                  blockId:  this._blockId
                }
              }
            })
          ;},
        });
      }, 0);
      return contaienr;
    }
  }
}
