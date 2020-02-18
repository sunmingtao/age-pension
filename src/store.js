import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {router} from './main'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      idToken: null,
      userId: null,
      userEmail: null,
      user: null,
    },
    mutations: {
      authUser (state, userData) {
        state.idToken = userData.token
        state.userId = userData.userId
        state.userEmail = userData.userEmail
      },
      clearAuth (state) {
        state.idToken = null
        state.userId = null
        state.userEmail = null 
      }
    },
    actions: {
      login ({commit}, authData) {
        axios.post('/accounts:signInWithPassword?key=AIzaSyCPGoCW9sD05P6NrxhxPpzgxGvldo0HvvQ', {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true
        }).then(res => {
          console.log(res)
          commit('authUser', {
            token: res.data.idToken,
            userId: res.data.localId,
            userEmail: res.data.email,
          })
          const now = new Date();
          const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000);
          localStorage.setItem("expirationDate", expirationDate);
          localStorage.setItem("idToken", res.data.idToken);
          localStorage.setItem("userId", res.data.localId);
          localStorage.setItem("userEmail", res.data.email);
          router.replace('/admin');
        }).catch(error => {
            console.log("error" +error);
            alert('Invalid username or password');
        });
      },  
      logout ({commit}){
        commit('clearAuth');
        localStorage.removeItem('expirationDate');
        localStorage.removeItem('idToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        router.replace('/');
      },
      autoLogout ({commit}) {
        const now = new Date();
        if (now >= localStorage.getItem('expirationDate')){
            return;
        }else{
            commit('authUser', {
                token: localStorage.getItem('idToken'),
                userId: localStorage.getItem('localId'),
                userEmail: localStorage.getItem('userEmail')
            })
        }
      }
    },
})