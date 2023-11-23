import { Plugin } from '@super-doc/api'
export class AITool extends Plugin.ToolPluginBase {
  type = 'AI';
  text = 'AI';
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


// useUpdate(() => {}, [block.data.text]);
// useAdd(() => {})
// useDelete(() => {})