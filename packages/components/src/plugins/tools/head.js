import { Plugin } from "@super-doc/api";
import * as _ from '@super-doc/share';

export class HeadTool1 extends Plugin.ToolPluginBase {
  type = "Head";
  text = "H1 一级标题";
  icon = null;
  nodeName = ["h1","H1"]


  blockData = {
    type: this.type,
    data: {
      text: "",
      level: "h1",
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
  complieHTMLToBlockData(node,blockData){
    if(typeof node.innerHTML !== "undefined") 
      blockData.push(..._.compileHead(node.innerHTML,node.nodeName.toLowerCase()))
  }
  deComplieBlockDataToHTML(block){
    return `<${block.data.level}>${block.data.text}</${block.data.level}>`
  }
}
export class HeadTool2 extends Plugin.ToolPluginBase {
  type = "Head";
  text = "H2 二级标题";
  nodeName = ["h2","H2"]
  icon = null;

  blockData = {
    type: this.type,
    data: {
      text: "",
      level: "h2",
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
  complieHTMLToBlockData(node,blockData){
    if(typeof node.innerHTML !== "undefined") 
      blockData.push(..._.compileHead(node.innerHTML,node.nodeName.toLowerCase()))
  }
  deComplieBlockDataToHTML(block){
    return `<${block.data.level}>${block.data.text}</${block.data.level}>`
  }
}
export class HeadTool3 extends Plugin.ToolPluginBase {
  type = "Head";
  text = "H3 三级标题";
  icon = null;
  nodeName = ["h3","H3"]
  blockData = {
    type: this.type,
    data: {
      text: "",
      level: "h3",
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
  complieHTMLToBlockData(node,blockData){
    if(typeof node.innerHTML !== "undefined") 
      blockData.push(..._.compileHead(node.innerHTML,node.nodeName.toLowerCase()))
  }
  deComplieBlockDataToHTML(block){
    return `<${block.data.level}>${block.data.text}</${block.data.level}>`
  }
}
export class HeadTool4 extends Plugin.ToolPluginBase {
  type = "Head";
  text = "H4 四级标题";
  nodeName = ["h4","H4"]
  icon = null;

  blockData = {
    type: this.type,
    data: {
      text: "",
      level: "h4",
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
  complieHTMLToBlockData(node,blockData){
    if(typeof node.innerHTML !== "undefined") 
      blockData.push(..._.compileHead(node.innerHTML,node.nodeName.toLowerCase()))
  }
  deComplieBlockDataToHTML(block){
    return `<${block.data.level}>${block.data.text}</${block.data.level}>`
  }
}
export class HeadTool5 extends Plugin.ToolPluginBase {
  type = "Head";
  text = "H5 五级标题";
  icon = null;
  nodeName = ["h5","H5"]

  blockData = {
    type: this.type,
    data: {
      text: "",
      level: "h5",
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
  complieHTMLToBlockData(node,blockData){
    if(typeof node.innerHTML !== "undefined") 
      blockData.push(..._.compileHead(node.innerHTML,node.nodeName.toLowerCase()))
  }
  deComplieBlockDataToHTML(block){
    return `<${block.data.level}>${block.data.text}</${block.data.level}>`

  }
}
export class HeadTool6 extends Plugin.ToolPluginBase {
  type = "Head";
  text = "H6 六级标题";
  icon = null;
  nodeName = ["h6","H6"]
  blockData = {
    type: this.type,
    data: {
      text: "",
      level: "h6",
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

  complieHTMLToBlockData(node,blockData){
    if(typeof node.innerHTML !== "undefined") 
      blockData.push(..._.compileHead(node.innerHTML,node.nodeName.toLowerCase()))
  }

  deComplieBlockDataToHTML(block){
    return `<${block.data.level}>${block.data.text}</${block.data.level}>`
  }
}
