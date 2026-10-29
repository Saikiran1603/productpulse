import axios from 'axios'
const productionApi = import.meta.env.VITE_API_URL || '/api'
export const api = axios.create({
  baseURL: import.meta.env.DEV ? (import.meta.env.VITE_API_URL || 'http://localhost:3001') : productionApi
})
