import { Plugin } from "@super-doc/api";
import { generateBlockId } from "../../../../share/src";
export default class ListTool extends Plugin.ToolPluginBase {
  type = "ListDoc";
  text = "列表";
  icon = null;

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
}
