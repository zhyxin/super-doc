import { Plugin, generateParagraphData } from '@super-doc/api'

export class ParagraphTool extends Plugin.ToolPluginBase {
    type = "Paragraph";
    text = "段落";
    icon = null;
  
    blockData = generateParagraphData();
  
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