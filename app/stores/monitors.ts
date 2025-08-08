import type { Monitor } from '~/types/Monitor'

export const useMonitorStore = defineStore('monitor', () => {
    const monitors: Ref<{ monitors: Monitor[]; total: number }> = ref({ monitors: [], total: 0 })
    const lastKnownPage = ref(1)
    const reloadOverview = ref(false)

    /**
     * Fetch monitors from the API
     * @param page
     */
    async function fetch(page: number) {
        monitors.value = await $fetch<{ monitors: Monitor[]; total: number }>('/api/monitor/list', {
            method: 'GET',
            query: {
                page: page,
                limit: 12
            }
        })

        lastKnownPage.value = page
    }

    return { monitors, lastKnownPage, reloadOverview, fetch }
})
