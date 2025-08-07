<script setup lang="ts">
import MonitorCard from '~/components/monitors/MonitorCard.vue'
import type { Monitor } from '~/types/Monitor'

const props = defineProps<{
    monitorList: Monitor[]
}>()
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <monitor-card v-for="monitor in monitorList" :key="monitor.id" :monitor="monitor" />
    </div>
</template>
