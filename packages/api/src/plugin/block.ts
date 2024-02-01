import Vue from 'vue';
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
      Vue.prototype['$blocks'] = () => this._config.Editor.UI.Editor.BlockManager.blocks;
      Vue.prototype['$replaceCurrentBlock'] = (...args) => this._config.Editor.API.replaceCurrentBlock(...args);
      Vue.prototype['$superDocUpdateBlockData'] = (...args) => this._config.Editor.API.superDocUpdateBlockData(...args);
      Vue.prototype['$superDocListen'] = (...args) => this._config.Editor.API.superDocListen(...args);
  }

  // 子类生产的dom进行最后的包装
  _pack = function (_dom) {
    let dom = _dom;
    if (this.platform === "native" && dom instanceof HTMLElement) {
      dom.setAttribute("contentEditable", "true");
      dom.setAttribute("block-id", this._blockId);
      dom.setAttribute("native", "true");
      return [ dom, () => {} ];
    } else if (this.platform.toLowerCase() === "vue") {
      // 设置原型
      this._injectionForVue();
      dom = document.createElement("div");
      const _that = this;
      return [ dom, function () {
        new Vue({
          el: dom,
          components: {
            comp: _dom,
          },

          render: (h) => {
            return  h("comp", {
              attrs: {
                "block-id": _that._blockId,
              },
              props: {
                '$superConfig': {
                  blockData: _that._config,
                  blockId:  _that._blockId
                }
              },
            })
          ;},
        });
      }];
    }
  }
}
