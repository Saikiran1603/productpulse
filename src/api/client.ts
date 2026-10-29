import axios from 'axios'
const configuredApi = import.meta.env.VITE_API_URL?.trim()
const usableConfiguredApi = configuredApi && !/^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/i.test(configuredApi)
  ? configuredApi.replace(/\/$/, '')
  : ''
const productionApi = usableConfiguredApi || '/api'
export const api = axios.create({
  baseURL: import.meta.env.DEV ? (import.meta.env.VITE_API_URL || 'http://localhost:3001') : productionApi
})
