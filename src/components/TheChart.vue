<script setup lang="ts">
import { type Ref, ref, shallowRef, watch, nextTick } from 'vue'
import { useDataStore } from '@/stores/data'
import ApexCharts from 'apexcharts'

const dataStore = useDataStore()

const chartElement = ref(null)
const chart: Ref<ApexCharts | null> = shallowRef(null)

const chartOptions = {
  chart: {
    type: 'line'
  },
  series: [
    {
      name: 'sales',
      data: [
        [1991, 30],
        [1992, 40]
      ]
    }
  ],
  xaxis: {
    type: 'datetime'
  },
  yaxis: [
    {
      title: {
        text: 'Gewicht'
      }
    },
    {
      opposite: true,
      title: {
        text: 'Kalorienzufuhr'
      }
    }
  ]
}

function syncChartData(data: Array<any>) {
  const weightData = data.map((point) => point.weight)
  const intakeData = data.map((point) => point.caloricIntake)
  const dates = data.map((point) => point.getDate())

  chartOptions.series = [
    { name: 'Gewicht', data: weightData },
    { name: 'Kalorienzufuhr', data: intakeData }
  ]
  chartOptions.xaxis = {
    categories: dates,
    type: 'datetime'
  }
}

watch(
  () => dataStore.data,
  (newData) => {
    if (newData.length <= 0) return

    syncChartData(newData)

    if (chart.value) {
      chart.value.updateOptions(chartOptions)
      return
    }

    nextTick(() => {
      chart.value = new ApexCharts(chartElement.value, chartOptions)
      chart.value.render()
    })
  },
  { immediate: true, deep: true }
)
</script>
<template>
  <div id="chart" ref="chartElement"></div>
</template>
