import {editMixin} from "@auae/core"
let imgItem = new Image();
imgItem.src = require('../assets/huanguang.png');

export default {
    name: 'uml-root-tag',
    props: ["tx", "ty"],
    mixins: [editMixin],
    data() {
        return {
   
        };
    },
    config: {
        x: um => um.tx,
        y: um => um.ty,
        width: 40,
        height: 24,
        zIndex: 996,
        offsetX: 0,
        offsetY: 0,
        show: um =>um.$parent.data.aggregateRoot===true
    },
    draw() {

        let ctx = this.$ctx;
   
            ctx.fillStyle = "#FFEFD9";
            ctx.strokeStyle = "#FFB780";
            ctx.roundRect(1, 1, 38, 20, 11);
            ctx.fill();
            ctx.stroke();
            ctx.drawImage(imgItem, 5, 3, 14, 14)
            ctx.font = '12px bold';
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillStyle = "#FFB780";
            ctx.fillText("根", 27, 10);

    }
 

};