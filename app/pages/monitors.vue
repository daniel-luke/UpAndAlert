<script setup lang="ts">
import DialogMonitor from '~/components/dialogs/DialogMonitor.vue'
import DialogActions from '~/types/dialogAction'
import MonitorList from '~/components/monitors/MonitorList.vue'
import { useWindowSize } from '@vueuse/core'

definePageMeta({
    middleware: ['authenticated'],
    title: 'Monitors',
    layout: false
})

useHead({
    title: $t('monitors').concat(' - ').concat($t('app.name'))
})

const isLoading = ref(true)
const { width } = useWindowSize()

const monitorStore = useMonitorStore()
const { monitors, reloadOverview } = storeToRefs(monitorStore)
const { fetch } = monitorStore

const page = ref(1)

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

watch(reloadOverview, async () => {
    isLoading.value = true
    await fetch(page.value)
    reloadOverview.value = false
    isLoading.value = false
})
</script>

<template>
    <NuxtLayout name="default">
        <page-header :title="$t('monitors')">
            <template #actions>
                <UPagination
                    v-if="width > 768 && monitors.total > 12"
                    v-model:page="page"
                    :items-per-page="12"
                    :sibling-count="1"
                    :total="monitors.total"
                    variant="soft"
                    :show-controls="false"
                    :show-edges="true"
                />
                <dialog-monitor open-via-button :action="DialogActions.CREATE" />
            </template>
        </page-header>
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
