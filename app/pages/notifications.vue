<script setup lang="ts">
import NotificationList from '~/components/notifications/NotificationList.vue'
import NotificationDialog from '~/components/notifications/NotificationDialog.vue'

definePageMeta({
    middleware: ['authenticated'],
    title: 'Monitors',
    layout: false
})

useHead({
    title: $t('notifications').concat(' - ').concat($t('app.name'))
})

const selectedNotification: Ref<number | undefined> = ref(undefined)
const dialogOpen = ref(false)

provide('dialogOpen', dialogOpen)

const editNotification = (id: number) => {
    selectedNotification.value = id
    dialogOpen.value = true
}
</script>

<template>
    <NuxtLayout name="default">
        <page-header :title="$t('notifications')">
            <template #actions>
                <UDrawer
                    v-model:open="dialogOpen"
                    direction="bottom"
                    title="dialogTitle"
                    description="dialogDescription"
                    should-scale-background
                    set-background-color-on-scale
                    @close="selectedNotification = undefined"
                >
                    <UButton
                        icon="i-heroicons-plus"
                        variant="solid"
                        :label="$t('notification.create')"
                        type="button"
                    />
                    <template #body>
                        <notification-dialog
                            v-if="selectedNotification"
                            :id="selectedNotification"
                        />
                        <notification-dialog v-else />
                    </template>
                </UDrawer>
            </template>
        </page-header>
        <notification-list @edit="editNotification" />
    </NuxtLayout>
</template>
