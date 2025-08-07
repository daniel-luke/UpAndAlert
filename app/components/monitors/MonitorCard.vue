<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'
import DialogActions from '~/types/dialogAction'
import DialogMonitor from '~/components/dialogs/DialogMonitor.vue'
import HeartbeatBar from '~/components/monitors/HeartbeatBar.vue'
import StatusBadge from '~/components/monitors/StatusBadge.vue'

type MonitorCardData = {
    id: number
    name: string
    monitor_type: string
    address: string
    polling_interval: number
    in_maintenance: boolean
    is_active: boolean
}

const { monitor, renderOpened } = defineProps<{
    monitor: MonitorCardData
    renderOpened: boolean
}>()

const beats: Ref<{ status: string; created_at: string }[]> = ref([])
const isLoading = ref(true)
const open = ref(false)

const { data } = useWebSocket(`ws://localhost:3000/ws/heartbeat/${monitor.id}`, {
    autoClose: false,
    autoConnect: false,
    onMessage: () => {},
    onConnected: () => {
        isLoading.value = false
    }
})

watch(data, (newData) => {
    const beatPacket = JSON.parse(newData)
    if (beats.value.length > 28) {
        beats.value.shift()
    }
    beats.value.push(beatPacket)
})

const lastStatus = computed(() => {
    if (beats.value.length === 0) {
        return 'unknown'
    } else {
        const length = beats.value.length
        const lastBeat = beats.value[length - 1]
        if (lastBeat) {
            return lastBeat.status === 'up' ? $t('up') : $t('down')
        }
        return 'unknown'
    }
})

const openDialog = () => {
    open.value = !open.value
}

onMounted(() => {
    if (renderOpened) {
        open.value = openDialog()
    }
})
</script>

<template>
    <UCard
        v-if="!isLoading"
        variant="soft"
        class="hover:outline-1 hover:cursor-pointer outline-primary/50"
        :class="monitor.in_maintenance ? 'pointer-events-none opacity-50' : ''"
        @click="openDialog"
    >
        <template #header>
            <div class="flex justify-between items-start">
                <div class="flex flex-col">
                    <h3 class="text-md font-semibold">{{ monitor.name }}</h3>
                    <span class="text-xs text-gray-500">{{ monitor.address }}</span>
                </div>
                <div class="flex gap-2">
                    <status-badge :last-status="lastStatus" :monitor="monitor" />
                </div>
            </div>
        </template>
        <template #footer>
            <heartbeat-bar :beats="beats" />
        </template>
    </UCard>
    <dialog-monitor :open-dialog="open" :action="DialogActions.VIEW" :monitor="monitor" />
</template>
