<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-semibold">Painel de execução</h1>
      <p class="text-muted-foreground text-sm mt-1">Gerencie e execute os chamados</p>
    </div>

    <div v-if="stats" class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <Card class="p-4 text-center">
        <p class="text-2xl font-semibold">{{ stats.total }}</p>
        <p class="text-xs text-muted-foreground mt-1">Total</p>
      </Card>
      <Card class="p-4 text-center">
        <p class="text-2xl font-semibold text-muted-foreground">{{ stats.pendentes }}</p>
        <p class="text-xs text-muted-foreground mt-1">Pendentes</p>
      </Card>
      <Card class="p-4 text-center">
        <p class="text-2xl font-semibold text-blue-600">{{ stats.emAndamento }}</p>
        <p class="text-xs text-muted-foreground mt-1">Em andamento</p>
      </Card>
      <Card class="p-4 text-center">
        <p class="text-2xl font-semibold text-emerald-600">{{ stats.concluidos }}</p>
        <p class="text-xs text-muted-foreground mt-1">Concluídos</p>
      </Card>
    </div>

    <div class="flex gap-2 flex-wrap mb-4">
      <button v-for="f in filtros" :key="f.valor" @click="filtroAtual = f.valor"
        :class="['px-3 py-1.5 rounded-full text-sm font-medium transition-colors border', filtroAtual === f.valor ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input text-muted-foreground hover:text-foreground']">
        {{ f.label }}
      </button>
    </div>

    <div v-if="carregando" class="text-center py-12 text-muted-foreground text-sm">Carregando...</div>

    <div v-else-if="!chamadosFiltrados.length" class="text-center py-12 border rounded-xl text-muted-foreground text-sm">
      Nenhum chamado aqui ainda.
    </div>

    <div v-else class="flex flex-col gap-3">
      <Card v-for="c in chamadosFiltrados" :key="c.id" class="p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <p class="font-medium text-sm">{{ c.titulo }}</p>
            <p class="text-xs text-muted-foreground mt-0.5">{{ labelCategoria(c.categoria) }} · {{ c.criadoEm }}</p>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <Badge :variant="prioBadge(c.prioridade)">{{ labelPrioridade(c.prioridade) }}</Badge>
            <Button variant="ghost" size="icon" class="h-7 w-7 text-muted-foreground hover:text-destructive" @click="deletar(c.id)">
              <Trash2 class="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
        <p v-if="c.descricao" class="text-sm text-muted-foreground mt-3 pt-3 border-t">{{ c.descricao }}</p>
        <div class="flex items-center gap-3 mt-3 pt-3 border-t">
          <Badge :variant="statusBadge(c.status)">{{ labelStatus(c.status) }}</Badge>
          <select
            :value="c.status"
            @change="mudarStatus(c.id, $event.target.value)"
            class="ml-auto h-8 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="PENDENTE">Pendente</option>
            <option value="EM_ANDAMENTO">Em andamento</option>
            <option value="CONCLUIDO">Concluído</option>
          </select>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import Card from '../components/ui/Card.vue'
import Badge from '../components/ui/Badge.vue'
import Button from '../components/ui/Button.vue'
import api from '../services/chamadoService'

const chamados = ref([])
const stats = ref(null)
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
  try {
    const [r1, r2] = await Promise.all([api.listar(), api.stats()])
    chamados.value = r1.data
    stats.value = r2.data
  } catch (e) { console.error(e) }
  finally { carregando.value = false }
}

async function mudarStatus(id, status) {
  try { await api.atualizarStatus(id, status); await carregar() }
  catch (e) { console.error(e) }
}

async function deletar(id) {
  if (!confirm('Excluir este chamado?')) return
  try { await api.deletar(id); await carregar() }
  catch (e) { console.error(e) }
}

onMounted(carregar)
</script>
