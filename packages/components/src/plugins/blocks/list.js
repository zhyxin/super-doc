import { Plugin } from "@super-doc/api";
import _List from '../../components/list/index.vue';

export default class ListDoc extends Plugin.BlockBase {
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
    return _List;
  }
}
