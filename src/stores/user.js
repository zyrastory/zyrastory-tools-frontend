import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null) 

  const isLoggedIn = computed(() => !!user.value)
  const displayName = computed(() => user.value?.displayName || '無名氏')

  function setUser(userData) {
    user.value = userData
  }

  function clearUser() {
    user.value = null
  }

  return { 
    user, 
    isLoggedIn, 
    displayName, 
    setUser, 
    clearUser 
  }
})