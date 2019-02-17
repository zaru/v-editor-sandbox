import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import ContentEditablePage from './components/ContentEditablePage.vue'
import ContentEditableVerticalPage from './components/ContentEditableVerticalPage.vue'
import ContentEditableVerticalPageMobile from './components/ContentEditableVerticalPageMobile.vue'
import Sync from './components/Sync.vue'

Vue.use(VueRouter)

Vue.config.productionTip = false

const routes = [
  { path: '/contenteditable', component: ContentEditablePage },
  { path: '/contenteditable/vertical', component: ContentEditableVerticalPage },
  { path: '/contenteditable/vertical/m', component: ContentEditableVerticalPageMobile },
  { path: '/contenteditable/sync', component: Sync },
]

const router = new VueRouter({
  routes // `routes: routes` の短縮表記
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
