/**
 * 节点的mixin
 */
export default {
  data() {
    return {
      isHover: false,
      isSelected: false,
      isChild:true
    };
  },
 isHere(x, y, cx, cy) {
    // let bound = this.data.bounds;
    // if (
    //   cx >= bound.x &&
    //   cx <= (bound.x + bound.width) &&
    //   cy >= bound.y &&
    //   cy <= (bound.y + bound.height)
    // ) {
      return true
    
  },
  methods: {
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
    createCanvas(circleX, circleY, circleR, textX, textY,borderColor, borderWidth, bgColor,fontColor,fontText, font, ctx) {


      // 填充边框颜色

  
        ctx.lineWidth = borderWidth
        ctx.lineCap = 'round';
        ctx.strokeStyle =borderColor||"#fff"
      
      ctx.beginPath()
      ctx.arc(circleX, circleY, circleR, 0, Math.PI * 2, true)
      ctx.closePath()
      // 填充背景颜色
      ctx.fillStyle = bgColor
      ctx.fill()
      ctx.stroke() 

      // 填充文字颜色
      ctx.font = font
      ctx.fillStyle = fontColor||'#fff'
      ctx.textAlign = "center"
      ctx.fillText(fontText, textX, textY)
      ctx.font = 'bold 14px "微软雅黑"';
      ctx.fillStyle = '#333'
      ctx.textBaseline = "middle";
      
  },
    drawHoverShape() {
      const ctx = this.$ctx;
      const bounds = this.$parent.data.bounds;
      const showDesp = this.$parent.showDesp;
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(58, 125, 255, 1)";
      ctx.roundRect(0, 0, bounds.width, showDesp?40:20, 2);
      ctx.stroke();
   
    },
    drawBtnHoverShape() {
      const ctx = this.$ctx;
      ctx.fillStyle = "#EFF3F6";
      ctx.roundRect(3, 2, 25, 25, 2);
      ctx.fill();
   
    },
    drawSelectedShape() {
      const ctx = this.$ctx;
      const bounds = this.$parent.data.bounds;
      const showDesp = this.$parent.showDesp;
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(58, 125, 255, 1)";
      ctx.roundRect(0, 0, bounds.width, showDesp?40:20, 2);
      ctx.stroke();
  
    },
    isIncluded(x1, y1, x2, y2) {
      if (x1 > x2) {
        let temp = x1;
        x1 = x2;
        x2 = temp;
      }
      if (y1 > y2) {
        let temp = y1;
        y1 = y2;
        y2 = temp;
      }
      let bounds = this.data.bounds;
      if (
        x1 <= bounds.x &&
        x2 >= bounds.x + bounds.width &&
        y1 <= bounds.y &&
        y2 >= bounds.y + bounds.height
      ) {
        return true;
      }
      return false;
    },

  }
};