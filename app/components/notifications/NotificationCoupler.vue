<script setup lang="ts">
import type { Notification } from '~/types/Notification'
import NotificationCouplerSwitch from '~/components/notifications/NotificationCouplerSwitch.vue'

const { monitorId } = defineProps<{
    monitorId: number
}>()

const allNotifications: Ref<Notification[]> = ref([])

allNotifications.value = await $fetch<Notification[]>('/api/notification/list', {
    method: 'GET'
})
</script>

<template>
    <div v-if="allNotifications">
        <div v-for="notification in allNotifications" :key="notification.id">
            <notification-coupler-switch :monitor-id="monitorId" :notification="notification" />
        </div>
    </div>
</template>
