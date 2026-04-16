<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { onMounted } from 'vue'
import Echo from "laravel-echo"
import Pusher from 'pusher-js'

const authStore = useAuthStore()

onMounted(() => {
  authStore.fetchUser()
})

</script>

<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center space-x-8">
          <RouterLink to="/" class="text-xl font-bold text-gray-800">App</RouterLink>
          <div v-if="authStore.isLoggedIn" class="flex space-x-4">
            <RouterLink to="/profile" class="text-gray-600 hover:text-gray-900">Профиль</RouterLink>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <template v-if="authStore.isLoggedIn">
            <span class="text-gray-600">{{ authStore.user?.name }}</span>
            <button @click="authStore.logout()" class="text-gray-600 hover:text-gray-900">Выйти</button>
          </template>
          <template v-else>
            <RouterLink to="/login" class="text-gray-600 hover:text-gray-900">Вход</RouterLink>
            <RouterLink to="/register" class="text-gray-600 hover:text-gray-900">Регистрация</RouterLink>
          </template>
        </div>
      </div>
    </div>
  </nav>

  <RouterView />
</template>
