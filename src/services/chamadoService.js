import api from './authService'

export default {
  listar(status = null) { return api.get('/chamados', { params: status ? { status } : {} }) },
  buscar(id) { return api.get(`/chamados/${id}`) },
  criar(dados) { return api.post('/chamados', dados) },
  atualizar(id, dados) { return api.put(`/chamados/${id}`, dados) },
  atualizarStatus(id, status) { return api.patch(`/chamados/${id}/status`, { status }) },
  deletar(id) { return api.delete(`/chamados/${id}`) },
  stats() { return api.get('/chamados/stats') }
}
