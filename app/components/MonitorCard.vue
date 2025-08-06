<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'

type MonitorCardData = {
    id: number
    name: string
    monitor_type: string
    address: string
    polling_interval: number
    in_maintenance: boolean
}

const { monitor } = defineProps<{
    monitor: MonitorCardData
}>()

const beats: Ref<{ status: string; created_at: string }[]> = ref([])
const isLoading = ref(true)

const { data } = useWebSocket(`ws://localhost:3000/ws/heartbeat/${monitor.id}`, {
    autoClose: false,
    autoConnect: false,
    onMessage: () => {}
})

onMounted(() => {
    isLoading.value = false
})

watch(data, (newData) => {
    const beatPacket = JSON.parse(newData)
    if (beats.value.length > 100) {
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
        return lastBeat ? lastBeat.status : 'unknown'
    }
})
</script>

<template>
    <UCard
        v-if="!isLoading"
        variant="soft"
        class="hover:outline-1 hover:cursor-pointer outline-primary/50"
        :class="monitor.in_maintenance ? 'pointer-events-none opacity-50' : ''"
    >
        <template #header>
            <div class="flex justify-between items-start">
                <div class="flex flex-col">
                    <h3 class="text-md font-semibold">{{ monitor.name }}</h3>
                    <span class="text-xs text-gray-500">{{ monitor.address }}</span>
                </div>
                <div class="flex gap-2">
                    <UBadge
                        v-if="!monitor.in_maintenance"
                        :color="lastStatus === 'up' ? 'success' : 'error'"
                        variant="solid"
                        class="font-bold capitalize"
                        >{{ lastStatus }}
                    </UBadge>
                    <UBadge v-else color="info" variant="solid" class="font-bold capitalize"
                        >Maintenance
                    </UBadge>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="flex flex-row gap-1 overflow-x-hidden">
                <UTooltip
                    v-for="beat in beats.slice(-100).reverse()"
                    :key="beat.status"
                    :delay-duration="0"
                    :text="beat.created_at + ' - ' + (beat.status === 'up' ? 'Up' : 'Down')"
                >
                    <UBadge
                        variant="solid"
                        class="h-5"
                        :color="beat.status === 'up' ? 'success' : 'error'"
                    ></UBadge>
                </UTooltip>
            </div>
        </template>
    </UCard>
</template>
