<script setup lang="ts">
import { ref } from 'vue'
import TheChart from '@/components/TheChart.vue'
import { BForm, BInputGroup, BFormInput, BButton } from 'bootstrap-vue-next'

import { useDataStore } from '@/stores/data'
const dataStore = useDataStore()

const weight = ref(0)
const caloricIntake = ref(0)
const date = ref('')

function onSubmit() {
  dataStore.addDataPoint(caloricIntake.value, weight.value, Date.parse(date.value))
}
</script>

<template>
  <TheChart />
  <BForm @submit.prevent="onSubmit">
    <div class="inline">
      <BInputGroup append="kg"><BFormInput v-model="weight" /></BInputGroup>
      <BInputGroup append="kcal"><BFormInput v-model="caloricIntake" /></BInputGroup>
    </div>
    <BFormInput type="date" v-model="date" />
    <BButton id="add-data-button" type="submit" variant="primary">Hinzufügen</BButton>
  </BForm>
  <ul>
    <li v-for="point in dataStore.data" :key="point.id">
      <p>{{ point.weight }}kg {{ point.caloricIntake }}kcal</p>
      <BButton @click="point.delete">Löschen</BButton>
    </li>
  </ul>
</template>
