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
}