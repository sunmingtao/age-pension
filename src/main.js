import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import Home from './components/Home.vue'
import Admin from './components/Admin.vue'
import Login from './components/Login.vue'
import store from './store'
import axios from 'axios'



Vue.use(VueResource);
Vue.use(VueRouter);
Vue.http.options.root = "https://age-pension.firebaseio.com/refData.json"
axios.defaults.baseURL = 'https://identitytoolkit.googleapis.com/v1'

const routes = [
  { path: '/', component: Home, props: {msg: 'Age pension calculator'} },
  { 
    path: '/admin', 
    component: Admin,  
    beforeEnter (to, from, next) {
      if (store.state.idToken) {
        next()
      } else {
        next('/login')
      }
    }
  },
  { path: '/login', component: Login },
]

export const router = new VueRouter({
  mode: 'history',
  routes: routes
})

Vue.config.productionTip = false

new Vue({
  router: router,
  store: store, //so that it's available globally by using this.$store
  render: h => h(App),
}).$mount('#app')
