<script setup lang="ts">
import MonitorCard from '~/components/monitors/MonitorCard.vue'

type MonitorList = {
    id: number
    name: string
    monitor_type: string
    address: string
    polling_interval: number
    in_maintenance: boolean
    is_active: boolean
}

const { data: monitors } = await useFetch<MonitorList[]>('/api/monitor/list')
const route = useRoute()
const idToInitiallyOpen = route.query.id

watch(
    () => route.query.id,
    (newId, oldId) => {
        if (newId !== oldId) {
            window.location.reload()
        }
    },
    { deep: true }
)
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <monitor-card
            v-for="monitor in monitors"
            :key="monitor.id"
            :monitor="monitor"
            :render-opened="idToInitiallyOpen === monitor.id.toString()"
        />
    </div>
</template>
