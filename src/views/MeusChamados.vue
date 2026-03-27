<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-semibold">Meus chamados</h1>
      <p class="text-muted-foreground text-sm mt-1">Acompanhe o status dos seus chamados</p>
    </div>

    <div class="flex gap-2 flex-wrap mb-4">
      <button v-for="f in filtros" :key="f.valor" @click="filtroAtual = f.valor"
        :class="['px-3 py-1.5 rounded-full text-sm font-medium transition-colors border', filtroAtual === f.valor ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input text-muted-foreground hover:text-foreground']">
        {{ f.label }}
      </button>
    </div>

    <div v-if="carregando" class="text-center py-12 text-muted-foreground text-sm">Carregando...</div>

    <div v-else-if="!chamadosFiltrados.length" class="text-center py-12 border rounded-xl text-muted-foreground text-sm">
      Nenhum chamado encontrado.
    </div>

    <div v-else class="flex flex-col gap-3">
      <Card v-for="c in chamadosFiltrados" :key="c.id" class="p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <p class="font-medium text-sm truncate">{{ c.titulo }}</p>
            <p class="text-xs text-muted-foreground mt-0.5">{{ labelCategoria(c.categoria) }} · {{ c.criadoEm }}</p>
          </div>
          <div class="flex gap-2 flex-shrink-0">
            <Badge :variant="prioBadge(c.prioridade)">{{ labelPrioridade(c.prioridade) }}</Badge>
            <Badge :variant="statusBadge(c.status)">{{ labelStatus(c.status) }}</Badge>
          </div>
        </div>
        <p v-if="c.descricao" class="text-sm text-muted-foreground mt-3 pt-3 border-t">{{ c.descricao }}</p>
        <p v-if="c.atualizadoEm" class="text-xs text-muted-foreground/60 mt-2">Atualizado em {{ c.atualizadoEm }}</p>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Card from '../components/ui/Card.vue'
import Badge from '../components/ui/Badge.vue'
import api from '../services/authService'

const chamados = ref([])
const filtroAtual = ref('todos')
const carregando = ref(false)

const filtros = [
  { valor: 'todos', label: 'Todos' },
  { valor: 'PENDENTE', label: 'Pendentes' },
  { valor: 'EM_ANDAMENTO', label: 'Em andamento' },
  { valor: 'CONCLUIDO', label: 'Concluídos' }
]

const chamadosFiltrados = computed(() =>
  filtroAtual.value === 'todos' ? chamados.value : chamados.value.filter(c => c.status === filtroAtual.value)
)

const labelCategoria = v => ({ CASA:'Casa', COMPRAS:'Compras', TECNOLOGIA:'Tecnologia', CARRO:'Carro', FINANCEIRO:'Financeiro', OUTRO:'Outro' }[v] || v)
const labelPrioridade = v => ({ BAIXA:'Baixa', MEDIA:'Média', ALTA:'Alta' }[v] || v)
const labelStatus = v => ({ PENDENTE:'Pendente', EM_ANDAMENTO:'Em andamento', CONCLUIDO:'Concluído' }[v] || v)
const prioBadge = v => ({ BAIXA:'success', MEDIA:'warning', ALTA:'danger' }[v] || 'muted')
const statusBadge = v => ({ PENDENTE:'muted', EM_ANDAMENTO:'info', CONCLUIDO:'success' }[v] || 'muted')

async function carregar() {
  carregando.value = true
  try { const { data } = await api.get('/chamados'); chamados.value = data }
  catch (e) { console.error(e) }
  finally { carregando.value = false }
}
onMounted(carregar)
</script>
