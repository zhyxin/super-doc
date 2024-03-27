import { Plugin } from "@super-doc/api";
import _Image from '../../components/image.vue';


export default class ImageDoc extends Plugin.BlockBase {
    config = null;
    platform = "vue";
    constructor(options) {
      super(options);
      if (!options) return;
      const { config, ...other } = options;
      this.config = config;
      
      this.editor = false;
    }
  
    render() {
      return _Image;
    }

    copyEventCallBack(context,event,blockInstance){
      console.log('copy')
    }

    selectionCallBack(context,event,copyDom, blockInstance){
      console.log(`【superDoc】: 执行选中回调_img`);
      // let manager = context.Event["Editor"].BlockManager
      // let text = copyDom.querySelector("#superdoc-paragraph").innerHTML
      // let headObject = generateHeadData(blockInstance.data.level)
      // headObject.data.text = text;
      // manager.currentSelectionBlockInfo.data.push(headObject)
    }

}