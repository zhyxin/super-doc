import { Plugin } from "@super-doc/api";
import _Paragraph from '../../components/paragraph.vue';

export default class Paragraph extends Plugin.BlockBase {
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
    return _Paragraph;
  }
}
