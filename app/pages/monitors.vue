<script setup lang="ts">
import DialogNewMonitor from '~/components/dialogs/DialogNewMonitor.vue'

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
                <dialog-new-monitor />
            </div>
        </div>
        <monitor-list />
    </NuxtLayout>
</template>

<style scoped></style>
