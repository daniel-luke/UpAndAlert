<script setup lang="ts">
import DialogMonitor from '~/components/dialogs/DialogMonitor.vue'
import DialogActions from '~/types/dialogAction'
import MonitorList from '~/components/monitors/MonitorList.vue'
import type { Monitor } from '~/types/Monitor'
import { useWindowSize } from '@vueuse/core'

definePageMeta({
    middleware: ['authenticated'],
    title: 'Monitors',
    layout: false
})

useHead({
    title: $t('monitors').concat(' - ').concat($t('app.name'))
})

const refreshMonitorApiData = ref(false)
provide('refreshMonitorApiData', refreshMonitorApiData)
watch(refreshMonitorApiData, async (newValue) => {
    if (newValue) {
        console.log('updating monitor data')
        isLoading.value = true
        await useFetch<{ monitors: Monitor[]; total: number }>('/api/monitor/list', {
            method: 'GET',
            query: {
                page: page.value,
                limit: 12
            }
        }).then((res) => {
            data.value = res.data.value
        })
        refreshMonitorApiData.value = false
        isLoading.value = false
    }
})

const isLoading = ref(true)
const { width } = useWindowSize()
const page = ref(1)

const monitorStore = useMonitorStore()
const { monitors } = storeToRefs(monitorStore)
const { fetch } = monitorStore

onBeforeMount(async () => {
    await fetch(page.value)
})

onMounted(() => {
    isLoading.value = false
})

watch(page, async (newPage) => {
    isLoading.value = true
    await fetch(newPage)
    isLoading.value = false
})
</script>

<template>
    <NuxtLayout name="default">
        <div
            class="flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10 p-4"
        >
            <h1 class="text-2xl font-bold">{{ $t('monitors') }}</h1>
            <div class="flex gap-4">
                <UPagination
                    v-if="width > 768"
                    v-model:page="page"
                    :items-per-page="12"
                    :sibling-count="1"
                    :total="monitors.total"
                    variant="soft"
                    :show-controls="false"
                    :show-edges="true"
                />
                <dialog-monitor open-via-button :action="DialogActions.CREATE" />
            </div>
        </div>
        <div v-if="!isLoading && monitors.monitors.length > 0">
            <monitor-list :monitor-list="monitors.monitors" />
            <UPagination
                v-if="width < 768"
                v-model:page="page"
                :items-per-page="12"
                :total="monitors.total"
                variant="soft"
                :sibling-count="1"
            />
        </div>
        <USkeleton v-else class="h-12 w-full" />
    </NuxtLayout>
</template>
