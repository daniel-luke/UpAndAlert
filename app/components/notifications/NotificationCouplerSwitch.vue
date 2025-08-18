<script setup lang="ts">
import type { Notification } from '~/types/Notification'

const { notification, monitorId } = defineProps<{
    notification: Notification
    monitorId: number
}>()

const toggleValue: Ref<boolean> = ref(false)

await $fetch(`/api/notification/monitor/${monitorId}`, {
    method: 'GET'
}).then((res) => {
    if (res instanceof Array) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        res.map((attachedNotification: { notification_id: number }) => {
            if (attachedNotification.notification_id! === notification.id) {
                toggleValue.value = true
            } else {
                toggleValue.value = false
            }
        })
    } else {
        if (res.notification_id! === notification.id) {
            toggleValue.value = true
        } else {
            toggleValue.value = false
        }
    }
})

async function handleToggle() {
    if (toggleValue.value) {
        await detach()
    } else {
        await attach()
    }
}

async function attach() {
    await $fetch(`/api/notification/monitor/${monitorId}`, {
        method: 'POST',
        body: {
            notificationId: notification.id
        }
    })
        .then(() => {
            toggleValue.value = true
            useToast().add({
                title: 'Success',
                description: 'Notification attached',
                color: 'success'
            })
        })
        .catch((err) => {
            useToast().add({
                title: 'Error',
                description: err.message,
                color: 'error'
            })
        })
}

async function detach() {
    await $fetch(`/api/notification/monitor/${monitorId}`, {
        method: 'DELETE',
        body: {
            notificationId: notification.id
        }
    })
        .then(() => {
            toggleValue.value = false
            useToast().add({
                title: 'Success',
                description: 'Notification detached',
                color: 'success'
            })
        })
        .catch((err) => {
            useToast().add({
                title: 'Error',
                description: err.message,
                color: 'error'
            })
        })
}
</script>

<template>
    <USwitch
        :key="notification.id"
        :label="notification.name"
        :model-value="toggleValue"
        @change.prevent="handleToggle"
    />
</template>
