import { Plugin } from '@super-doc/api'
export default class ImageTool extends Plugin.ToolPluginBase {
    type = "ImageDoc";
    text = "图片";
    icon = null;
  
    blockData = {
      type: this.type,
      data: {
        desc: '',
        url: ''
      },
      class: this.type,
    };
  
    constructor(options) {
      super(options);
      this.getIcon();
    }
  
    getIcon() {
      const div = document.createElement("div");
      div.textContent = "图片";
      return div;
    }
}