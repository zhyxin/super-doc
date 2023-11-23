import { Plugin } from '/Users/yixin/Desktop/自己的项目/supperDoc/packages/api/dist/api.esm-bundler.js';
window.ToolLayoutBase = Plugin.ToolLayoutBase;

class DeleteTool extends Plugin.ToolLayoutBase {
  type = "Delete";
  text = "删除";
  icon = null;

  blockData = {
    type: this.type,
    data: {},
    class: window[this.type],
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

  action({ Editor }) {
    this.Editor = Editor;
    const { BlockManager } = this.Editor;
    const { currentHoverBlockId } = BlockManager;
    BlockManager.removeBlock(currentHoverBlockId);
  }
}
class MoveUpTool extends Plugin.ToolLayoutBase {
  type = "MoveUp";
  text = "上移";
  icon = null;

  blockData = {
    type: this.type,
    data: {},
    class: window[this.type],
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

  action({ Editor }) {
    this.Editor = Editor;
    const { BlockManager } = this.Editor;
    const { currentHoverBlockId } = BlockManager;
    BlockManager.moveUp(currentHoverBlockId);
  }
}
class MoveDownTool extends Plugin.ToolLayoutBase {
  type = "MoveDown";
  text = "下移";
  icon = null;

  blockData = {
    type: this.type,
    data: {},
    class: window[this.type],
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

  action({ Editor }) {
    this.Editor = Editor;
    const { BlockManager } = this.Editor;
    const { currentHoverBlockId } = BlockManager;
    BlockManager.moveDown(currentHoverBlockId);
  }
}
window.DeleteTool = DeleteTool;
window.MoveUpTool = MoveUpTool;
window.MoveDownTool = MoveDownTool;
