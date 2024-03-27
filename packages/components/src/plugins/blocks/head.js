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





import { Plugin , generateHeadData } from "@super-doc/api";
import _Head from '../../components/head.vue';
import * as _ from '@super-doc/share';

export default class Head extends Plugin.BlockBase {
  config = null;
  platform = "vue";
  name = "Head"
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

  // 复制回调构建blockData数据
  copyEventCallBack(context,event, blockInstance){
    console.log(`【superDoc】: 执行复制_head`);
  }
  cutEventCallBack(context,event,cutData, blockInstance){
    let manager = context.Event.Editor.BlockManager;

    console.log(`【superDoc】: 执行剪切_head`,cutData,blockInstance);
    let text = blockInstance.element.querySelector("[block-id]").firstChild?.firstChild?.innerHTML || ""
   if(!text){
    manager.removeBlock(cutData.id);
   }else{
    blockInstance.data.text = text;
   }
  }

  pasteEventCallBack(context,event){
    console.log(`【superDoc】: 执行粘贴_head`);
    let manager = context.Event["Editor"].BlockManager
    let focusBlock =  manager.curentFocusBlock;
    let { block, type, status, data} = manager.currentCopyBlockInfo
    let deepCloneBlock = _.deepCloneRefreshId(data, [
      "id",
    ]);
    if(type == "text"){
      if(!focusBlock.data.text){
        // var clipboardData = event.clipboardData || window["clipboardData"]; // 获取剪贴板数据对象
        // var text =
        // manager.currentCopyBlockInfo.content ||
        // clipboardData.getData("text/plain"); // 获取纯文本格式的复制内容
        manager.replaceCurrentBlock(deepCloneBlock, focusBlock.id);
        event.preventDefault();
        return
      }
      // console.log("【superDoc】:执行默认粘贴事件");
    }else {
      // 粘贴的是块级节点 , 直接添加到当前节点尾部
      const currentBlockIndex = manager.blocks.findIndex(block => block.id === focusBlock.id);
      manager.blocks.splice(currentBlockIndex + 1, 0, ...deepCloneBlock);
      event.preventDefault();
    }
   
  }

  compileData(instance,text){
    console.log(text,'compileData')
    return _.compileHead(text,instance.data.level)
  }

  selectionCallBack(context,event,copyDom, blockInstance){
    console.log(`【superDoc】: 执行选择_head`);
    let manager = context.Editor.BlockManager
    let text = copyDom.querySelector("#superdoc-paragraph").innerHTML
    let headObject = generateHeadData(blockInstance.data.level)
    headObject.data.text = text;
    // 当前选中节点的id赋值
    headObject.id = blockInstance.id;
    manager.currentSelectionBlockInfo.data.push(headObject)
  }
}
