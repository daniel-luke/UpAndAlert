<script setup lang="ts">
import DialogMonitor from '~/components/dialogs/DialogMonitor.vue'
import DialogActions from '~/types/dialogAction'
import MonitorList from '~/components/monitors/MonitorList.vue'

definePageMeta({
    middleware: ['authenticated'],
    title: 'Monitors',
    layout: false
})

useHead({
    title: $t('monitors').concat(' - ').concat($t('app.name'))
})
</script>

<template>
    <NuxtLayout name="default">
        <div
            class="flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10 p-4"
        >
            <h1 class="text-2xl font-bold">{{ $t('monitors') }}</h1>
            <div>
                <dialog-monitor open-via-button :action="DialogActions.CREATE" />
            </div>
        </div>
        <monitor-list />
    </NuxtLayout>
</template>

<style scoped></style>
