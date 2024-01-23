import { Plugin } from '../../../../packages/api/dist/api.esm-bundler.js';
export class AuaeTool extends Plugin.ToolPluginBase {
  type = 'Auae';
  text = 'Auae';
  icon = null;

  blockData = {
    type: this.type,
    data: {
      text: ''
    },
    class: this.type
  };

  constructor(options) {
    super(options);
    this.getIcon();
  }

  getIcon() {
    const div = document.createElement('div');
    div.textContent = 'H';
    return div;
  }
}
