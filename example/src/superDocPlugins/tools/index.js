import { translationEnglishApi, translationHKhApi } from '../../api/index';
import { Plugin } from '../../../../packages/api/dist/api.esm-bundler.js';
export class AuaeTool extends Plugin.ToolPluginBase {
  type = 'Auae';
  text = 'Auae';
  icon = null;

  blockData = {
    type: this.type,
    data: {
      text: ''
    },
    class: this.type
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

export class FullTextTranslationEnglishTool extends Plugin.ToolPluginBase {
  type = 'custom';
  text = '中英互译（全文）';
  icon = null;

  blockData = {
    type: this.type,
    data: {
      translationType: 'english',
      range: 'full',
    },
    class: this.type
  };

  constructor(options) {
    super(options);
    this.getIcon();
  }

  getIcon() {
    const div = document.createElement('div');
    div.textContent = '全文翻译';
    return div;
  }
  
  main({ BlockManager, Renderer, API, Menu, UI, Event }) {
    const paragraphBlocks = BlockManager.blocks.filter(block => {
      return block.type === "Paragraph" || block.type === 'Head';
    });
    paragraphBlocks.map(block => {
      translationEnglishApi({
        "text": block.data.text
      }).then(translate => {
        const original = block.data.text;
        block.data.text = translate;
        block.data.translate = original;
      })
    })
  }

  
}
export class FullTextTranslationHKTool extends Plugin.ToolPluginBase {
  type = 'custom';
  text = '简繁互译（全文）';
  icon = null;

  blockData = {
    type: this.type,
    data: {
      translationType: 'hk',
      range: 'full',
    },
    class: this.type
  };

  constructor(options) {
    super(options);
    this.getIcon();
  }

  getIcon() {
    const div = document.createElement('div');
    div.textContent = '全文翻译';
    return div;
  }
  
  main({ BlockManager, Renderer, API, Menu, UI, Event }) {
    const paragraphBlocks = BlockManager.blocks.filter(block => {
      return block.type === "Paragraph" || block.type === 'Head';
    });
    paragraphBlocks.map(block => {
      translationHKhApi({
        "text": block.data.text,
        "is_simple": true
      }).then(translate => {
        const original = block.data.text;
        block.data.text = translate;
        block.data.translate = original;
      })
    }) 
  }
}

export class ParagraphTranslationEnglishTool extends Plugin.ToolPluginBase {
  type = 'custom';
  text = '中英互译（段落）';
  icon = null;

  blockData = {
    type: this.type,
    data: {
      translationType: 'English',
      range: 'paragraph',
    },
    class: this.type
  };

  constructor(options) {
    super(options);
    this.getIcon();
  }

  getIcon() {
    const div = document.createElement('div');
    div.textContent = '全文翻译';
    return div;
  }
  
  main({ BlockManager, Renderer, API, Menu, UI, Event }) {
    const block = BlockManager.currentHoverBlock;
    translationEnglishApi({
      "text": block.data.text
    }).then(translate => {
      const original = block.data.text;
      block.data.text = translate;
      block.data.translate = original;
    })
  }
}

export class ParagraphTranslationHKTool extends Plugin.ToolPluginBase {
  type = 'custom';
  text = '简繁互译（段落）';
  icon = null;

  blockData = {
    type: this.type,
    data: {
      translationType: 'hk',
      range: 'paragraph',
    },
    class: this.type
  };

  constructor(options) {
    super(options);
    this.getIcon();
  }

  getIcon() {
    const div = document.createElement('div');
    div.textContent = '全文翻译';
    return div;
  }
  
  main({ BlockManager, Renderer, API, Menu, UI, Event }) {
    const block = BlockManager.currentHoverBlock;

    translationHKhApi({
      "text": block.data.text,
      "is_simple": true
    }).then(translate => {
      const original = block.data.text;
      block.data.text = translate;
      block.data.translate = original;
    })
  }
}


