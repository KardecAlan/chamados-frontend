import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL + '/api'
  : '/api'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authService = {
  async login(email, senha) {
    const { data } = await api.post('/auth/login', { email, senha })
    localStorage.setItem('token', data.token)
    localStorage.setItem('nome', data.nome)
    localStorage.setItem('perfil', data.perfil)
    return data
  },
  async cadastro(payload) {
    return api.post('/auth/cadastro', payload)
  },
  logout() {
    localStorage.clear()
    window.location.href = '/login'
  },
  getPerfil() { return localStorage.getItem('perfil') },
  getNome() { return localStorage.getItem('nome') },
  isLogado() { return !!localStorage.getItem('token') },
  isAtendente() { return localStorage.getItem('perfil') === 'ATENDENTE' }
}

export default api
