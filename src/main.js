import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Login from './views/Login.vue'
import AbrirChamado from './views/AbrirChamado.vue'
import MeusChamados from './views/MeusChamados.vue'
import Painel from './views/Painel.vue'
import { authService } from './services/authService'
import './style.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: Login },
    { path: '/abrir', component: AbrirChamado, meta: { requerLogin: true } },
    { path: '/meus-chamados', component: MeusChamados, meta: { requerLogin: true } },
    { path: '/painel', component: Painel, meta: { requerLogin: true, requerAtendente: true } },
    { path: '/', redirect: () => {
      if (!authService.isLogado()) return '/login'
      return authService.isAtendente() ? '/painel' : '/abrir'
    }}
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requerLogin && !authService.isLogado()) return next('/login')
  if (to.meta.requerAtendente && !authService.isAtendente()) return next('/abrir')
  next()
})

createApp(App).use(router).mount('#app')
