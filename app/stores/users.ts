import type { User } from '#auth-utils'

export const userUserStore = defineStore('user', () => {
    const users: Ref<User[]> = ref([])

    /**
     * Fetch monitors from the API
     */
    async function fetch() {
        users.value = await $fetch<User[]>('/api/user/admin/list', {
            method: 'GET'
        })
    }

    /**
     * Get a notification by its id
     * @param id
     * @returns
     */
    function getNotificationById(id: number) {
        return users.value.find((user) => user.id === id)
    }

    return { users, getNotificationById, fetch }
})
