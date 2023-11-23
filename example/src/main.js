import Vue from 'vue';
import elementui from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue';
// import MdVue from './mdVue';
window.Vue = Vue;
// import './superDocPlugins/layout/index.js';
// import './superDocPlugins/tools/index.js';
import './superDocPlugins/layout/index.js';
// import './superDocPlugins/block/index.js';
Vue.config.productionTip = false
Vue.use(elementui);
// Vue.use(MdVue);
new Vue({
  render: function (h) { return h(App) },
}).$mount('#app')

// import './superDocPlugins/layout/index.js';
// import './superDocPlugins/tools/index.js';
// import './superDocPlugins/layout/index.js';
// import './superDocPlugins/block/index.js';
// import SuperComp from '/Users/yixin/Desktop/自己的项目/supperDoc/packages/vue-project/src/components/HelloWorld.vue';
// export default SuperComp;
