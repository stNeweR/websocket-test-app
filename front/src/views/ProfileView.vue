<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useApi } from '../composables/api'
import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: any
    Echo: any
  }
}

const router = useRouter()
const authStore = useAuthStore()
const { request } = useApi()

const user = computed(() => authStore.user)
const loading = computed(() => authStore.loading)

const newMessage = ref('')
const messages = ref<Array<{id: number; sender_id: number; content: string; created_at: string}>>([])
const otherUserId = computed(() => user.value?.id === 1 ? 2 : 1)

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    await authStore.fetchUser()
  }
  await fetchMessages()

  window.Pusher = Pusher;
  console.log(import.meta.env)
  window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
  });

  window.Echo.channel('store-message').listen('StoreMessageEvent', (e: any) => {
    console.log(e)
  })
})

async function fetchMessages() {
  if (!otherUserId.value) return

  try {
    const data = await request<{messages: Array<{id: number; sender_id: number; content: string; created_at: string}>}>(
      `/messages?user_id=${otherUserId.value}`
    )
    messages.value = data.messages
  } catch (e) {
    console.error('Failed to fetch messages:', e)
  }
}

async function sendMessage() {
  if (!newMessage.value.trim() || !otherUserId.value) return

  try {
    const data = await request<{message: {id: number; sender_id: number; content: string; created_at: string}}>('/messages', {
      method: 'POST',
      body: {
        content: newMessage.value,
      },
    })
    console.log(data)
    messages.value.push(data.message)
    newMessage.value = ''
  } catch (e) {
    console.error('Failed to send message:', e)
  }
}

async function handleLogout() {
  await authStore.logout()
  await router.push('/login')
}
</script>

<template>
  <div class="max-w-lg mx-auto p-5">
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Профиль</h2>
      <p v-if="user" class="mb-2"><strong>Имя:</strong> {{ user.name }}</p>
      <p v-if="user" class="mb-4"><strong>Email:</strong> {{ user.email }}</p>
      <button @click="handleLogout" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Выйти</button>
    </div>

    <div class="border rounded-lg overflow-hidden flex flex-col h-96">
      <div class="flex gap-3 p-4 border-b bg-gray-50">
        <input 
          v-model="newMessage" 
          @keyup.enter="sendMessage"
          placeholder="Введите сообщение..."
          class="flex-1 px-3 py-2 border rounded"
        />
        <button @click="sendMessage" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Отправить</button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        <div 
          v-for="msg in messages" 
          :key="msg.id"
          :class="['p-2 rounded-lg max-w-[70%]', msg.sender_id === user?.id ? 'self-end bg-blue-500 text-white' : 'self-start bg-gray-200 text-gray-800']"
        >
          <p>{{ msg.content }}</p>
          <span class="text-xs opacity-70 block mt-1">{{ new Date(msg.created_at).toLocaleTimeString() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
