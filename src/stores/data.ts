import { type Ref, ref } from 'vue'
import { defineStore } from 'pinia'

import DataPoint from '@/classes/data-point'

import { onSnapshot, collection, query, where, orderBy, addDoc } from 'firebase/firestore'
import { db } from '@/controllers/firebase'
import { useAuthStore } from './auth'

export const useDataStore = defineStore('data', () => {
  const data: Ref<Array<DataPoint>> = ref([])
  const authStore = useAuthStore()
  let unsub: any

  function subscribe() {
    const q = query(
      collection(db, 'data'),
      where('userUid', '==', authStore.userUid),
      orderBy('timestamp')
    )
    unsub = onSnapshot(q, (querySnapshot) => {
      data.value = []
      querySnapshot.forEach((doc) => {
        const { userUid, caloricIntake, weight, timestamp } = doc.data()
        const dataPoint = new DataPoint(doc.id, userUid, caloricIntake, weight, timestamp)
        data.value.push(dataPoint)
      })
    })
  }

  async function addDataPoint(caloricIntake: number, weight: number, timestamp: number) {
    await addDoc(collection(db, 'data'), {
      userUid: authStore.userUid,
      caloricIntake: caloricIntake,
      weight: weight,
      timestamp: timestamp
    })
  }

  function unsubscribe() {
    if (unsub != null) {
      unsub()
      data.value = []
      unsub = null
    }
  }

  return { data, subscribe, addDataPoint, unsubscribe }
})
