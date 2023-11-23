

import {editMixin} from "@auae/core"
import nodeMixin from "./nodeMixin.js";
// import formContent from "../components/uml/floatWrap.vue";
// import {delDoaminObjAttrApi} from "@/api/api.js"
export default {
    name: 'uml-obj-attr',
    props: ['data',"tx","ty","showDesp","obj"],
    mixins: [editMixin,nodeMixin],
    data() {
        return {
        };
    },
    config: {
        x: um => um.tx,
        y: um => um.ty,
        width: um => um.$parent.data.bounds.width,
        height: um=>um.showDesp?40:20,
        zIndex: 6,
        offsetX: 0,
        offsetY: 0,
        overflow: 'visible',
        show:um=>um.$parent.showAttr
    },

    draw() {
        
        let ctx = this.$ctx;
        let parentW = this.$parent.data.bounds.width
        if (this.isHover) {
            this.drawHoverShape();
         
          }
          if (this.isSelected) { 
            this.drawSelectedShape();
            // this.$parent.showAttrTool = true;
            // this.$parent.showMTool = false;
         
          }

        this.createCanvas(10, 10, 6, 10, 14, "#FAD096",1, "#FAD096","#5B5B5B", "f", "bold 12px Arial", ctx);

        // 文本样式
        ctx.font = '12px Arial';
        ctx.fillStyle = '#003E94';
        ctx.textBaseline = "middle";
        // 标题绘制
        ctx.textAlign = "left";
        ctx.fillText('- '+this.data.name, 18, 10);
        ctx.textAlign = "right";
        ctx.fillStyle = '#333333';
        ctx.fillText(this.data.type, parentW-5, 10);

        if(this.showDesp){
            ctx.fillStyle = '#003E94';
            ctx.font = '12px "微软雅黑"';
            ctx.textAlign = "left";
            ctx.fillText(this.data.localName,  5, 30);
         }
        const self = this;
        this.$off("dblclick")
        this.$on("dblclick", (e) => {
        //    const vueRoot = IDE.editorPart.activeEditorDomLayer;
        //    const FloatModel = Vue.extend(formContent);
        //    const warpDom =$("<div></div>");
        //    $(vueRoot).append(warpDom);
        //    const vm = new FloatModel();
        //    vm.selType = "attr";
        //    vm.currentData = self.obj;
        //    vm.curItem = self.data;
        //    vm.formType = "edit";
        //    vm.eventHandler = e.e;
        //    vm.$mount(warpDom[0]);
           e.e.stopPropagation();
           return false;

        })

        this.off("delete_child");
        this.on("delete_child",()=>{
        
            // delDoaminObjAttrApi(self.data.id).then(()=>{
            //     let attrs = self.$parent.data.attributes;
            //     self.$parent.data.attributes.splice(attrs.findIndex(e=>e.id===self.data.id),1);
        
            // }).catch(e=>console.log('删除失败',e))
       
        })


    }

};