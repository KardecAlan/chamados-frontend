<template>
  <div class="max-w-xl">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold">Novo chamado</h1>
      <p class="text-muted-foreground text-sm mt-1">Descreva o que precisa ser feito</p>
    </div>

    <div v-if="sucesso" class="mb-4 p-3 rounded-lg bg-emerald-50 text-emerald-800 text-sm flex items-center gap-2 border border-emerald-200">
      <CheckCircle2 class="w-4 h-4 flex-shrink-0" /> Chamado aberto com sucesso!
    </div>
    <div v-if="erro" class="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
      <AlertCircle class="w-4 h-4 flex-shrink-0" /> {{ erro }}
    </div>

    <Card class="p-6">
      <form @submit.prevent="enviar" class="flex flex-col gap-5">
        <div class="flex flex-col gap-1.5">
          <Label>Título *</Label>
          <Input v-model="form.titulo" placeholder="Ex: Trocar lâmpada da cozinha" required />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label>Categoria *</Label>
          <Select v-model="form.categoria" required>
            <option value="">Selecionar...</option>
            <option value="CASA">Casa</option>
            <option value="COMPRAS">Compras</option>
            <option value="TECNOLOGIA">Tecnologia</option>
            <option value="CARRO">Carro</option>
            <option value="FINANCEIRO">Financeiro</option>
            <option value="OUTRO">Outro</option>
          </Select>
        </div>

        <div class="flex flex-col gap-1.5">
          <Label>Prioridade *</Label>
          <div class="flex gap-2">
            <button v-for="p in prioridades" :key="p.valor" type="button"
              @click="form.prioridade = p.valor"
              :class="['flex-1 py-2 px-3 rounded-md text-sm font-medium border transition-all', prioClass(p.valor)]">
              {{ p.label }}
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <Label>Descrição</Label>
          <Textarea v-model="form.descricao" placeholder="Detalhe o que precisa ser feito..." class="min-h-[100px]" />
        </div>

        <Button type="submit" :disabled="carregando" class="w-full">
          <Loader2 v-if="carregando" class="w-4 h-4 animate-spin" />
          {{ carregando ? 'Enviando...' : 'Abrir chamado' }}
        </Button>
      </form>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-vue-next'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Input from '../components/ui/Input.vue'
import Label from '../components/ui/Label.vue'
import Select from '../components/ui/Select.vue'
import Textarea from '../components/ui/Textarea.vue'
import api from '../services/chamadoService'

const form = ref({ titulo: '', categoria: '', prioridade: 'BAIXA', descricao: '' })
const sucesso = ref(false)
const erro = ref('')
const carregando = ref(false)

const prioridades = [
  { valor: 'BAIXA', label: 'Baixa' },
  { valor: 'MEDIA', label: 'Média' },
  { valor: 'ALTA', label: 'Alta' }
]

function prioClass(valor) {
  const ativo = form.value.prioridade === valor
  if (!ativo) return 'border-input text-muted-foreground hover:border-primary/50'
  if (valor === 'BAIXA') return 'border-emerald-400 bg-emerald-50 text-emerald-800'
  if (valor === 'MEDIA') return 'border-amber-400 bg-amber-50 text-amber-800'
  if (valor === 'ALTA') return 'border-red-400 bg-red-50 text-red-800'
}

async function enviar() {
  if (!form.value.categoria) { erro.value = 'Selecione uma categoria'; return }
  carregando.value = true; erro.value = ''; sucesso.value = false
  try {
    await api.criar(form.value)
    sucesso.value = true
    form.value = { titulo: '', categoria: '', prioridade: 'BAIXA', descricao: '' }
    setTimeout(() => sucesso.value = false, 3000)
  } catch (e) {
    erro.value = e.response?.data?.titulo || 'Erro ao abrir chamado.'
  } finally { carregando.value = false }
}
</script>
