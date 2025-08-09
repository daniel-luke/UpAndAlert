import type { Notification } from '~/types/Notification'

export const useNotificationStore = defineStore('notification', () => {
    const notifications: Ref<Notification[]> = ref([])

    /**
     * Fetch monitors from the API
     * @param page
     */
    async function fetch() {
        notifications.value = await $fetch<Notification[]>('/api/notification/list', {
            method: 'GET'
        })
    }

    function getNotificationById(id: number) {
        return notifications.value.find((notification) => notification.id === id)
    }

    return { notifications, getNotificationById, fetch }
})
