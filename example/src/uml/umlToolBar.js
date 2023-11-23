import {editMixin} from "@auae/core"

export default {
    name: 'uml-tool-bar',
    props: ['data', "tx", "ty", "tools"],
    mixins: [editMixin],
    data() {
        return {
            isChild:true
        };
    },
    config: {
        x: um => um.tx,
        y: um => um.ty,
        width: um=>um.tools.length * 30,
        height: 32,
        zIndex: 996,
        offsetX: 0,
        offsetY: 0,
        overflow: 'visible',
        show: um => um.$parent.showObjTool
    },
    template:`
    <uml-tool-btn :btnType="item" v-for="(item,idx) in tools"  :data="data"  :tx="(idx * 30)" :ty="0"></uml-tool-btn>
    `,
    draw() {
        let ctx = this.$ctx;


                ctx.shadowOffsetX = -10;
                ctx.shadowOffsetY = -5;
                ctx.shadowColor = 'rgba(0,0,0,0.3)';
                ctx.shadowBlur = 5;
                ctx.fillStyle = "#fff";
                ctx.strokeStyle = "#f2f2f2";
                ctx.fill();
                ctx.strokeRect(0, 0, this.tools.length * 30+5, 30, 8);
                ctx.shadowBlur = 0;
                ctx.shadowColor = "transparent";




    },
 

};