
import {editMixin} from "@auae/core"
// import formContent from "../components/uml/floatWrap.vue"
import nodeMixin from "./nodeMixin";
export default {
    name: 'uml-obj-head',
    props: ['data','showDesp'],
    mixins: [editMixin,nodeMixin],
    data() {
        return {
 
        };
    },
    config: {
        x: 0,
        y: 0,
        width: um => um.data.bounds.width,
        height: 40,
        zIndex: um => um.zIndex,
        offsetX: 0,
        offsetY: 0,
        overflow: 'visible'
    },
    draw() {
        this.hasLoad;
        let that = this;
        let ctx = this.$ctx;
        let width = this.data.bounds.width;

        ctx.font = 'bold 14px "微软雅黑"';
        ctx.fillStyle = '#333'
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        // 标题绘制
        if(this.showDesp){
            ctx.fillText(this.data.name,  width/2, 10);
            ctx.font = '12px "微软雅黑"';
            ctx.fillStyle = '#757E7F'
            ctx.fillText(this.data.localName,  width/2, 30);
        }else{
            ctx.fillText(this.data.name,  width/2, 20);
        }

        this.drawLine(0, 38, width, 1, ctx);
        const self = this;
        this.$off("dblclick")
        this.$on("dblclick", (e) => {
        //    const vueRoot = IDE.editorPart.activeEditorDomLayer;
        //    const FloatModel = Vue.extend(formContent);
        //    const warpDom =$("<div></div>");
        //    $(vueRoot).append(warpDom);
        //    const vm = new FloatModel();
        //    vm.selType = "head";
        //    vm.currentData = self.data;
        //    vm.curItem ={
        //      localName:self.data.localName,
        //      name:self.data.name,
        //      type:self.data.kind
        //    };
        //    vm.formType = "edit";
        //    vm.eventHandler = e.e;
    
        //    vm.$mount(warpDom[0]);
           e.e.stopPropagation();
           return false;
        })
       
    },
    methods: {
        /**
         * 绘制直线
         * @param {Number} x 直线x轴起点
         * @param {Number} y 直线Y轴起点
         * @param {Number} width 直线长度
         * @param {Number} height 直线粗细
         * @param {Object} ctx this
         */
        drawLine(x, y, width, height, ctx) {
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, 0);
            ctx.fill();
            ctx.closePath();
        }
    }

};