export class ToolPluginBase {
  _type = null;
  _icon = null;
  _config = null;
  blockData = null;
  constructor(config, ...other) {
    this._config = config;
  }

  _click() {
    return;
  }

  _getBlockData() {
    if(!this.blockData) return console.error(`${this._type}没有设置默认数据`);
    return this.blockData;
  }
}
