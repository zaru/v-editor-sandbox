import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import ContentEditablePage from './components/ContentEditablePage'
import ContentEditableVerticalPage from './components/ContentEditableVerticalPage'

Vue.use(VueRouter)

Vue.config.productionTip = false

const routes = [
  { path: '/contenteditable', component: ContentEditablePage },
  { path: '/contenteditable/vertical', component: ContentEditableVerticalPage },
]

const router = new VueRouter({
  routes // `routes: routes` の短縮表記
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
