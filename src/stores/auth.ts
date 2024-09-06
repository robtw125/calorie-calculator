import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { auth } from '@/controllers/firebase'

import { useDataStore } from './data'

export const useAuthStore = defineStore('auth', () => {
  const userUid = ref('')
  const isAuthenticated = computed(() => userUid.value != '')
  const dataStore = useDataStore()

  onAuthStateChanged(auth, (user) => {
    if (user) {
      userUid.value = user.uid
      dataStore.subscribe()
      console.log('Erfolgreich angemeldet!', userUid.value)
    } else {
      dataStore.unsubscribe()
      console.log('Abgemeldet.')
    }
  })

  async function register(email: string, password: string) {
    await createUserWithEmailAndPassword(auth, email, password)
  }

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function logout() {
    await signOut(auth)
  }

  return { userUid, isAuthenticated, register, login, logout }
})
