import { Plugin, addListener } from "@super-doc/api";

export default class Head extends Plugin.BlockBase {
  config = null;
  fontSize = {
    'h1': '32px',
    'h2': '25px',
    'h3': '18px',
    'h4': '16px',
    'h5': '14px',
    'h6': '12px',
  };

  constructor(options) {
    super(options);
    const { config, ...other } = options;
    this.config = config;
  }

  render() {
    const el = document.createElement(this.config.data.level);
    el.textContent = this.config.data.text;
    el.setAttribute(
      "placeholder",
      `标题${this.config.data.level.replace("h", "")}`
    );
    el.style.padding = 0;
    el.style.margin = 0;
    el.style['font-weight'] = 'bold';
    el.style['font-size'] = this.fontSize[this.config.data.level];
    el.style['line-height'] = '1.45';

    this.bindUpdateEvent(el);
    return el;
  }

  bindUpdateEvent(el) {
    addListener("update", (block) => {
      if(block &&  this.config.id === block.id) {
        el.innerHTML = block.data.text;
      }
    });
  }

}
