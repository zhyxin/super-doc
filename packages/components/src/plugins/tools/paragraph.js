import { Plugin, generateParagraphData } from '@super-doc/api'
import * as _ from '@super-doc/share';

export class ParagraphTool extends Plugin.ToolPluginBase {
    type = "Paragraph";
    text = "段落";
    icon = null;
    nodeName = ["P","p"]

  
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
    complieHTMLToBlockData(node,blockData){
      if(typeof node.innerHTML !== "undefined") 
        blockData.push(..._.compileParagraph(node.innerHTML))
    }

    deComplieBlockDataToHTML(block){
      return  `<p>${block.data.text}</p>`
    }
   
}