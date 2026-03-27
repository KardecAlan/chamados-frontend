<template>
  <div class="min-h-screen bg-background">
    <nav v-if="logado" class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div class="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
        <span class="font-semibold text-sm flex items-center gap-2">
          <ClipboardList class="w-4 h-4" /> Chamados
        </span>
        <div class="flex gap-1 flex-1">
          <router-link to="/abrir" class="nav-link">Abrir chamado</router-link>
          <router-link to="/meus-chamados" class="nav-link">Meus chamados</router-link>
          <router-link v-if="isAtendente" to="/painel" class="nav-link">Painel</router-link>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground">{{ nome }}</span>
          <Badge :variant="isAtendente ? 'info' : 'success'">
            {{ isAtendente ? 'Atendente' : 'Solicitante' }}
          </Badge>
          <Button variant="ghost" size="sm" @click="sair" class="gap-1 text-muted-foreground">
            <LogOut class="w-4 h-4" /> Sair
          </Button>
        </div>
      </div>
    </nav>
    <main :class="logado ? 'max-w-5xl mx-auto px-4 py-8' : ''">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ClipboardList, LogOut } from 'lucide-vue-next'
import Badge from './components/ui/Badge.vue'
import Button from './components/ui/Button.vue'
import { authService } from './services/authService'

const route = useRoute()
const logado = computed(() => authService.isLogado() && route.path !== '/login')
const isAtendente = computed(() => authService.isAtendente())
const nome = computed(() => authService.getNome())
function sair() { authService.logout() }
</script>

<style>
.nav-link {
  @apply px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors;
}
.router-link-active.nav-link {
  @apply bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground;
}
</style>
