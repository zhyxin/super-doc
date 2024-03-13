// import { Plugin, addListener, showCommand, syncDom } from "@super-doc/api";
// export default class Head extends Plugin.BlockBase {
//   config = null;
//   fontSize = {
//     'h1': '32px',
//     'h2': '25px',
//     'h3': '18px',
//     'h4': '16px',
//     'h5': '14px',
//     'h6': '12px',
//   };
//   marginTop = {
//     'h1':'26px',
//     'h2':'21px',
//     'h3':'18px',
//     'h4':'16px',
//   }
//   marginBottom = {}

//   translateEl = null;

//   constructor(options) {
//     super(options);
//     const { config, ...other } = options;
//     this.config = config;
//   }

//   render() {
//     const el = document.createElement(this.config.data.level);
//     el.setAttribute(
//       "placeholder",
//       `标题${this.config.data.level.replace("h", "")}`
//     );
//     el.style.padding = 0;
//     el.style.margin = 0;
//     el.style['font-weight'] = 'bold';
//     el.style['font-size'] = this.fontSize[this.config.data.level];
//     el.style['line-height'] = '1.45';
//     this.setStyle(el)
//     el.setAttribute('id', "superdoc-paragraph");
//     const _template = document.createElement("div");
//     _template.innerHTML = this.config.data.text;
//     el.innerHTML = this.config.data.text;
//     this.bindUpdateEvent(el);

//     // 外层
//     const container = document.createElement('div');
//     container.classList.add('head-container');
//     container.appendChild(el);

//     // // 翻译
//     const translate = document.createElement('div');
//     translate.classList.add('translate');
//     translate.classList.add('super-doc-common-hidden');
//     translate.innerHTML = `<span>原：</span>${this.config.data.translate}`;
//     container.appendChild(translate);
    
//     this.translateEl = translate;
//     return container;
//   }

//   setStyle(el){
//     let marginTop = this.marginTop[this.config.data.level]
//     marginTop && (el.style["margin-top"] = marginTop)
//     let marginBottom = this.marginBottom[this.config.data.level] || '12px';
//     marginBottom && (el.style["margin-bottom"] = marginBottom)
//   }

//   bindUpdateEvent(el) {
//     addListener("update", (block) => {
//       if(block &&  this.config.id === block.id) {
//         const _template = document.createElement("div");
//         _template.innerHTML = block.data.text;
//         console.log(el, '====el====');
//         console.log(_template, '====_template====');
//         // syncDom(el, _template);

//         // if(block.data.translate) {
//         //   this.translateEl.classList.remove('super-doc-common-hidden');
//         //   this.translateEl.classList.add('super-doc-common-show');
//         // }
//       }
//     });
    
//   }

// }





import { Plugin } from "@super-doc/api";
import _Head from '../../components/head.vue';

export default class Head extends Plugin.BlockBase {
  config = null;
  platform = "vue";
  constructor(options) {
    super(options);
    if (!options) return;
    const { config, ...other } = options;
    this.config = config;
    
    this.editor = false;
  }

  render() {
    return _Head;
  }
}
