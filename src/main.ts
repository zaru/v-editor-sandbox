import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import ContentEditablePage from './components/ContentEditablePage.vue'
import EditorPage from './pages/EditorPage.vue'
import ContentEditableVerticalPageMobile from './components/ContentEditableVerticalPageMobile.vue'
import Sync from './components/Sync.vue'
import CaretMove from './components/CaretMove.vue'
import AbsoluteCaret from './components/AbsoluteCaret.vue'
import NormalVertical from './components/NormalVertical.vue'

Vue.use(VueRouter)

Vue.config.productionTip = false

const routes = [
  { path: '/contenteditable', component: ContentEditablePage },
  { path: '/contenteditable/vertical', component: EditorPage },
  { path: '/contenteditable/vertical/m', component: ContentEditableVerticalPageMobile },
  { path: '/contenteditable/sync', component: Sync },
  { path: '/contenteditable/caret', component: CaretMove },
  { path: '/contenteditable/ab_caret', component: AbsoluteCaret },
  { path: '/contenteditable/normal', component: NormalVertical },
]

const router = new VueRouter({
  routes // `routes: routes` の短縮表記
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
