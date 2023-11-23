import { Plugin } from '@super-doc/api'
export class ParagraphTool extends Plugin.ToolPluginBase {
    type = "Paragraph";
    text = "段落";
    icon = null;
  
    blockData = {
      type: this.type,
      data: {
        text: '',
      },
      class: this.type,
    };
  
    constructor(options) {
      super(options);
      this.getIcon();
    }
  
    getIcon() {
      const div = document.createElement("div");
      div.textContent = "H";
      return div;
    }
}