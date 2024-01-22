import { Plugin } from '../../../../packages/api/dist/api.esm-bundler.js';
class ParagraphTool extends Plugin.ToolPluginBase {
  type = "ParagraphVue";
  text = "段落";
  icon = null;

  blockData = {
    type: this.type,
    data: {
      text: '段落',
    },
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
}

class HeadTool1 extends Plugin.ToolPluginBase {
  type = "Head";
  text = "H1 一级标题";
  icon = null;

  blockData = {
    type: this.type,
    data: {
      text: "",
      level: "h1",
    },
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
}
class HeadTool2 extends Plugin.ToolPluginBase {
  type = "Head";
  text = "H2 二级标题";
  icon = null;

  blockData = {
    type: this.type,
    data: {
      text: "",
      level: "h2",
    },
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
}
class HeadTool3 extends Plugin.ToolPluginBase {
  type = "Head";
  text = "H3 三级标题";
  icon = null;

  blockData = {
    type: this.type,
    data: {
      text: "",
      level: "h3",
    },
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
}
class HeadTool4 extends Plugin.ToolPluginBase {
  type = "Head";
  text = "H4 四级标题";
  icon = null;

  blockData = {
    type: this.type,
    data: {
      text: "",
      level: "h4",
    },
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
}
class HeadTool5 extends Plugin.ToolPluginBase {
  type = "Head";
  text = "H5 五级标题";
  icon = null;

  blockData = {
    type: this.type,
    data: {
      text: "",
      level: "h5",
    },
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
}
class HeadTool6 extends Plugin.ToolPluginBase {
  type = "Head";
  text = "H6 六级标题";
  icon = null;

  blockData = {
    type: this.type,
    data: {
      text: "",
      level: "h6",
    },
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
}
class TableTool extends Plugin.ToolPluginBase {
  type = "Table";
  text = "表格";
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
}
class TableVueTool extends Plugin.ToolPluginBase {
    type = 'TableVue';
    text = '表格（Vue）';
    icon = null;
    blockData = {
      type: this.type,
      data: {
      },
      class: window[this.type]
    };

    constructor(options) {
      super(options);
      this.getIcon();
    }

    getIcon() {
      const div = document.createElement('div');
      div.textContent = 'H';
      return div;
    }
}
class MdVueTool extends Plugin.ToolPluginBase {
    type = 'MdVue';
    text = 'Markdown';
    icon = null;

    blockData = {
      type: this.type,
      data: {
      },
      class: window[this.type]
    };

    constructor(options) {
      super(options);
      this.getIcon();
    }

    getIcon() {
      const div = document.createElement('div');
      div.textContent = 'H';
      return div;
    }
}
class AuaeTool extends Plugin.ToolPluginBase {
    type = 'Auae';
    text = 'Auae画布';
    icon = null;

    blockData = {
      type: this.type,
      data: {
      },
      class: window[this.type]
    };

    constructor(options) {
      super(options);
      this.getIcon();
    }

    getIcon() {
      const div = document.createElement('div');
      div.textContent = 'H';
      return div;
    }
}

class AITool extends Plugin.ToolPluginBase {
  type = 'AI';
  text = 'AI';
  icon = null;

  blockData = {
    type: this.type,
    data: {
    },
    class: window[this.type]
  };

  constructor(options) {
    super(options);
    this.getIcon();
  }

  getIcon() {
    const div = document.createElement('div');
    div.textContent = 'H';
    return div;
  }
}

class AiDialogTool extends Plugin.ToolPluginBase {
  type = 'AiDialog';
  text = 'AI';
  icon = null;

  blockData = {
    type: this.type,
    data: {
    },
    class: window[this.type]
  };

  constructor(options) {
    super(options);
    this.getIcon();
  }

  getIcon() {
    const div = document.createElement('div');
    div.textContent = 'H';
    return div;
  }
}

window.ParagraphTool = ParagraphTool;
window.HeadTool1 = HeadTool1;
window.HeadTool2 = HeadTool2;
window.HeadTool3 = HeadTool3;
window.HeadTool4 = HeadTool4;
window.HeadTool5 = HeadTool5;
window.HeadTool6 = HeadTool6;
window.TableTool = TableTool;
window.TableVueTool = TableVueTool;
window.MdVueTool = MdVueTool;
window.AuaeTool = AuaeTool;
window.AITool = AITool;
window.AiDialogTool = AiDialogTool;
