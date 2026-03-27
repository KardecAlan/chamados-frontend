<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/40 px-4">
    <Card class="w-full max-w-sm p-8">
      <div class="flex flex-col items-center gap-2 mb-8">
        <div class="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
          <ClipboardList class="w-6 h-6 text-primary-foreground" />
        </div>
        <h1 class="text-xl font-semibold">Sistema de Chamados</h1>
        <p class="text-sm text-muted-foreground">Entre com sua conta para continuar</p>
      </div>

      <div v-if="erro" class="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
        <AlertCircle class="w-4 h-4 flex-shrink-0" /> {{ erro }}
      </div>

      <form @submit.prevent="entrar" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <Label>Email</Label>
          <Input v-model="email" type="email" placeholder="seu@email.com" required />
        </div>
        <div class="flex flex-col gap-1.5">
          <Label>Senha</Label>
          <Input v-model="senha" type="password" placeholder="••••••" required />
        </div>
        <Button type="submit" :disabled="carregando" class="w-full mt-2">
          <Loader2 v-if="carregando" class="w-4 h-4 animate-spin" />
          {{ carregando ? 'Entrando...' : 'Entrar' }}
        </Button>
      </form>

      <div class="mt-6 p-3 rounded-lg bg-muted text-xs text-muted-foreground space-y-1">
        <p class="font-medium text-foreground">Usuários padrão</p>
        <p>marido@casa.com / 123456 → Atendente</p>
        <p>esposa@casa.com / 123456 → Solicitante</p>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ClipboardList, AlertCircle, Loader2 } from 'lucide-vue-next'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Input from '../components/ui/Input.vue'
import Label from '../components/ui/Label.vue'
import { authService } from '../services/authService'

const router = useRouter()
const email = ref('')
const senha = ref('')
const erro = ref('')
const carregando = ref(false)

async function entrar() {
  carregando.value = true
  erro.value = ''
  try {
    const data = await authService.login(email.value, senha.value)
    router.push(data.perfil === 'ATENDENTE' ? '/painel' : '/abrir')
  } catch (e) {
    erro.value = e.response?.data?.erro || 'Erro ao fazer login'
  } finally { carregando.value = false }
}
</script>
