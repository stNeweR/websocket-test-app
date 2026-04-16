import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useApi } from '../composables/api'

interface User {
  id: number
  name: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const { request, setToken, token } = useApi()

  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isLoggedIn = computed(() => !!token.value)

  async function register(data: { name: string; email: string; password: string; password_confirmation: string }) {
    loading.value = true
    error.value = null

    try {
      const response = await request<{ user: User; token: string }>('/auth/register', {
        method: 'POST',
        body: data,
      })

      user.value = response.user
      setToken(response.token)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Registration failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function login(data: { email: string; password: string }) {
    loading.value = true
    error.value = null

    try {
      const response = await request<{ user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: data,
      })

      user.value = response.user
      setToken(response.token)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Login failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await request('/auth/logout', { method: 'POST' })
    } finally {
      user.value = null
      setToken(null)
    }
  }

  async function fetchUser() {
    if (!token.value) return

    try {
      const response = await request<{ user: User }>('/auth/me')
      user.value = response.user
    } catch {
      user.value = null
      setToken(null)
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isLoggedIn,
    register,
    login,
    logout,
    fetchUser,
  }
})
