/**
 * 连线
 */

import {
  isPointInPath
} from "uaeengine/src/utils";


import {editMixin} from "@auae/core"

// import { deleteLineApi,editLineApi} from "@/api/api";
const LineMap = {
  "ASSOCIATION":"umlAssociation",
  "GENERALIZATION":"umlInheritLine",
  "COMPOSITION":"umlComposition",
  "AGGREGATION":"umlAggergation",
  "DEPENDENCY":"umlApplation"
}


 export default {
  mixins: [editMixin],
  props: [
    "data",
    "flowContent"
  ],
  template: `
  <uml-line-tool-bar  :tools="tools" :data="data"  :tx="toolLocal.x" :ty="toolLocal.y"></uml-line-tool-bar>
  <ctrlLine   v-for="item in ctrlLines" :data="item" @dragstart="dragstart" @drag="drag"/>
  <edgeStart :x="path[0].x" :y="path[0].y"/>
  <edgeEnd  :x="path[path.length - 1].x" :y="path[path.length - 1].y"/>`,
  data() {
    return {
      isSelected: false,
      isHover: false,
      show:true,
      toolLocal:{
        x:0,
        y:0
      },
      tools:[]
// 关联、泛化、实现、组合、聚合、依赖
    };
  },
  config: {
    x: um => um.edgeBounds?.x ?? 0,
    y: um => um.edgeBounds?.y ?? 0,
    width: um => um.edgeBounds?.width ?? 0,
    height: um => um.edgeBounds?.height ?? 0,
    show:um=>um.show
   },
  computed: {
    point1() {
      const source = this.start;
      if (source) {
        const { x, y, width, height } = source.bounds;
        return { x: x + width / 2, y: y + height / 2 };
      }
      return this.data.sPoint;
    },
    point2() {
      const target = this.end;
      if (target) {
        const { x, y, width, height } = target.bounds;
        return { x: x + width / 2, y: y + height / 2 };
      }
      return this.data.ePoint;
    },
    edgeBounds() {
      const { x: x1, y: y1 } = this.point1;
      const { x: x2, y: y2 } = this.point2;
      return {
        x: Math.min(x1, x2)-8,
        y: Math.min(y1, y2)-8,
        width: Math.abs(x2 - x1)+28,
        height: Math.abs(y2 - y1)+28
      };
    },
    end() {
      // return  this.nodes.find(node => node.nodeId === this.data.endId);
      const nodes = [...this.flowContent.nodes, ...this.flowContent.groups];
      const length = nodes.length;
      const nodeId = this.data.endId;
      if (nodeId) {
        for (let i = 0, node; i < length; i++) {
          node = nodes[i];
          if (node.nodeId === nodeId || node.groupId === nodeId) {
            return node;
          }
        }
      } else {
        return null
      }

    },
    start() {
      //  return  this.nodes.find(node => node.nodeId === this.data.startId);
      const nodes = [...this.flowContent.nodes, ...this.flowContent.groups];
 
      const length = nodes.length;
      const nodeId = this.data.startId;
      for (let i = 0, node; i < length; i++) {
        node = nodes[i];
        if (node.nodeId === nodeId || node.groupId === nodeId) {
          return node;
        }
      }
    },
    startBound() {
      return (this.start || {}).bounds||{};
    },
    endBound() {
      // let eBoundX = this.data.ePoint.x;
      // let eBoundY = this.data.ePoint.y;
      // if (this.end) {
      //   const eBound = this.end.bounds;
      //   eBoundX = eBound.x + eBound.width / 2;
      //   eBoundY = eBound.y + eBound.height / 2;
      // }
      // return{
      //   x:eBoundX,
      //   y:eBoundY
      // }
      return (this.end || {}).bounds||{};
    },
    path() {
      let res = [];
      if (this.data.freedom) {
        res = this.getFreeDomToNodePath();
      } else if (this.end) {
        res = this.getToNodePath();
      } else {
        res = this.getToPointPath();
      }
  
      return  res.map(p=>{
        return {
          x:p.x - this.edgeBounds.x,
          y:p.y - this.edgeBounds.y
        }
      });
    },
    ctrlLines() {
      const ctrlLines = [];
      const pathLength = this.path.length;
      this.path.forEach((item, index) => {
        if (index > 0 && index < pathLength - 2) {
          const nextItem = this.path[index + 1];
          ctrlLines.push({
            index,
            x1: item.x,
            y1: item.y,
            x2: nextItem.x,
            y2: nextItem.y,
          });
        }
      });
      return ctrlLines;
    },
    endPoint() {
      const eBounds = this.endBound;
      if (this.data.freedom) {
        return {
          ...this.data.ePoint,
        };
      }
      if (eBounds && !this.singleAnchor) {
        let x, y;
        switch (this.endPosition) {
          case "top":
            x = eBounds.x + parseInt(eBounds.width / 2) + 1;
            y = eBounds.y + 2;
            break;
          case "bottom":
            x = eBounds.x + parseInt(eBounds.width / 2) + 1;
            y = eBounds.y + eBounds.height + 2;
            break;
          case "left":
            x = eBounds.x + 1;
            y = eBounds.y + parseInt(eBounds.height / 2) + 2;
            break;
          case "right":
            x = eBounds.x + eBounds.width - 1;
            y = eBounds.y + parseInt(eBounds.height / 2) + 2;
            break;
          default:
            x = eBounds.x + parseInt(eBounds.width / 2) + 1;
            y = eBounds.y + 2;
            break;
        }
 
        return {
          x,
          y,
        };
      } else if (eBounds && this.singleAnchor) {
        let eBoundX = eBounds.x + eBounds.width / 2;
        let eBoundY = eBounds.y + eBounds.height / 2;
        return {
          x: eBoundX,
          y: eBoundY,
        };
      } else {
        return {
          ...this.data.ePoint,
        };
      }
    },
    startPoint() {
      const sBounds = this.startBound;
      if (this.data.freedom) {
        return {
          ...this.data.sPoint,
        };
      }
      if (sBounds && !this.singleAnchor) {
        let sizeHorizontal = parseInt(sBounds.width / 2),
          sizeVertical = parseInt(sBounds.height / 2),
          x,
          y;

        switch (this.startPosition) {
          case "top":
            x = sBounds.x + sizeHorizontal;
            y = sBounds.y + 10;
            break;
          case "bottom":
            x = sBounds.x + sizeHorizontal;
            y = sBounds.y + sBounds.height + 10;
            break;
          case "left":
            x = sBounds.x + 1;
            y = sBounds.y + sizeVertical;
            break;
          case "right":
            x = sBounds.x + sBounds.width - 1;
            y = sBounds.y + sizeVertical;
            break;
          default:
            x = sBounds.x + sizeHorizontal;
            y = sBounds.y + sBounds.height + 10;
            break;
        }
     
        return {
          x,
          y,
        };
      } else if (sBounds && this.singleAnchor) {
        let sBoundX = sBounds.x + sBounds.width / 2;
        let sBoundY = sBounds.y + sBounds.height / 2;
        return {
          x: sBoundX,
          y: sBoundY,
        };
      } else {
        return {
          ...this.data.sPoint,
        };
      }
    },
    endPosition() {
      if (this.data.freedom) {
        return this.getEndPosition();
      } else {
        return (this.data && this.data.endPosition) || "top";
      }
    },
    startPosition() {
      if (this.data.freedom) {
        return this.getStartPosition();
      } else {
        return this.data.position || "bottom";
      }
    },
  },
  methods: {
    getTools(){
      if(this.data._id){
        if(["COMPOSITION","AGGREGATION"].includes(this.data.lineType)){
          return ["COMPOSITION", "AGGREGATION"]
        }else{
          return []
        }
      }else{
         return ["ASSOCIATION","GENERALIZATION", "COMPOSITION", "AGGREGATION"]
      }
    },
    getToolLocal(){
      let x, y;
      if (this.path.length === 2) {
        x = this.path[0].x;
        y = this.path[0].y + (this.path[1].y - this.path[0].y) / 2;
      } else if (this.path.length === 4) {
        x = this.path[1].x + (this.path[2].x - this.path[1].x) / 2;
        y = this.path[1].y;
      } else if (this.path.length === 6) {
        x = this.path[2].x;
        y = this.path[2].y + (this.path[3].y - this.path[2].y) / 2;
      }else if (this.path.length === 5) {
        x = this.path[1].x + (this.path[2].x - this.path[1].x) / 2;
        y = this.path[1].y;
      } else if (this.path.length === 7) {
        x = this.path[2].x;
        y = this.path[2].y + (this.path[3].y - this.path[2].y) / 2;
      }
      return {
        x,
        y
      }
    },
    lineFactory() {
      const ctx = this.$ctx;
      let data = this.data;
      const that = this;

      ctx.strokeStyle =  "#7F8C93";
      ctx.lineWidth = 1;

      return {
          //自由折线，带箭头
        flipLineC: () => {
          that.drawShape();
          that.drawTextOnLine();
        },
        //自由折线，带箭头
        umlAssociation: () => {
          that.drawAssociationShape();
          that.drawTextOnLine();
        },
        //自由折线，无箭头
        freeFlipLine: () => {
          that.drawFreeShape();
          that.drawTextOnLine();
        },
        // uml折线，继承带空心箭头
        umlInheritLine: () => {
          that.drawUpArrowInherit();
          that.drawTextOnLine();
        },
           // uml折线， 组合COMPOSITION
        umlComposition: () => {
            that.drawComposition();
            that.drawTextOnLine();
        },
        // uml折线， 聚合
        umlAggergation: () => {
          that.drawAggregation();
          that.drawTextOnLine();
        },
        // uml折线， 依赖
        umlApplation:() => {
          that.drawApplation();
          that.drawTextOnLine();
        }
      };
    },
    drawTextOnLine() {
      const ctx = this.$ctx;
      // 线段起始点
      let sBoundX = this.startPoint.x;
      let sBoundY = this.startPoint.y;
      //终点
      let eBoundX = this.endPoint.x;
      let eBoundY = this.endPoint.y;

      if (this.data && this.data.text) {
        ctx.fillStyle = this.data.textColor || "#96A9B4";
        ctx.font = "15px arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (this.data.textStyle) {
          for (const key in this.data.textStyle) {
            if (Object.hasOwnProperty.call(this.data.textStyle, key)) {
              ctx[key] = this.data.textStyle[key];
            }
          }
        }
        const middle = {
          x: (sBoundX + eBoundX) / 2,
          y: (sBoundY + eBoundY) / 2,
        };

        let x, y;
        if (this.path.length === 2) {
          x = this.path[0].x;
          y = this.path[0].y + (this.path[1].y - this.path[0].y) / 2;
        } else if (this.path.length === 4) {
          x = this.path[1].x + (this.path[2].x - this.path[1].x) / 2;
          y = this.path[1].y;
        } else if (this.path.length === 6) {
          x = this.path[2].x;
          y = this.path[2].y + (this.path[3].y - this.path[2].y) / 2;
        }

        ctx.fillText(this.data.text, x, y - 10);
      }
    },
    drawUpArrow() {
      let ctx = this.$ctx;
      // 绘制连线
      this.createLinePath();
      ctx.strokeStyle = "#333";
      ctx.lineWidth =  2;
      ctx.stroke();
      // 绘制箭头
      this.createArrowPath(true);
      ctx.fillStyle = "#333";
      ctx.fill();
    },
    // 画继承
    drawUpArrowInherit(){
      let ctx = this.$ctx;
      // 绘制连线
      this.createLinePath();
      ctx.strokeStyle = "#7F8C93";
      ctx.lineWidth =  2;
      ctx.stroke();
      // 绘制箭头
      this.createArrowPath();
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.strokeStyle = "#7F8C93";
      ctx.stroke();
    },
    //组合 实心菱形
    drawComposition(){
      let ctx = this.$ctx;
      // 绘制连线
      this.createLinePath();
      ctx.strokeStyle = "#7F8C93";
      ctx.lineWidth = 2;
      ctx.stroke();
      // 绘制菱形
      this.createRhomusPath();
      ctx.fillStyle = '#7F8C93';
      ctx.fill();
      ctx.strokeStyle = "#7F8C93";
      ctx.stroke();
    },
    // 画聚合 空心菱形
    drawAggregation(){
      let ctx = this.$ctx;
      // 绘制连线
      this.createLinePath();
      ctx.strokeStyle = "#7F8C93";
      ctx.lineWidth = 2;
      ctx.stroke();
      // 绘制菱形
      this.createRhomusPath();
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.strokeStyle = "#7F8C93";
      ctx.stroke();
    },  
    // 画依赖
    drawApplation(){
      let ctx = this.$ctx;
      // 绘制连线
      this.createLinePath();
      ctx.setLineDash([5,10]);
      ctx.strokeStyle = "#333";
      ctx.lineWidth =  2;
      ctx.stroke();
      // 绘制箭头
      this.createArrowPath(true);
      ctx.fillStyle = "#333";
      ctx.fill();
    },
    //画关联
    drawAssociationShape() {
      let ctx = this.$ctx;
      // 绘制连线
      this.createLinePath();
      ctx.strokeStyle = "#7F8C93";
      ctx.lineWidth =  2;
      ctx.stroke();

      // 绘制箭头
      this.createLineArrowPath();
 
    },
    drawShape() {
      let ctx = this.$ctx;
      // 绘制连线
      this.createLinePath();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = this.lineWidth ? Number(this.lineWidth) : 2;
      ctx.stroke();
      if (this.data.hasOwnProperty("needArrow") && !this.data.needArrow) {
        return;
      }
      // 绘制箭头
      this.createArrowPath();
      ctx.fillStyle = "#333";
      ctx.fill();
    },
    //绘制线框箭头
    drawLineArrow(fromX, fromY, toX, toY,theta,headlen,dir) {
      let ctx = this.$ctx;
 
      theta = typeof(theta) != 'undefined' ? theta : 30;
      headlen = typeof(theta) != 'undefined' ? headlen : 10;
      let width =  2;
      let color = '#7F8C93';
   
      // 计算各角度和对应的P2,P3坐标
      var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
          angle1 = (angle + theta) * Math.PI / 180,
          angle2 = (angle - theta) * Math.PI / 180,
          topX = headlen * Math.cos(angle1),
          topY = headlen * Math.sin(angle1),
          botX = headlen * Math.cos(angle2),
          botY = headlen * Math.sin(angle2);
   
      ctx.save();
      ctx.beginPath();
   
      var arrowX = fromX - topX,
          arrowY = fromY - topY;
   
      ctx.moveTo(arrowX, arrowY);
      switch(dir){
        case 'down':
          fromY = fromY+3;
          break;
        case 'up':
          fromY = fromY-3;
          break;
        case 'left':
          fromX = fromX-3;
          break;
        case 'right':
          fromX = fromX+3;
          break;
      }
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      arrowX = toX + topX;
      arrowY = toY + topY;
      ctx.moveTo(arrowX, arrowY);

      ctx.lineTo(toX, toY);
      arrowX = toX + botX;
      arrowY = toY + botY;
      ctx.lineTo(arrowX,arrowY);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
      ctx.restore();
  },
    drawFreeShape() {
      let ctx = this.$ctx;
      // 绘制连线
      this.createLinePath();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.stroke();
    },
    createArrowPath(isStart) {
      // 创建箭头路径
      let ctx = this.$ctx,
        path = this.path;
      if (!path || path < 2) {
        return;
      }

      ctx.beginPath();
      let temp1 = isStart ? path[1] : path[path.length - 2],
        x1 = temp1.x,
        y1 = temp1.y,
        temp2 = isStart ? path[0] : path[path.length - 1],
        x2 = temp2.x,
        y2 = temp2.y;
      if (x2 == x1 && y2 > y1) {
        ctx.moveTo(x2 - 5, y2 - 13);
        ctx.lineTo(x2 + 5, y2 - 13);
        ctx.lineTo(x2, y2 - 3);
        ctx.closePath();
      } else if (x2 == x1 && y2 < y1) {
        ctx.moveTo(x2 - 5, y2 + 10);
        ctx.lineTo(x2 + 5, y2 + 10);
        ctx.lineTo(x2, y2 - 3);
        ctx.closePath();
      } else if (y2 == y1 && x2 > x1) {
        ctx.moveTo(x2 - 10, y2 + 5);
        ctx.lineTo(x2 - 10, y2 - 5);
        ctx.lineTo(x2 + 3, y2);
        ctx.closePath();
      } else if (y2 == y1 && x2 < x1) {
        ctx.moveTo(x2 + 10, y2 + 5);
        ctx.lineTo(x2 + 10, y2 - 5);
        ctx.lineTo(x2 - 3, y2);
        ctx.closePath();
      } else {
        ctx.moveTo(x2 - 5, y2 - 10);
        ctx.lineTo(x2 + 5, y2 - 10);
        ctx.lineTo(x2, y2 + 3);
        ctx.closePath();
      }
    },
    createLineArrowPath(isStart) {
      // 创建箭头路径
      let ctx = this.$ctx,
        path = this.path;
      if (!path || path < 2) {
        return;
      }

      let temp1 = isStart ? path[1] : path[path.length - 2],
        x1 = temp1.x,
        y1 = temp1.y,
        temp2 = isStart ? path[0] : path[path.length - 1],
        x2 = temp2.x,
        y2 = temp2.y;

          if (x2 == x1 && y2 > y1) { //down
            this.drawLineArrow(x1,y1,x2,y2 - 3,30,10,'down');
          } else if (x2 == x1 && y2 < y1) {//up
            this.drawLineArrow(x1,y1,x2,y2,30,10,'up');
          } else if (y2 == y1 && x2 > x1) {//right
            this.drawLineArrow(x1,y1,x2,y2,30,10,'right');
          } else if (y2 == y1 && x2 < x1) {//left
            this.drawLineArrow(x1,y1,x2,y2,30,10,'left');
          } else {
            this.drawLineArrow(x1,y1,x2,y2,30,10,'down');
          }
            
    },
    createRhomusPath(isStart){
      // 创建菱形路径
      let ctx = this.$ctx,
        path = this.path;
      if (!path || path < 2) {
        return;
      }

      ctx.beginPath();
      let temp1 = isStart ? path[1] : path[path.length - 2],
        x1 = temp1.x,
        y1 = temp1.y,
        temp2 = isStart ? path[0] : path[path.length - 1],
        x2 = temp2.x,
        y2 = temp2.y;
        let rotate = this.rotate;

        if(this.data.freeNodeLine){
           /**
           *  默认图标朝上，需要旋转的角度可以从getNodeFreeOutPosition方法中拿
           */
            if(rotate == 90){
              ctx.moveTo(x2, y2);
              ctx.lineTo(x2 +10, y2 -5);
              ctx.lineTo(x2 + 20, y2);
              ctx.lineTo(x2 +10, y2 +5)
            }else if( rotate == 180){
              ctx.moveTo(x2, y2 -2);
              ctx.lineTo(x2 + 5, y2 +8);
              ctx.lineTo(x2, y2 +16);
              ctx.lineTo(x2 -5, y2 +8)
            }else if( rotate == 270 ){
              ctx.moveTo(x2 + 10, y2);
              ctx.lineTo(x2, y2 -5);
              ctx.lineTo(x2 -10, y2);
              ctx.lineTo(x2, y2 + 5)
            }else{
              ctx.moveTo(x2, y2);
              ctx.lineTo(x2 -5, y2 + 10);
              ctx.lineTo(x2, y2 +20);
              ctx.lineTo(x2 + 5, y2 + 10)
            }
            ctx.closePath();
        }else{
          if (x2 == x1 && y2 > y1) {
            ctx.moveTo(x2 - 5, y2 - 10);
            ctx.lineTo(x2, y2 - 2)
            ctx.lineTo(x2 + 5, y2 - 10);
            ctx.lineTo(x2, y2 - 20)
            ctx.closePath();
          } else if (x2 == x1 && y2 < y1) {    
            ctx.moveTo(x2 - 5, y2 + 10);
            ctx.lineTo(x2, y2)
            ctx.lineTo(x2 + 5, y2 + 10);
            ctx.lineTo(x2, y2 + 20)
            ctx.closePath();
          } else if (y2 == y1 && x2 > x1) {    
            ctx.moveTo(x2 - 10, y2 + 5);
            ctx.lineTo(x2 - 10, y2 - 5);
            ctx.lineTo(x2 + 3, y2);
            ctx.lineTo(x2 - 3 , y2)
            ctx.closePath();
          } else if (y2 == y1 && x2 < x1) {    
            ctx.moveTo(x2 + 10, y2 + 5);
            ctx.lineTo(x2 + 10, y2 - 5);
            ctx.lineTo(x2 - 3, y2);
            ctx.lineTo(x2 + 3, y2)
            ctx.closePath();
          } else {    
            ctx.moveTo(x2 - 5, y2 - 10);
            ctx.lineTo(x2 + 5, y2 - 10);
            ctx.lineTo(x2, y2 + 3);
            ctx.lineTo(x2, y2 - 3)
            ctx.closePath();
          }
        }
     
      
    },
    createLinePath() {
      // 创建连线路径
      let ctx = this.$ctx,
        path = this.path;
      if (!path || path.length < 2) {
        return;
      }
      let start = path[0];
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      for (let i = 1, item; i < path.length; i++) {
        item = path[i];
        let x = item.x,
          y = item.y;
        let temp1 = path[i - 1];
        let x1 = temp1.x,
          y1 = temp1.y;
        let temp2 = path[i + 1];
        if (temp2) {
          let x2 = temp2.x,
            y2 = temp2.y;
          let radius = 6;
          if (x != x1 && Math.abs(x - x1) < 12) {
            radius = Math.abs(x - x1) / 2;
          } else if (y != y1 && Math.abs(y - y1) < 12) {
            radius = Math.abs(y - y1) / 2;
          } else if (x != x2 && Math.abs(x - x2) < 12) {
            radius = Math.abs(x - x2) / 2;
          } else if (y != y2 && Math.abs(y - y2) < 12) {
            radius = Math.abs(y - y2) / 2;
          }
          if (y > y1) {
            y - radius > y1 && ctx.lineTo(x, y - radius);
          } else if (y < y1) {
            y + radius < y1 && ctx.lineTo(x, y + radius);
          } else if (x > x1) {
            x - radius > x1 && ctx.lineTo(x - radius, y);
          } else if (x > x1) {
            x + radius < x1 && ctx.lineTo(x + radius, y);
          }
          ctx.arcTo(x, y, x2, y2, radius);
        } else {
          ctx.lineTo(x, y);
        }
      }
    },
    getStartPosition() {
      let pos = "bottom";
      const x1 = this.startPoint.x;
      const y1 = this.startPoint.y;

      if (this.start) {
        let p1Top2 = [{
          x: this.startBound.x,
          y: this.startBound.y,
        },
        {
          x: this.startBound.x + this.startBound.width,
          y: this.startBound.y,
        },
        ];
        let p1Top3 = [{
          x: this.startBound.x,
          y: this.startBound.y,
        },
        {
          x: this.startBound.x,
          y: this.startBound.y + this.startBound.height,
        },
        ];
        let p2Top4 = [{
          x: this.startBound.x + this.startBound.width,
          y: this.startBound.y,
        },
        {
          x: this.startBound.x + this.startBound.width,
          y: this.startBound.y + this.startBound.height,
        },
        ];
        let p3Top4 = [{
          x: this.startBound.x,
          y: this.startBound.y + this.startBound.height,
        },
        {
          x: this.startBound.x + this.startBound.width,
          y: this.startBound.y + this.startBound.height,
        },
        ];

        if (isPointInPath(x1, y1, p1Top3, 20)) {
          pos = "left";
        } else if (isPointInPath(x1, y1, p1Top2, 20)) {
          pos = "top";
        } else if (isPointInPath(x1, y1, p2Top4, 20)) {
          pos = "right";
        } else if (isPointInPath(x1, y1, p3Top4, 20)) {
          pos = "bottom";
        }
      }
      return pos;
    },
    getEndPosition() {
      let pos = "top";
      const x1 = this.endPoint.x;
      const y1 = this.endPoint.y;

      if (this.end) {
        let p1Top2 = [{
          x: this.endBound.x,
          y: this.endBound.y,
        },
        {
          x: this.endBound.x + this.endBound.width,
          y: this.endBound.y,
        },
        ];
        let p1Top3 = [{
          x: this.endBound.x,
          y: this.endBound.y,
        },
        {
          x: this.endBound.x,
          y: this.endBound.y + this.endBound.height,
        },
        ];
        let p2Top4 = [{
          x: this.endBound.x + this.endBound.width,
          y: this.endBound.y,
        },
        {
          x: this.endBound.x + this.endBound.width,
          y: this.endBound.y + this.endBound.height,
        },
        ];
        let p3Top4 = [{
          x: this.endBound.x,
          y: this.endBound.y + this.endBound.height,
        },
        {
          x: this.endBound.x + this.endBound.width,
          y: this.endBound.y + this.endBound.height,
        },
        ];

        if (isPointInPath(x1, y1, p1Top3, 20)) {
          pos = "left";
        } else if (isPointInPath(x1, y1, p1Top2, 20)) {
          pos = "top";
        } else if (isPointInPath(x1, y1, p2Top4, 20)) {
          pos = "right";
        } else if (isPointInPath(x1, y1, p3Top4, 20)) {
          pos = "bottom";
        }
      }
      return pos;
    },
    getFreeDomToNodePath() {
      const x2 = this.endPoint.x;
      const y2 = this.endPoint.y;
      const x1 = this.startPoint.x;
      const y1 = this.startPoint.y;
      const startPos = this.getStartPosition();
      const endPos = this.getEndPosition();
      let path = [{
        x: x1,
        y: y1,
      }];
   
      if (!this.data.straightLine) {
        if (y2 < y1 && x2 > x1) {
          //右上方
          let hm = Math.abs(y1 - y2) / 2;
          let vm = Math.abs(x2 - x1) / 2;
          if (startPos === "right" && endPos == "left") {
            path.push({
              x: x1 + vm,
              y: y1,
            });
            path.push({
              x: x1 + vm,
              y: y2,
            });
          } else if (startPos === "top" && endPos === "bottom") {
            path.push({
              x: x1,
              y: y1 - hm,
            });
            path.push({
              x: x2,
              y: y1 - hm,
            });
          } else if (startPos === "top" && endPos === "left") {
            path.push({
              x: x1,
              y: y2,
            });
          } else if (startPos === "right" && endPos == "right") {
            path.push({
              x: x2 + vm,
              y: y1,
            });
            path.push({
              x: x2 + vm,
              y: y2,
            });
          } else if (startPos === "right" && endPos == "top") {
            path.push({
              x: x1 + vm,
              y: y1,
            });
            path.push({
              x: x1 + vm,
              y: y2 - hm,
            });
            path.push({
              x: x2,
              y: y2 - hm,
            });
          }
        } else if (y2 < y1 && x2 < x1) {
          //左上方
          let hm = Math.abs(y1 - y2) / 2;
          let vm = Math.abs(x1 - x2) / 2;
          if (startPos === "top" && endPos == "right") {
            path.push({
              x: x1,
              y: y2,
            });
          } else if (startPos === "left" && endPos === "right") {
            path.push({
              x: x1 - vm,
              y: y1,
            });
            path.push({
              x: x1 - vm,
              y: y2,
            });
          } else if (startPos === "top" && endPos === "bottom") {
            path.push({
              x: x1,
              y: y1 - hm,
            });
            path.push({
              x: x2,
              y: y1 - hm,
            });
          } else if (startPos === "left" && endPos === "bottom") {
            path.push({
              x: x2,
              y: y1,
            });
          }
        } else if (y2 > y1 && x2 > x1) {
          //右下方
          let hm = Math.abs(y2 - y1) / 2;
          let vm = Math.abs(x2 - x1) / 2;
          if (startPos === "right" && endPos == "left") {
            path.push({
              x: x1 + vm,
              y: y1,
            });
            path.push({
              x: x1 + vm,
              y: y2,
            });
          } else if (startPos === "bottom" && endPos === "top") {
            path.push({
              x: x1,
              y: y1 + hm,
            });
            path.push({
              x: x2,
              y: y1 + hm,
            });
          } else if (startPos === "bottom" && endPos === "left") {
            path.push({
              x: x1,
              y: y2,
            });
          } else if (startPos === "right" && endPos == "top") {
            path.push({
              x: x2,
              y: y1,
            });
          }
        } else if (y2 > y1 && x2 < x1) {
          //左下方
          let hm = Math.abs(y2 - y1) / 2;
          let vm = Math.abs(x1 - x2) / 2;
          if (startPos === "bottom" && endPos === "top") {
            path.push({
              x: x1,
              y: y1 + hm,
            });
            path.push({
              x: x2,
              y: y1 + hm,
            });
          } else if (startPos === "left" && endPos === "top") {
            path.push({
              x: x2,
              y: y1,
            });
          } else if (startPos === "left" && endPos === "right") {
            path.push({
              x: x1 - vm,
              y: y1,
            });
            path.push({
              x: x1 - vm,
              y: y2,
            });
          } else if (startPos === "bottom" && endPos === "right") {
            path.push({
              x: x1,
              y: y2,
            });
          }
        }
      }

      path.push({
        x: x2,
        y: y2,
      });
      return path;
    },
    getToNodePath() {
      const x2 = this.endPoint.x;
      const y2 = this.endPoint.y;
      const ctrl1 = this.data.ctrl.ctrl1;
      const ctrl2 = this.data.ctrl.ctrl2;
      const ctrl3 = this.data.ctrl.ctrl3;
      const x1 = this.startPoint.x;
      const y1 = this.startPoint.y;
      let mx = (x1 + x2) / 2;
      let my = (y1 + y2) / 2;
      // 开始坐标
      let path = [{
        x: x1,
        y: y1,
      },];
      const pathPoint = this.getToPointPath();
      pathPoint.pop();
      const eBounds = this.endBound;
      let base = 10;
      let endPosition = this.endPosition;
      let startPosition = this.startPosition;
      if(this.data.freeNodeLine){
        endPosition = this.getNodeFreeOutPosition(null, null, true).end;
        startPosition = this.getNodeFreeOutPosition(null, null, true).start
      }
      if (this.data.customPosition && this.data.endPosition) {
        startPosition = this.data.endPosition;
      }
      if (this.data.customPosition && this.data.position) {
        endPosition = this.data.position;
      }
      // x/y-Margin-1/2
      let xM1 = x2 - base,
        xM2 = x2 + base,
        yM1 = y2 - base,
        yM2 = y2 + base;
      if (["left", "right"].includes(endPosition)) {
        yM1 -= parseInt(eBounds.height / 2);
        yM2 += parseInt(eBounds.height / 2);
      } else {
        xM1 -= parseInt(eBounds.width / 2);
        xM2 += parseInt(eBounds.width / 2);
      }
    
      switch (endPosition) {
        case "top":
          if (x1 == x2 && y2 > y1) {
            // 正下方
          } else if (y2 > y1 + 26) {
            if (["left", "right"].includes(startPosition)) {
              if (x1 > x2) {
                path.push({
                  x: xM2,
                  y: y1,
                });
                path.push({
                  x: xM2,
                  y: my,
                });
                path.push({
                  x: x2,
                  y: my,
                });
              } else {
                path.push({
                  x: xM1,
                  y: y1,
                });
                path.push({
                  x: xM1,
                  y: my,
                });
                path.push({
                  x: x2,
                  y: my,
                });
              }
            } else {
              // 下右左
              if (ctrl1 && ctrl1 >= y1 + 13 && ctrl1 <= y2 - 13) {
                my = ctrl1;
              }
              path.push({
                x: x1,
                y: my,
              });
              path.push({
                x: x2,
                y: my,
              });
            }
          } else {
            // 下右上右下
            const sBounds = this.startBound;
            const eBounds = this.endBound;
            if (sBounds && eBounds) {
              const left1 = sBounds.x;
              const right1 = sBounds.x + sBounds.width;
              const left2 = eBounds.x;
              const right2 = eBounds.x + eBounds.width;
              if (left1 > right2) {
                mx = (left1 + right2) / 2;
              } else if (right1 < left2) {
                mx = (right1 + left2) / 2;
              } else if (mx > left1 && mx < right1) {
                if (Math.abs(x1 - left1) > Math.abs(x1 - right1) - 5) {
                  mx = right1 + 10;
                } else {
                  mx = left1 - 10;
                }
              }
            }
            let bottom = y1 + 13;
            if (ctrl1 && ctrl1 > bottom) {
              bottom = ctrl1;
            }
            path.push({
              x: x1,
              y: bottom,
            });
            if (ctrl2) {
              mx = ctrl2;
            }
            path.push({
              x: mx,
              y: bottom,
            });
            let top = y2 - 13;
            if (ctrl3 && ctrl3 < top) {
              top = ctrl3;
            }
            path.push({
              x: mx,
              y: top,
            });
            path.push({
              x: x2,
              y: top,
            });
          }
          break;
        case "bottom":
          if (["top", "bottom"].includes(startPosition)) {
            if (pathPoint[1].y < yM2) {
              if (startPosition === "bottom" && (x1 > xM2 || x1 < xM1)) {
                pathPoint.pop();
                pathPoint[pathPoint.length - 1].y = yM2;
              } else {
                let x = x1 <= x2 ? xM1 : xM2;
                pathPoint[pathPoint.length - 1].x = x;
                pathPoint.push({
                  x,
                  y: yM2,
                });
              }
            }
          } else {
            pathPoint[pathPoint.length - 1].y = yM2;
            if (
              (startPosition === "right" && x1 < x2 && y1 > y2) ||
              (startPosition === "left" && x1 > x2 && y1 > y2)
            ) {
              pathPoint.pop();
              pathPoint[pathPoint.length - 1].x = x2;
            }
          }
          pathPoint.push({
            x: x2,
            y: yM2,
          });
          path = pathPoint;
          break;
        case "left":
          /**
           *      xM1,yM1
           *          。
           *          |   ————
           * xM1,y2   。——| x2,y2
           *          |   ————
           *          。
           *       xM1,yM2
           */
          if (["left", "right"].includes(startPosition)) {
            if (x1 > x2) {
              if (startPosition === "left") {
                pathPoint.pop();
                pathPoint[pathPoint.length - 1].x = xM1;
              } else {
                let y = y1 <= y2 ? yM1 : yM2;
                pathPoint[pathPoint.length - 1].y = y;
                pathPoint.push({
                  x: xM1,
                  y,
                });
              }
            }
          } else {
            pathPoint[pathPoint.length - 1].x = xM1;
            if (
              (startPosition === "top" && x1 < x2 && y1 > y2) ||
              (startPosition === "bottom" && x1 < x2 && y1 < y2)
            ) {
              pathPoint.pop();
              pathPoint[pathPoint.length - 1].y = y2;
            }
          }
          pathPoint.push({
            x: xM1,
            y: y2,
          });
          path = pathPoint;
          break;
        case "right":
          if (["left", "right"].includes(startPosition)) {
            if (x1 < x2) {
              if (startPosition === "right") {
                pathPoint.pop();
                pathPoint[pathPoint.length - 1].x = xM2;
              } else {
                let y = y1 <= y2 ? yM1 : yM2;
                pathPoint[pathPoint.length - 1].y = y;
                pathPoint.push({
                  x: xM2,
                  y,
                });
              }
            }
          } else {
            pathPoint[pathPoint.length - 1].x = xM2;
            if (
              (startPosition === "top" && x1 > x2 && y1 > y2) ||
              (startPosition === "bottom" && x1 > x2 && y1 < y2)
            ) {
              pathPoint.pop();
              pathPoint[pathPoint.length - 1].y = y2;
            }
            // pathPoint.push({ x: xM2, y: y1 < y2 ? yM1 : yM2 })
          }
          pathPoint.push({
            x: xM2,
            y: y2,
          });
          path = pathPoint;
          break;
        default:
          break;
      }
      path.push({
        x: x2,
        y: y2,
      });
      return path;
    },
    // 获取到节点路径
    getToPointPath() {
      const x2 = this.endPoint.x;
      const y2 = this.endPoint.y;
      const x1 = this.startPoint.x;
      const y1 = this.startPoint.y;
      const sBounds = this.startBound;

      const path = [{
        x: x1,
        y: y1,
      },];
      const base = 10;
      let P1, P2, P3, P4, median;
      let startPosition = this.startPosition;
      if(this.data.freeNodeLine){
        startPosition = this.getNodeFreeOutPosition(null, null, true).start
      }
      if (this.data.customPosition && this.data.endPosition) {
        startPosition = this.data.endPosition;
      }
      switch (startPosition) {
        case "right":
          median = sBounds.y + parseInt(sBounds.height / 2);
          P1 = {
            x: x1 + base,
            y: y1,
          };
          P2 = {
            x: P1.x,
            y: y2 <= median ?
              sBounds.y - base : sBounds.y + sBounds.height + base,
          };
          P3 = {
            x: x2 < x1 ?
              Math.min(parseInt((x1 + x2) / 2), sBounds.x - base) : parseInt((x1 + x2) / 2),
            y: P2.y,
          };
          P4 = {
            x: P3.x,
            y: y2,
          };
          path.push(P1);
          if (P3.x > P1.x) {
            path.push({
              x: P3.x,
              y: y1,
            });
            path.push({
              x: P3.x,
              y: y2,
            });
          } else if (
            y2 > sBounds.y - base &&
            y2 < sBounds.y + sBounds.height + base &&
            x2 < x1
          ) {
            path.push(P2);
            if (x2 < sBounds.x) {
              path.push(P3);
              path.push(P4);
            } else {
              path.push({
                x: x2,
                y: P2.y,
              });
            }
          } else {
            path.push({
              x: P1.x,
              y: y2,
            });
          }
          break;
        case "left":
          /**
           *         p2————————————p3
           *         |              |
           *         |  ——————————  |
           *median-  p1-|_________| p4 ————>
           * */
          median = sBounds.y + parseInt(sBounds.height / 2);
          P1 = {
            x: x1 - base,
            y: y1,
          };
          P2 = {
            x: P1.x,
            y: y2 <= median ?
              sBounds.y - base : sBounds.y + sBounds.height + base,
          };
          P3 = {
            x: x2 > x1 ?
              Math.max(
                parseInt((x1 + x2) / 2),
                sBounds.x + sBounds.width + base
              ) : parseInt((x1 + x2) / 2),
            y: P2.y,
          };
          P4 = {
            x: P3.x,
            y: y2,
          };
          path.push(P1);
          if (P3.x < P1.x) {
            path.push({
              x: P3.x,
              y: y1,
            });
            path.push({
              x: P3.x,
              y: y2,
            });
          } else if (
            y2 > sBounds.y - base &&
            y2 < sBounds.y + sBounds.height + base &&
            x2 > x1
          ) {
            // P2 && $x
            path.push(P2);
            if (x2 > sBounds.x + sBounds.width) {
              path.push(P3);
              path.push(P4);
            } else {
              path.push({
                x: x2,
                y: P2.y,
              });
            }
          } else {
            path.push({
              x: P1.x,
              y: y2,
            });
          }

          break;
        case "top":
          median = sBounds.x + sBounds.width / 2;
          P1 = {
            x: x1,
            y: y1 - base,
          };
          P2 = {
            x: x2 <= median ?
              sBounds.x - base : sBounds.x + sBounds.width + base,
            y: P1.y,
          };
          P3 = {
            x: P2.x,
            y: y2 > y1 ?
              Math.max(
                parseInt((y1 + y2) / 2),
                sBounds.y + sBounds.height + base
              ) : parseInt((y1 + y2) / 2),
          };
          P4 = {
            x: x2,
            y: P3.y,
          };
          path.push(P1);
          if (P3.y < P1.y) {
            path.push({
              x: x1,
              y: P3.y,
            });
            path.push({
              x: x2,
              y: P3.y,
            });
          } else if (
            x2 > sBounds.x - base &&
            x2 < sBounds.x + sBounds.width + base &&
            y2 > y1
          ) {
            // P2 && $x
            path.push(P2);
            if (y2 > sBounds.y + sBounds.height) {
              path.push(P3);
              path.push(P4);
            } else {
              path.push({
                x: P2.x,
                y: y2,
              });
            }
          } else {
            path.push({
              x: x2,
              y: P1.y,
            });
          }
          break;
        case "bottom":
          median = sBounds.x + parseInt(sBounds.width / 2);
          P1 = {
            x: x1,
            y: y1 + base,
          };
          P2 = {
            x: (x2 != x1 ? (x2 <= median ?
              sBounds.x - base : sBounds.x + sBounds.width + base) : x1),
            y: P1.y,
          };
          P3 = {
            x: P2.x,
            y: y2 < y1 ?
              Math.min(parseInt((y1 + y2) / 2), sBounds.y - base) : parseInt((y1 + y2) / 2),
          };
          P4 = {
            x: x2,
            y: P3.y,
          };
          path.push(P1);
          if (P3.y > P1.y) {
            path.push({
              x: x1,
              y: P3.y,
            });
            path.push({
              x: x2,
              y: P3.y,
            });
          } else if (
            x2 > sBounds.x - base &&
            x2 < sBounds.x + sBounds.width + base &&
            y2 < y1
          ) {
            // P2 && $x
            path.push(P2);
            if (y2 < sBounds.y) {
              path.push(P3);
              path.push(P4);
            } else {
              path.push({
                x: P2.x,
                y: y2,
              });
            }
          } else {
            path.push({
              x: x2,
              y: P1.y,
            });
          }
          break;
        default:
          break;
      }
      

      path.push({
        x: x2,
        y: y2,
      });
      return path;
    },
    drawSelectedShape() {
      // 绘画选中效果图形
      let ctx = this.$ctx,
        data = this.data;
      if (data.doubleArrow) {
        this.createArrowPath(true);
        ctx.fillStyle = this.data.color ? this.data.color : "#000";
        ctx.fill();
      }

      this.createLinePath();

      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(138, 209, 255, 0.3)";
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#7F8C93";
      ctx.stroke();
    },
    dragstart(e) {
      if (this.$root.readonly) {
        return;
      }
      if (e.comp.data.x1 === e.comp.data.x2) {
        this.originCtrl = e.comp.data.x1 || e.x;
      } else {
        this.originCtrl = e.comp.data.y1 || e.y;
      }
    },
    drag(e) {
      if (this.$root.readonly) {
        return;
      }
      let newCtrl;
      const originCtrl = this.originCtrl;
      if (e.comp.data.x1 === e.comp.data.x2) {
        newCtrl = originCtrl + e.dx;
      } else {
        newCtrl = originCtrl + e.dy;
        const startY = this.path[0].y;
        const endY = this.path[this.path.length - 1].y;
        // 不能超过极限
        if (originCtrl > startY && newCtrl < startY + 13) {
          newCtrl = startY + 13;
        }
        if (originCtrl > endY && newCtrl < endY - 13) {
          newCtrl = endY - 13;
        }
      }
      this.data.ctrl[`ctrl${e.comp.data.index}`] = newCtrl;
    },
    getNodeFreeOutPosition(type = 'start', PIE = false, position = null){
      /**
       *  告诉函数是要起点的位置还是结点的位置，默认是起点，  待优化，目前问题有：未设置偏差值（出入口不是特别准确），没有绕过其他元素（会出现线条穿模的情况），未加起始点的图标旋转逻辑(起点目前没有图标,只有双向合并情况才会出现)
       *  type是告知需要的是起点的计算坐标还是结尾的计算坐标(非必传，默认是起点)，如若传入只返回角度
       *  position是告知出入口的位置
       *  PIE是给需要旋转的图标用的，通过计算起始点的位置和结束点的位置进行比较，得出需要旋转的角度(非必传)，可用于画图图标处旋转使用
       */
      let x1 = this.startBound.x,
          y1 = this.startBound.y,
          x2 = this.endBound.x,
          y2 = this.endBound.y;
      let path = {
            x: '',
            y: ''
          };
      if(y1 > y2 && (Math.abs((y1 - y2)) > Math.abs(x1 - x2)) ){
        // y的距离大于x的距离差 (起始的底中，结尾的上中)
        if(position){
          return {
            start: 'bottom',
            end: 'top'
          }
        }
        if(type == 'start'){
          path.x =  x1 + this.startBound.width / 2;
          path.y = y1 + 10
        }else if(type == 'end') {
          path.x = x2 + this.endBound.width / 2
          path.y = y2 + this.endBound.height
          if(PIE){
            return 0
          }
        }
      }else if(y1 < y2 && (Math.abs(y2 - y1) > Math.abs(x1 -x2))){
        // y的距离负差大于x的距离差 (起始的上中，结尾的底中)
        if(position){
          return {
            start: 'top',
            end: 'bottom'
          }
        }
        if(type == 'start'){
          path.x =  x1 + this.startBound.width / 2;
          path.y = y1 + this.startBound.height 
        }else if(type == 'end'){
          path.x = x2 + this.endBound.width / 2
          path.y = y2 -20
          if(PIE){
            return 180
          }
        }
      }else {
        // y的距离差距小于等于x的距离差 从左右两边出，结尾依靠y轴的比较位置
        // 右边出 
        if(x1 < x2){
          if(position){
            return {
              start: 'left',
              end: 'right'
            }
          }

          if(type == 'start'){
            path.x =  x1 + this.startBound.width + 10;
            path.y = y1 + this.startBound.height / 2
          }else if(type == 'end'){
            path.x =  x2 - 10
            path.y =  y2 + this.endBound.height / 2
            if(PIE){
              return 90
            }
          }
        }else{
          // 左边出 
          if(position){
            return {
              start: 'right',
              end: 'left'
            }
          }
          if(type == 'start'){
            path.x =  x1 +10;
            path.y = y1 + this.startBound.height / 2
          }else if(type == 'end'){
            path.x = x2 + this.endBound.width +20
            path.y = y2 + this.endBound.height / 2 
            if(PIE){
              return 270
            }
          }
        }
      }
      return path
    },
    /**
     * 获取自定义点位坐标
     * @param {*} type start开始，end结束
     * @param {*} position 方向，top，bottom，left，right
     * @param {*} PIE 角度，0, 90, 180, 270
     */
    getCustomPosition(type, position, PIE) {
      let x1 = this.startBound.x;
      let y1 = this.startBound.y;
      let x2 = this.endBound.x;
      let y2 = this.endBound.y;
      let point = {
        x: 0,
        y: 0
      };
      switch (position) {
        case 'top':
          if (type === 'start') {
            point.x = x1 + this.startBound.width / 2;
            point.y = y1;
          } else {
            point.x = x2 + this.endBound.width / 2;
            point.y = y2;
            this.rotate = 180;
          }
          break;
        case 'bottom':
          if (type === 'start') {
            point.x = x1 + this.startBound.width / 2;
            point.y = y1 + this.startBound.height;
          } else {
            point.x = x2 + this.endBound.width / 2;
            point.y = y2 + this.endBound.height + 2;
            this.rotate = 0;
          }
          break;
        case 'left':
          if (type === 'start') {
            point.x = x1 + 10;
            point.y = y1 + this.startBound.height / 2;
          } else {
            point.x = x2 - 5;
            point.y = y2 + this.endBound.height / 2;
            this.rotate = 90;
          }
          break;
        case 'right':
          if (type === 'start') {
            point.x = x1 + this.startBound.width + 10;
            point.y = y1 + this.startBound.height / 2;
          } else {
            point.x = x2 + this.endBound.width + 18;
            point.y = y2 + this.endBound.height / 2;
            this.rotate = 270;
          }
          break;
        default:
          break;
      }
      return point;
    }
  },
  draw() {
    let ctx = this.$ctx;
    const that = this;
    if (this.data.doubleArrow) {
      this.createArrowPath(true);
      ctx.fillStyle = this.data.color ? this.data.color : "#000";
      ctx.fill();
    }
    let factory = this.lineFactory();
    if(factory){
      // console.log('this.data.lineType',this.data.lineType);
      factory[LineMap[this.data.lineType]]();
    }
    

    this.isSelected && this.drawSelectedShape();

    this.toolLocal = this.getToolLocal();

    this.tools = this.getTools();

    this.off("delete_self");
    this.on("delete_self",()=>{
        //  deleteLineApi(that.data._id).then(()=>{
        //       //暂时交给画布删
              
        //  }).catch(e=>console.log('删除失败',e))
    })
    this.off("text_change");
    this.on("text_change",(val)=>{
        //  console.log('值变化',val);
         const canvasId = IDE.editorPart?.$store?.getters["domainObjectConfig/getCurCanvasId"]; 
         let params = {
          canvasId:canvasId,
          id:this.data._id,
          "remark": val
      }
      // editLineApi(params).then(r=>{
       
      // }).catch(e=>console.log(e))
    })
  },
};