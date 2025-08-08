<script setup lang="ts">
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

const { monitor, beats } = defineProps<{
    monitor: MonitorCardData
    beats: { status: string; created_at: string; response_time: number }[] | undefined
}>()

const isLoading = ref(true)
const open = ref(false)

const lastStatus = computed(() => {
    if (monitor.in_maintenance) {
        return $t('maintenance')
    }

    if (!monitor.is_active) {
        return $t('paused')
    }
    if (beats === undefined || beats.length === 0) {
        return 'unknown'
    } else {
        const length = beats.length
        const lastBeat = beats[length - 1]
        if (lastBeat) {
            return lastBeat.status === 'up' ? $t('up') : $t('down')
        }
        return 'unknown'
    }
})

const openDialog = () => {
    open.value = !open.value
}

onBeforeUnmount(() => {
    close()
})

onMounted(() => {
    setTimeout(() => {
        isLoading.value = false
    }, 100)
})
</script>

<template>
    <UCard
        v-if="!isLoading"
        as="button"
        :variant="monitor.is_active ? 'soft' : 'subtle'"
        class="hover:outline-1 hover:cursor-pointer outline-primary/50"
        :class="monitor.in_maintenance || !monitor.is_active ? 'opacity-50' : ''"
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
    <dialog-monitor
        v-if="!isLoading"
        :open-dialog="open"
        :action="DialogActions.VIEW"
        :monitor="monitor"
        :beats="beats"
    />
    <USkeleton v-else class="h-[113px] w-full" />
</template>
