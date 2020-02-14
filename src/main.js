import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import Home from './components/Home.vue'
import Admin from './components/Admin.vue'

Vue.use(VueResource);
Vue.use(VueRouter);

const routes = [
  { path: '/', component: Home, props: {msg: 'Age pension calculator'} },
  { path: '/admin', component: Admin },
]

const router = new VueRouter({
  mode: 'history',
  routes: routes
})

Vue.config.productionTip = false

new Vue({
  router: router,
  render: h => h(App),
}).$mount('#app')
