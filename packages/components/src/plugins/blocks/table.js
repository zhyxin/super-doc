import { Plugin } from "@super-doc/api";
import _Table from "../../components/table/index.vue";
import * as _ from '@super-doc/share';

export default class TableDoc extends Plugin.BlockBase {
  config = null;
  platform = "vue";
  constructor(options) {
    super(options);
    if (!options) return;
    const { config, ...other } = options;
    this.config = config;

    this.editor = true;
  }

  render() {
    return _Table;
  }
  copyEventCallBack(context,event, blockInstance){
    console.log('copy')
  }
  cutEventCallBack(context,event,cutData, blockInstance){}

  compileData(blockInstance,text){
    return []
  }
}
