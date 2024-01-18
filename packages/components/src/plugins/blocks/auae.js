import { Plugin } from "@super-doc/api";
import _AUAE from '../../components/auae/index.vue';


export default class AI extends Plugin.BlockBase {
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
      return _AUAE;
    }
}