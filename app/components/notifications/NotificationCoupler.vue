<script setup lang="ts">
import type { Notification } from '~/types/Notification'
import NotificationCouplerSwitch from '~/components/notifications/NotificationCouplerSwitch.vue'
import type DialogActions from '~/types/dialogAction'

const { monitorId } = defineProps<{
    monitorId: number
    action: DialogActions
}>()

const allNotifications: Ref<Notification[]> = ref([])

allNotifications.value = await $fetch<Notification[]>('/api/notification/list', {
    method: 'GET'
})
</script>

<template>
    <div v-if="allNotifications">
        <div v-for="notification in allNotifications" :key="notification.id">
            <notification-coupler-switch
                :disabled="action !== 0"
                :monitor-id="monitorId"
                :notification="notification"
                class="my-4"
            />
        </div>
    </div>
</template>
