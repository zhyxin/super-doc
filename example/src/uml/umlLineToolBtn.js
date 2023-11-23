

import {editMixin} from "@auae/core"

import nodeMixin from "./nodeMixin.js";


const ICONS = {
    "ASSOCIATION": "\\ue883",
    "GENERALIZATION": "\\ue885",
    "COMPOSITION": "\\ue881",
    "AGGREGATION": "\\ue887",
}

// import { editLineApi,addLineApi} from "@/api/api.js"

export default {
    name: 'uml-line-tool-btn',
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
        let circleText = "+";
        let cirFillStyle = "#F2CF94";
        let formType = "";
        let realType = this.btnType;
        if(this.isHover){
            this.drawBtnHoverShape()
        }

        switch (this.btnType) {
            case "AGGREGATION":
                ctx.fillStyle = '#5B5B5B'
                ctx.font = '16px dddicon';
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.fillText(eval(`("${ICONS['AGGREGATION']}")`), 15, 15);

                break;
            case "DEPENDENCY":
                ctx.fillStyle = '#5B5B5B'
                ctx.font = '16px dddicon';
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.fillText(eval(`("${ICONS['DEPENDENCY']}")`), 15, 15);

                break;

            case "ASSOCIATION":
                ctx.fillStyle = '#5B5B5B'
                ctx.font = '16px dddicon';
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.fillText(eval(`("${ICONS['ASSOCIATION']}")`), 15, 15);

                break;
            case "GENERALIZATION":
                ctx.fillStyle = '#5B5B5B'
                ctx.font = '16px dddicon';
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.fillText(eval(`("${ICONS['GENERALIZATION']}")`), 15, 15);

                break;
            case "REALIZE":
                ctx.font = '16px dddicon';
                ctx.fillStyle = '#5B5B5B'
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.fillText(eval(`("${ICONS['REALIZE']}")`), 15, 15);
                break;
            case "COMPOSITION":
                ctx.fillStyle = "#5B5B5B"
                ctx.font = '16px dddicon';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(eval(`("${ICONS['COMPOSITION']}")`), 15, 15);

                break;

        }








        let hasShow = false;
        this.$off("mousedown");
        this.$on("mousedown", (e) => {
             const curEdge = self.$parent.$parent;
              const end = curEdge.end;
              const start = curEdge.start;
              const canvasId = IDE.editorPart?.$store?.getters["domainObjectConfig/getCurCanvasId"]; 
             if(curEdge.data._id){//编辑
                  let params = {
                    canvasId:canvasId,
                    id:curEdge.data._id,
                    "lineType": self.btnType
                }
                // editLineApi(params).then(r=>{
                // curEdge.data.lineType = self.btnType;
                // })

             }else {//新增
                       const lineObj = {
                        canvasId:canvasId,
                        "endBound": end.bounds,
                         "endDirection":curEdge.data.endPosition.toUpperCase(),
                         "endNodeId": end._id,
                        "lineType": self.btnType,
                        "nodeType": "domain_object",
                         "remark": self.btnType,
                         "startBound": start.bounds,
                         "startNodeId": start._id,
                         "startDirection":curEdge.data.position.toUpperCase(),
                       }
                    //   addLineApi(lineObj).then(obj=>{
                      
                     
                    //         curEdge.data.lineType = self.btnType;
                    //         curEdge.data._id = obj.id
                      
             
                       
                    //  }).catch(e=>console.log(e))
                            }
    
   

            return false

        })


    }


};