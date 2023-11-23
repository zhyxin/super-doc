// // import _TableVue from '../../components/tableVue.vue';
// // import _MdVue from '../../components/mdVue.vue';
// // import _Auae from '../../components/auae.vue';
// // import _AI from '../../components/ai.vue';
// // import _AiDialog from '../../components/aiDialog.vue';
// // import _paragraph from '../../components/paragraph.vue';
// // import { Plugin } from '/Users/yixin/Desktop/自己的项目/supperDoc/packages/api/dist/api.esm-bundler.js';

// class Paragraph extends Plugin.BlockBase {
  
//   config = null;
//   constructor(options) {
//     super(options);
//     const { config, ...other } = options;
//     this.config = config;
//   }

//   render() {
//     const div = document.createElement("div");
//     div.textContent = this.config.data.text;
//     div.setAttribute("placeholder", '"/"插入内容，或"command + /"唤起文档AI');
//     // TODO: 此处改成api模块
//     div.addEventListener("input", (event) => {
//       if(event.target.innerText === '/') {
//         this.config.Editor.UI.command.visible = true;
//       }
//     });
//     return div;
//   }
// }

// class Head extends Plugin.BlockBase {
//   config = null;
//   constructor(options) {
//     super(options);
//     const { config, ...other } = options;
//     this.config = config;
//   }

//   render() {
//     const el = document.createElement(this.config.data.level);
//     el.textContent = this.config.data.text;
//     el.setAttribute("placeholder", `标题${this.config.data.level.replace('h', '')}`);
//     return el;
//   }
// }

// class Table extends Plugin.BlockBase {
//   config = null;
//   constructor(options) {
//     debugger
//     super(options);
//     const { config, ...other } = options;
//     this.config = config;
//     this.contentEditable = 'true';
//   }

//   render() {
//     const table = document.createElement("table");
//     table.setAttribute("id", "table_id_example");
//     table.setAttribute("class", "display");
//     table.innerHTML = `
//       <thead>
//           <tr>
//               <th>Column 1</th>
//               <th>Column 2</th>
//           </tr>
//       </thead>
//       <tbody>
//           <tr>
//               <td>Row 1 Data 1</td>
//               <td>Row 1 Data 2</td>
//           </tr>
//           <tr>
//               <td>Row 2 Data 1</td>
//               <td>Row 2 Data 2</td>
//           </tr>
//       </tbody>
//       `;
//     return table;
//   }
// }

// class TableVue extends Plugin.BlockBase {
//   config = null;
//   contentEditable = 'true';
//   platform = "vue";
//   constructor(options) {
//     super(options);
//     const { config, ...other } = options;
//     this.config = config;
//   }

//   render() {
//     return _TableVue;
//   }
// }

// class MdVue extends Plugin.BlockBase {
//     config = null;
//     platform = "vue";
//     constructor(options) {
//       super(options);
//       const { config, ...other } = options;
//       this.config = config;
//       this.editor = false;
//     }
  
//     render() {
//       return _MdVue;
//     }
// }

// class Auae extends Plugin.BlockBase {
//     config = null;
//     platform = "vue";
//     constructor(options) {
//       super(options);
//       const { config, ...other } = options;
//       this.config = config;
//       this.editor = false;
//     }
  
//     render() {
//       return _Auae;
//     }
// }

// class AI extends Plugin.BlockBase {
//   config = null;
//   platform = "vue";
//   constructor(options) {
//     super(options);
//     if(!options) return;
//     const { config, ...other } = options;
//     this.config = config;
//     this.editor = false;
//   }

//   render() {
//     return _AI;
//   }
// }

// class AiDialog extends Plugin.BlockBase {
//   config = null;
//   platform = "vue";
//   constructor(options) {
//     super(options);
//     if(!options) return;
//     const { config, ...other } = options;
//     this.config = config;
//     this.editor = false;
//   }

//   render() {
//     return _AiDialog;
//   }
// }

// class paragraphVue extends Plugin.BlockBase {
//   config = null;
//   platform = "vue";
//   constructor(options) {
//     super(options);
//     if(!options) return;
//     const { config, ...other } = options;
//     this.config = config;
//     console.log(this.config);
//     this.editor = false;
//   }

//   render() {
//     return _paragraph;
//   }
// }


// // window.AI = AI;
// window.AiDialog = AiDialog;
// window.TableVue = TableVue;
// window.Table = Table;
// window.Paragraph = paragraphVue;
// window.Head = Head;
// window.MdVue = MdVue;
// // window.Auae = Auae;
// window.ParagraphVue = paragraphVue
