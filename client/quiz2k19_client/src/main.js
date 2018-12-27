import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueSocketIO from 'vue-socket.io';

Vue.config.productionTip = false

Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://localhost:3000'//localhost:3000
}))

const sharedData = {
  questions: []
}

new Vue({
  render: h => h(App),
  router,
  data: {
    sharedData
  }
}).$mount('#app')
