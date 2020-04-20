// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css'
import './assets/styles/atom-one-dark.css'
import './assets/styles/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.directive('highlight', function (el) {
  let blocks = el.querySelectorAll('code')
  blocks.forEach((block) => {
    window.hljs.highlightBlock(block)
  })
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
