<script setup lang="ts">
import MonitorCard from '~/components/monitors/MonitorCard.vue'
import type { Monitor } from '~/types/Monitor'
import { useWebSocket } from '@vueuse/core'

const props = defineProps<{
    monitorList: Monitor[]
}>()

const monitorStore = useMonitorStore()
const { reloadOverview } = storeToRefs(monitorStore)

const websocketData: Ref<
    {
        id: number
        data: {
            created_at: string
            status: string
            status_code: number
            response_time: number
        }[]
    }[]
> = ref([])
const ws = useWebSocket('/ws/heartbeat/channel', {
    autoConnect: true,
    autoReconnect: true,
    onConnected: () => {
        const monitorSubList: number[] = []
        props.monitorList.forEach((monitor) => {
            monitorSubList.push(monitor.id)
        })

        ws.send(JSON.stringify({ action: 'subscribe', monitorList: monitorSubList }))
    },
    onMessage: (ws, event) => {
        const message = JSON.parse(event.data)
        if (message.action === 'subscribe') websocketData.value = message.data
        if (message.action === 'update') {
            const monitorId = message.data.monitorId
            const index = getIdForWS(parseInt(monitorId))
            const newData = websocketData.value
            if (newData[index]?.data.length === 14) {
                newData[index]?.data.shift()
            }
            newData[index]?.data.push(message.data.heartbeat)
            websocketData.value = newData
        }
    }
})

function getIdForWS(monitorId: number) {
    return websocketData.value.findIndex((entry) => entry.id === monitorId)
}

watch(reloadOverview, () => {
    ws.open()
})
</script>
<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <monitor-card
            v-for="monitor in monitorList"
            :key="monitor.id.toString()"
            :monitor="monitor"
            :beats="websocketData[getIdForWS(monitor.id)]?.data"
        />
    </div>
</template>
