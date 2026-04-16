import { ref } from 'vue'

const API_URL = 'http://localhost:3000/api'

interface ApiOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
}

export function useApi() {
  const token = ref(localStorage.getItem('token'))

  async function request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || 'Request failed')
    }

    return response.json()
  }

  function setToken(newToken: string | null) {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  return { request, setToken, token }
}
