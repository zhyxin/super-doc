/**
 * 模块
 */
// import umlTitleForm from "../components/uml/umlTitleForm.vue"
// import {
//     editMixin,
//     groupMixin
// } from "@auae/core"

import {editMixin,groupMixin} from "@auae/core"
// import { deleteModuleApi } from "@/api/api";
export default {
    name: "uml-module",
    props: ["data", "flowContent"],
    mixins: [editMixin,groupMixin],
    data() {
      return {
        show:true
      };
    },
    config: {
      x: (um) => um.bounds.x,
      y: (um) => um.bounds.y,
      width: (um) => um.bounds.width + 10,
      height: (um) => um.bounds.height + 10,
      overflow: "visible",
      zIndex: (um) => um.zIndex||um.data.zIndex,
      offsetX: 5,
      offsetY: 5,
      show:um=>um.show
    },
    draw() {
       const self = this;
        this.drawRectShape();
        this.off("delete_self");
        this.on("delete_self",()=>{
          // deleteModuleApi(this.data._id).then(()=>{
          //         //暂时交给画布删
                  
          //    }).catch(e=>console.log('删除失败',e))
        })

        this.$off("dblclick");
        this.$on("dblclick", (e) => {
          //  const vueRoot = IDE.editorPart.activeEditorDomLayer;
          //  const FloatModel = Vue.extend(umlTitleForm);
          //  const warpDom =$("<div></div>");
          //  $(vueRoot).append(warpDom);
          //  const vm = new FloatModel();
          //  vm.selType = "module";
          //  vm.currentData = self.data;
          //  vm.curItem ={
          //    localName:self.data.localName,
          //    name:self.data.name
          //  };
          //  vm.formType = "edit";
          //  vm.eventHandler = e.e;
          //  vm.$mount(warpDom[0]);
           e.e.stopPropagation();
           return false;
        })
    },
    methods: {
      drawRectShape() {

        let ctx = this.$ctx;
          ctx.beginPath();
  
          ctx.setLineDash([2,2]);
        
          ctx.roundRect(
            0,
            0,
            this.data.bounds.width,
            this.data.bounds.height + 1,
            10
          );
      
        ctx.stroke();
        ctx.strokeStyle = "#ddd";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle ="transparent";
        ctx.fill();

        ctx.font = 'bold 14px "微软雅黑"';
        ctx.fillStyle = '#333'
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(
          this.data.name+`(${this.data.localName})`,
          this.data.bounds.width / 2,
           10
        );
      }
    }
  };
  