import { Plugin } from "@super-doc/api";
import { generateBlockId } from "../../../../share/src";
export default class TodoListTool extends Plugin.ToolPluginBase {
  type = "TodoList";
  text = "代办列表";
  icon = null;

  blockData = {
    type: this.type,
    data: {
      list: [{ id: generateBlockId(), finish: false, task: "" }],
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
