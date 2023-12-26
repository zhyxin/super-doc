import { Plugin } from "@super-doc/api";
import _Table from "../../components/table.vue";

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
}
