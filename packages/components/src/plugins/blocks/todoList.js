import { Plugin } from "@super-doc/api";
import _TodoList from "../../components/todoList/index.vue";

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
    return _TodoList;
  }
}
