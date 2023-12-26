import { Plugin } from "@super-doc/api";
export default class TableTool extends Plugin.ToolPluginBase {
  type = "TableDoc";
  text = "表格";
  icon = null;

  blockData = {
    type: this.type,
    data: {
      text: "",
    },
    class: this.type,
  };

  constructor(options) {
    super(options);
    this.getIcon();
  }

  getIcon() {
    const div = document.createElement("div");
    div.textContent = "表格";
    return div;
  }
}
