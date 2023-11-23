
// import {delDomainObjectApi} from "@/api/api"
import {editMixin,nodeMixin} from "@auae/core"

export default {
    name: 'uml-obj',
    props: ['data'],
    mixins: [nodeMixin, editMixin],
    data() {
        return {
            isHover: false,
            isSelected: false,
            isSingleAnchor:false,
          
            showObjTool:false,
            showAttrTool:true,
            showMTool:true,
            showDesp:false,
            show:true,

            showAttr:true,
            showMethod:true,

            // isAggregateRoot:false,

            tools:[],
            configMap: {
                'attribute': '#F3F7F0',
                'methods': '#F3F7F0',
            }
        };
    },
    template:`
    <uml-root-tag  :tx="0" :ty="-10"></uml-root-tag>
    <uml-tool-bar  :tools="tools" :data="data"  :tx="bounds.width-(tools.length * 30)" :ty="-32"></uml-tool-bar>
    <uml-obj-head :data="data" :showDesp="showDesp"></uml-obj-head>
    <uml-tool-btn :btnType="'addAttr'" :data="data"  :show="showAttrTool" :tx="bounds.width-60" :ty="15"></uml-tool-btn>
    <uml-tool-btn :btnType="'linkAttr'" :data="data" :show="showAttrTool"  :tx="bounds.width-30" :ty="15"></uml-tool-btn>
    <uml-obj-attr  :data="attr" :showDesp="showDesp" v-for="(attr,idx) in data.attributes" :obj="data"  :tx="0" :ty="40+(rowH * idx)"></uml-obj-attr>
    <uml-tool-btn :btnType="'addMethod'" :data="data"  :show="showMTool" :tx="methodTXadd" :ty="methodTY" ></uml-tool-btn>
    <uml-tool-btn :btnType="'linkMethod'" :data="data" :show="showMTool" :tx="methodTXlink" :ty="methodTY"></uml-tool-btn>
    <uml-obj-method  :data="method" :showDesp="showDesp" v-for="(method,idx) in data.methods" :obj="data"  :tx="0" :ty="40+(rowH * (showAttr?data.attributes.length:0))+(rowH * idx)"></uml-obj-method>
    `,
    config: {
        x: um => um.data.bounds.x,
        y: um => um.data.bounds.y,
        width: um => um.data.bounds.width,
        height: um => {
            let realH = 40;
            realH = realH + um.rowH * ((um.showAttr?um.data.attributes.length:0) + (um.showMethod?um.data.methods.length:0))
            return realH;
        },
        zIndex: 99,
        offsetX: 0,
        offsetY: 0,
        overflow: 'visible',
        show:um=>um.show
    },
    computed: {
        bounds(){
            return this.data.bounds
        },
        rowH(){
            return this.showDesp?40:20
        },
        methodTY(){
            return (this.showAttr && this.data.attributes.length)?40+(this.rowH * (this.data.attributes.length))-15:35
        },
        methodTXadd(){
            return this.bounds.width-60
        },
        methodTXlink(){
            return this.bounds.width-30
        },
   

    },
    created(){
       this.data.bounds.height = 40 + (this.showDesp?40:20) * ((this.showAttr ? this.data.attributes.length:0) + (this.showMethod?this.data.methods.length:0));
    },
    draw() {
        let that = this;
        let ctx = this.$ctx;

        let width = this.data.bounds.width;
        let height = 40 + (this.showDesp?40:20) * ((this.showAttr ? this.data.attributes.length:0) + (this.showMethod?this.data.methods.length:0));
        let backgroundColor = '#ADD8E6';
        let strokeStyle ="#00B0F0";
        switch (this.data.kind) {
            case "ENTITY":
                backgroundColor = '#D7F4FF';
                strokeStyle="#00B0F0";
            
                break;
            case "VALUEOBJECT":
                backgroundColor = '#DCF8EA';
                strokeStyle="#07C99C";
         
                break;
            default:
                backgroundColor = '#fff';
                strokeStyle="#333";
                break;
        }
        
        ctx.fillStyle = backgroundColor;
        ctx.strokeStyle = strokeStyle;
        ctx.roundRect(0, 0, width, height, 0);
        ctx.fill();
        ctx.stroke();
        this.showAttrTool=false;
        this.showMTool=false;
        this.showObjTool = false;
        if(this.isSelected){
            this.showObjTool = true;
        }
        if(this.isHover){
            this.showObjTool = true;
            this.showAttrTool=true;
            this.showMTool=true;
        }
        this.tools = this.getTools();
        
        //方法和属性的分割线
        ctx.fillStyle = "#333";
       this.showAttr && this.data.attributes.length && this.drawLine(0,this.showDesp?this.methodTY+12:40+(this.rowH * (this.data.attributes.length)),width,1,ctx)
      
       this.off("delete_self");
       this.on("delete_self",()=>{
            // delDomainObjectApi(that.data._id).then(()=>{
            //      //暂时交给画布删
                 
            // }).catch(e=>console.log('删除失败',e))
       })
       
    },
    methods: {
        getTools(){
  
            const $Aggs = this.$parent.$children.filter(t=>t.$tag==="aggregate").find(n=>n.data._id===this.data.aggregateId);

           if(this.data.kind==="ENTITY" && this.data.aggregateId && !this.data.aggregateRoot && $Aggs && !$Aggs.data.aggregateRootId){
               return ["aggregate","module","setRoot","setter"]
           }else{
               return ["aggregate","module","setter"]
           }
       
       },
        getCurRectHeight(){
            let realH = 40;
            realH = realH + this.rowH * (this.data.attributes.length + this.data.methods.length)
            return realH;
        },
        /**
         * 绘制文本
         * @param {Array} textArr 文本数组
         * @param {Number} textY 文本Y轴
         * @param {Number} textY 文本Y轴
         * @param {String} type 类型
         * @param {Object} ctx this
         */
        drawText(textArr,textX, textY, type, ctx,that) {
            if (Array.prototype.isPrototypeOf(textArr) && type === "attributes") {
                let calTextY = textY;
                textArr.forEach((element, index) => {
                    let attributeType = element.type || '';
                    let text = "  "+' - ' + element.name + "  " + attributeType;
                    this.moreRow(text,textX,textY + element.textLines*16,this.data.bounds.width,ctx,that,type)
                });
            }
            if (Array.prototype.isPrototypeOf(textArr) && type === "methods") {
                textArr.forEach(element => {
                    let inputParams = ''
                    if (element.inputParams.length > 1) {
                        element.inputParams.forEach(item => {
                            inputParams = inputParams + item.type + " " + item.name+" "
                        })
                    }
                    let text = "  "+' + ' + element.name + " (" + inputParams + ") "
                    this.moreRow(text,textX,textY + element.lineHeight*16,this.data.bounds.width,ctx,that,type)
                });
            }
        },
        
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
        },
        /**
         * 绘制多行文本
         * @param {String} str  要渲染的文本
         * @param {Number} textX 文本的X轴
         * @param {Number} textY 文本的Y轴
         * @param {Number} width 文本长度
         * @param {Object} ctx 
         */
       moreRow(str,textX,textY,width,ctx,that,type){
        let font = 'bold 14px "微软雅黑"';
        let rs =[]
        let bgColor=""
        let circleText=""
        let textAdjustmentX = 0
        let textAdjustmentY = 0
        switch (type) {
            case "attributes":
                bgColor="#FFA500";
                circleText = "F"
                // 加像素进行调整
                textAdjustmentX = 1
                textAdjustmentY = 1
                break;
            case "methods":
                textAdjustmentY = 1
                bgColor="#FA8072";
                circleText = "M"
                break;
            default:  
                break;
        }
        if(getTextWidth(str,font) > width ){
            // 每28个,分割字符串
            var reg = /.{28}/g;
            rs =str.length>28? str.match(reg):[];//注意,如果s的长度小于29,那么rs=""
            rs.push(str.substring(rs.join('').length));
            let TextLineHeight =textY - (rs.length)*16
            that.createCanvas(textX+4 ,TextLineHeight+16 ,7,textX+textAdjustmentX,TextLineHeight+16+textAdjustmentY, 1, bgColor, circleText,"10px Arial",ctx)
            rs.forEach((item,index)=>{
                ctx.fillText(item, textX, TextLineHeight+(index+1)*16);  
            })
        }else{
            that.createCanvas(textX+4 ,textY ,7,textX+textAdjustmentX,textY+textAdjustmentY, 1, bgColor, circleText,"10px Arial",ctx)
            ctx.fillText(str,textX, textY );
        }
    },
    /**
     * 
     * @param {Number} circleX 圆心X轴
     * @param {Number} circleY 圆心Y轴
     * @param {Number} circleR 圆心半径
     * @param {Number} textX 文本X轴
     * @param {Number} textY 文本Y轴
     * @param {Number} borderWidth 边框宽度
     * @param {String} bgColor 边框颜色
     * @param {String} fontText 文本内容
     * @param {String} font 文本样式
     * @param {Object} ctx 
     */
     createCanvas(circleX, circleY,circleR,textX,textY, borderWidth, bgColor,  fontText,font,ctx) {
        ctx.beginPath()
        ctx.arc(circleX, circleY, circleR, 0, Math.PI * 2, true)
        ctx.closePath()
        // 填充背景颜色
        ctx.fillStyle = bgColor
        ctx.fill()

        // 填充边框颜色
        ctx.lineWidth = borderWidth
        ctx.lineCap = 'round'
        ctx.strokeStyle = 'white'
        ctx.stroke() //

        // 填充文字颜色
        ctx.font = font
        ctx.fillStyle = '#fff'
        // ctx.textAlign = "center"
        ctx.fillText(fontText, textX,textY)
        ctx.font = 'bold 14px "微软雅黑"';
        ctx.fillStyle = '#333'
        ctx.textBaseline = "middle";
      },
      /**
       * 计算画布上文字真实行高，用于属性Y轴及属性块高度计算
       */
      attributesTextLine(){
        let newElement = this.data;
        if(newElement.attributes.length > 0){
            let textLines = 0;
            let font = 'bold 14px "微软雅黑"';
            newElement.attributes.forEach(item => {
                let attributeType = item.type || '';
                let text = "  "+' - ' + item?.name + "  " + attributeType;
                if(getTextWidth(text,font) > this.data.bounds.width ){ 
                    let reg = /.{28}/g;
                    let rs = text.length>28? text.match(reg):[];//注意,如果s的长度小于29,那么rs=""
                    rs.push(text.substring(rs.join('').length));
                    textLines += rs.length
                    item.textLines = textLines
                }else {
                    item.textLines = ++textLines;
                }
                
            })
        }
      }
    },
    mounted(){
    
    }

};