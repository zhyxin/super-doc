import {editMixin} from "@auae/core"
import nodeMixin from "./nodeMixin.js";
// import formContent from "../components/uml/floatWrap.vue"
// import domainObjSetter from "../components/uml/domainObjSetter.vue"
// import umlDialog from "../components/uml/umlDialog.vue"
// import umlTitleForm from "../components/uml/umlTitleForm.vue"

let imgItem = new Image();
imgItem.src = require('../assets/huanguang.png');
const ICONS = {
    setter: "\\ue8a6",
    view: "\\ue8a3",
    aggregate: "\\ue8a7",
    module: "\\ue8a5",
    add:"\\ue8ac",
    import:"\\ue8ad"
}
// import {batchAddDomainObjAttrApi,batchAddDomainObjMethodApi,editAggregationApi}  from "@/api/api.js"


export default {
    name: 'uml-tool-btn',
    props: ['data', "tx", "ty", "btnType", "show"],
    mixins: [editMixin, nodeMixin],
    data() {
        return {

        };
    },
    config: {
        x: um => um.tx,
        y: um => um.ty,
        width: 30,
        height: 30,
        zIndex: 66,
        offsetX: 0,
        offsetY: 0,
        overflow: 'visible',
        Offscreen: true,
        show: um => um.show
    },
    draw() {
        let ctx = this.$ctx;
        const self = this;
        let formType = "";
        let realType = this.btnType;

        if(this.isHover && !["addAttr","linkAttr","addMethod","linkMethod"].includes(this.btnType)){
            this.drawBtnHoverShape()
        }

        switch (this.btnType) {
            case "setRoot":
          
                ctx.drawImage(imgItem, 10, 8, 14, 14);
           
                break;

            case "aggregate":
                ctx.fillStyle = '#5B5B5B'
                ctx.font = '16px dddicon';
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.fillText(eval(`("${ICONS['aggregate']}")`), 15, 15);
                formType="add";
                break;
            case "module":
                ctx.fillStyle = '#5B5B5B'
                ctx.font = '16px dddicon';
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.fillText(eval(`("${ICONS['module']}")`), 15, 15);
                formType="add";
                break;
            case "view":
                ctx.font = '16px dddicon';
                ctx.fillStyle = '#5B5B5B'
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.fillText(eval(`("${ICONS['view']}")`), 15, 15);
                break;
            case "setter":
                ctx.fillStyle = "#5B5B5B"
                ctx.font = '16px dddicon';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(eval(`("${ICONS['setter']}")`),15,15);
      
      
               formType="setter";

                break;
            case "addAttr":

                ctx.beginPath();
                this.createCanvas(20, 20, 10, 20, 25, "#fff",1, "#F2CF94","#5B5B5B", eval(`("${ICONS['add']}")`), "12px dddicon", ctx);
                formType="add";
                realType="attr";

                break;
            case "linkAttr":

                ctx.beginPath();
                this.createCanvas(20, 20, 10, 20, 25, "#fff",1, "#F2CF94","#5B5B5B", eval(`("${ICONS['import']}")`), "12px dddicon", ctx);
                formType="relation";
                realType="attr";
                break;
            case "addMethod":
           
                ctx.beginPath();
                this.createCanvas(20, 20, 10, 20, 25, "#fff",1, "#F1BCC5", "#5B5B5B", eval(`("${ICONS['add']}")`), "12px dddicon", ctx);
                formType="add";
                realType="method";
                break;
            case "linkMethod":
     
                ctx.beginPath();
                this.createCanvas(20, 20, 10, 20, 25, "#fff",1,"#F1BCC5","#5B5B5B", eval(`("${ICONS['import']}")`), "12px dddicon",ctx);
                formType="relation";
                realType="method";
                break;

        }








       let hasShow = false;
        this.$off("mousedown");
        this.$on("mousedown", (e) => {
            // console.log('组件被点击', e);
            let eventHandler = e.e;
             let currentData = self.data;
            //  let formWrap = formContent;
            // if(this.btnType.startsWith("link")){
            //     IDE.activator.openDialog(umlDialog,{
            //         dialogType:realType==="attr"?"importAttr":"importMethod",
            //         confirmCallback(attrs){
            //             let params = [];
                    
            //             if(realType==="attr"){
            //                 attrs.forEach(ele => {
            //                     params.push({
            //                         domainObjectId:self.$parent.data.nodeId,
            //                         domainTermId:ele.id,
            //                         localName:ele.cnName,
            //                         name:ele.enName||"test",
            //                         type:"java.lang.String",
            //                         typeStructure:{
            //                             children:[],
            //                             value:"java.lang.String",
            //                             fromLocal:false
            //                         }
            //                     })
            //                 });
            //                         //元素加入的到画布里
            //                         batchAddDomainObjAttrApi(params).then(res=>{
            //                             res.map(att=>{
            //                                 self.$parent.data.attributes.push(att)
            //                             })
                                      
            //                         })
            //              }else{
            //                 const batchParams = attrs.map(ele => {
            //                     return {
            //                         domainObjectId: self.$parent.data.nodeId,
            //                         localName: ele.cnName,
            //                         name: ele.enName || "",
            //                         inputParams: [],
            //                         outputParam: {
            //                             name: "",
            //                             paramType: 'OUTPUT',
            //                             type: 'VOID',
            //                             typeStructure: {
            //                                 children: [],
            //                                 value:"VOID",
            //                                 fromLocal: true
            //                             },
            //                         },
            //                         storyOrderCardId: ele.id
            //                     }
            //                 });
            //                 batchAddDomainObjMethodApi(batchParams).then(res=>{
            //                       self.$parent.data.methods.push(...res)
            //                 })
            //              }
                     
                 
            //         }
            //        },{
            //         width:"614px",
            //         height:"60%"
            //        })
            // }else if(this.btnType === "setRoot"){
            //     const $domain = self.$parent.$parent;
 
            //     const curAggregate = self.$root.$children.find(agg=>agg.$tag==="aggregate" && agg.data._id===$domain.data.aggregateId)
            //    const activeBC = IDE.editorPart.$store.getters["domainObjectConfig/getActiveBC"]
            //   if(curAggregate){
            //     const params = {
            //         id:curAggregate.data._id,
            //         aggregateRootId:$domain.data._id,
            //         bcId:activeBC.key,
            //         projectId:activeBC.projectId
            //     };
            //     editAggregationApi(params).then(res=>{
            //         $domain.data.aggregateRoot = true;
            //     }).catch(e=>console.log(e))
            //   }
      

            // }else{
            //     const vueRoot = IDE.editorPart.activeEditorDomLayer;
            //     if(["aggregate","module"].includes(self.btnType)){
            //         formWrap = umlTitleForm;

            //         let groupOption = { 
            //             localName: "名称",
            //             name:"Name",
            //             groupType: self.btnType
            //       }

            //     //   x:bounds.x-20,
            //     //   y:bounds.y-20,
            //     //   width:bounds.width+40,
            //     //   height:bounds.height+40
            //     const pBounds = self.data.bounds;
            //       const newGroup = IDE.editorPart.activeEditor.flow.createGroup({ 
            //         x1: pBounds.x-40,
            //         y1: pBounds.y-40,
            //         x2: pBounds.x-40+pBounds.width+80,
            //         y2: pBounds.y-40+pBounds.height+80
            //     }, groupOption);
     
            //       currentData = newGroup;
            //       formType = "add";
            //       realType = self.btnType;
            //     //   eventHandler = {
            //     //     clientX:newGroup.bounds.x,
            //     //     clientY:newGroup.bounds.y
            //     //   };

            //     }else if(self.btnType==="setter"){
            //         formWrap = domainObjSetter;
            //     }

            //     const FloatModel = Vue.extend(formWrap);
            //     const warpDom =$("<div></div>");
              
            //     $(vueRoot).append(warpDom);
            //     const vm = new FloatModel();
            //     vm.selType = realType;
            //     vm.currentData = currentData;
            //     vm.formType = formType;
            //     vm.eventHandler = eventHandler;
            //     e.e.stopPropagation();
            
            //     console.log('udo', vm);
            //     vm.$mount(warpDom[0]);
            // }
    
            return false

        })


    },
    methods: {
   
    }


};