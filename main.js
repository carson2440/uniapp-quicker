import Vue from 'vue'
import App from './App'

//全局自定义标题栏
import titleView from './components/custom-title-view/title-view.vue'
Vue.component('title-view',titleView)

//定义网络访问
import appHttps from '@/common/app-https.js'
//定义工具类
import appUtils from '@/common/app-utils.js'

Vue.prototype.$http = appHttps;
Vue.prototype.$utils = appUtils;

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
