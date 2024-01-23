import { Plugin } from '../../../../packages/api/dist/api.esm-bundler.js';
import _Auae from '../../components/auae/index.vue';
// import _Auae from '../../components/auae/testMount.vue';

export class Auae extends Plugin.BlockBase {
  config = null;
  contentEditable = 'true';
  platform = "vue";
  constructor(options) {
    super(options);
    const { config, ...other } = options;
    this.config = config;
  }

  render() {
    return _Auae;
  }
}

window.Auae = Auae;