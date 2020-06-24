import Vue from 'vue'
import App from './App'

import apiConfig from '@/common/api-configer.js'
import appChecker from '@/common/app-checker.js'

const showToast = (title, duration = 1800, mask = false, icon = 'none') => {
	//统一提示方便全局修改
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

Vue.config.productionTip = false

Vue.prototype.$api = apiConfig;
Vue.prototype.$app = appChecker;
Vue.prototype.$msg = {showToast};

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
