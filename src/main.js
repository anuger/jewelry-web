import Vue from 'vue';
import App from './App';
import '@/style/base.css'
import antDesign from "@/config/antDesign";
import {router} from '@/config/router.js'
import '@/config/customerComponent'
import '@/config/moment'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'

Vue.use(Viewer)
Vue.use(antDesign);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');