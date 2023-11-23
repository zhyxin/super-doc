
import {editMixin} from "@auae/core"
import nodeMixin from "./nodeMixin.js";
// import formContent from "../components/uml/floatWrap.vue"
// import {delDomainObjMethodApi} from "@/api/api.js"
// {
//     "createTime": "1685608675734",
//     "createUserName": null,
//     "updateTime": "1685608691671",
//     "updateUserName": null,
//     "id": "domainMethod-4JP4FtAb",
//     "name": "addUser",
//     "localName": "新增用户",
//     "inputParams": [
//         {
//             "name": "name",
//             "index": 0,
//             "paramType": "INPUT",
//             "type": "java.lang.String"
//         }
//     ],
//     "outputParam": {
//         "name": "isAdded",
//         "index": 0,
//         "paramType": "OUTPUT",
//         "type": "java.lang.Boolean"
//     },
//     "domainObjectId": "domainObj-mfZZRRZY",
//     "lineHeight": 1
// }


export default {
    name: 'uml-obj-method',
    props: ['data',"obj","tx","ty","showDesp"],
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
        show:um=>um.$parent.showMethod
    },
    draw() {
        let ctx = this.$ctx;
        let parentW = this.$parent.data.bounds.width
    
       if (this.isHover) {
        this.drawHoverShape();
      
      }
      if (this.isSelected) {
        this.drawSelectedShape();
        // this.$parent.showMTool = true;
        // this.$parent.showAttrTool = false;
      }
      this.createCanvas(10, 10, 6, 10, 14, "#FABBC6",1, "#FABBC6","#5B5B5B", "m", "bold 12px Arial", ctx);
      
          // 文本样式
          ctx.font = '12px Arial';
          ctx.fillStyle = '#753EC1';
          ctx.textBaseline = "middle";
          ctx.textAlign = "left";
          ctx.fillText('- '+this.data.name+`(${this.data?.inputParams.map(item=>item.type.substr(item.type.lastIndexOf('.')+1)).join(',')})`, 18, 10);
         ctx.textAlign = "right";
         ctx.fillStyle="#2E6DED";
         ctx.fillText(this.data.outputParam.type, parentW-5, 10);
         if(this.showDesp){
            ctx.fillStyle = '#753EC1';
            ctx.font = '12px "微软雅黑"';
            ctx.textAlign = "left";
            ctx.fillText(this.data.localName,  5, 30);
         }

        const self = this;
         this.$off("dblclick")
         this.$on("dblclick", (e) => {
            // const vueRoot = IDE.editorPart.activeEditorDomLayer;
            // const FloatModel = Vue.extend(formContent);
            // const warpDom =$("<div></div>");
            // $(vueRoot).append(warpDom);
            // const vm = new FloatModel();
            // vm.selType = "method";
            // vm.currentData = self.obj;
            // vm.curItem = self.data;
            // vm.formType = "edit";
            // vm.eventHandler = e.e;
   
            // vm.$mount(warpDom[0]);
             e.e.stopPropagation();
            return false;
         })


        this.off("delete_child");
        this.on("delete_child",()=>{
            // delDomainObjMethodApi(self.data.id).then(()=>{
            //     let attrs = self.$parent.data.methods;
            //     self.$parent.data.methods.splice(attrs.findIndex(e=>e.id===self.data.id),1);
        
            // }).catch(e=>console.log('删除失败',e))
       
        })


    }
  

};