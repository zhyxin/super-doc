import { Plugin } from "@super-doc/api";
import { generateBlockId } from "../../../../share/src";
import * as _ from '@super-doc/share';

export default class ListTool extends Plugin.ToolPluginBase {
  type = "ListDoc";
  text = "列表";
  icon = null;
  nodeName = ["UL","OL","ol","ul"]

  blockData = {
    type: this.type,
    data: {
      type: "ul",
      list: [{ text: "", id: generateBlockId() }],
    },
    class: this.type,
  };

  constructor(options) {
    super(options);
    this.getIcon();
  }

  getIcon() {
    const div = document.createElement("div");
    div.textContent = "L";
    return div;
  }
  complieHTMLToBlockData(node,blockData){
    let list = []
    node.childNodes.forEach((c)=> {
      if(typeof c.innerHTML !== "undefined") list.push({text:c.innerHTML})
    });
    blockData.push(_.compileListData(list,node.nodeName.toLowerCase()))
  }

  deComplieBlockDataToHTML(block){
    return `<${block.data.type}>${block.data.list.map(item=>{ return `<li>${item.text}</li>`}).join('\r\n')}</${block.data.type}>`
  }
}
