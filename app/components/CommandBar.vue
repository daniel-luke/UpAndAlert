<script setup lang="ts">
import type { Monitor } from '~/types/Monitor'

const searchTerm = ref('')
const open = ref(false)
const localePath = useLocalePath()
const { clear: clearSession } = useUserSession()
const colorMode = useColorMode()

defineShortcuts({
    '.': {
        handler: () => {
            open.value = !open.value
        }
    }
})

const { data: monitors, status } = await useFetch('/api/monitor/list', {
    key: 'command-palette-monitors',
    transform: (data: { monitors: Monitor[] }) => {
        return (
            data.monitors?.map((mon) => ({
                id: mon.id,
                label: mon.name,
                suffix: mon.address,
                onSelect: async () => {
                    await navigateTo(localePath(`/monitors?id=${mon.id}`))
                    open.value = false
                }
            })) || []
        )
    },
    lazy: true
})

const groups = computed(() => [
    {
        id: 'quicklinks',
        label: searchTerm.value ? `Quicklinks matching “${searchTerm.value}”...` : 'Quicklinks',
        items: [
            {
                id: 'dashboard',
                icon: 'i-lucide-home',
                label: $t('dashboard'),
                onSelect: async () => {
                    await navigateTo(localePath('/'))
                    open.value = false
                }
            },
            {
                id: 'monitors',
                icon: 'i-lucide-monitor',
                label: $t('monitors'),
                onSelect: async () => {
                    await navigateTo(localePath('/monitors'))
                    open.value = false
                }
            }
        ]
    },
    {
        id: 'monitors',
        label: searchTerm.value ? `Monitors matching “${searchTerm.value}”...` : 'Monitors',
        items: monitors.value || []
    },
    {
        id: 'actions',
        label: searchTerm.value ? `Actions matching “${searchTerm.value}”...` : 'Actions',
        items: [
            {
                id: 'logout',
                icon: 'i-lucide-log-out',
                label: $t('logout'),
                onSelect: async () => {
                    await clearSession()
                    await navigateTo(localePath('/login'))
                    open.value = false
                }
            },
            {
                id: 'theme-switch',
                icon: colorMode.value === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun',
                label: $t('switch.theme'),
                onSelect: () => {
                    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
                    open.value = false
                }
            },
            {
                id: 'edit-profile',
                icon: 'i-lucide-user',
                label: $t('edit.profile'),
                onSelect: () => {
                    navigateTo(localePath('/profile'))
                    open.value = false
                }
            }
        ],
        ignoreFilter: false
    }
])
</script>

<template>
    <UModal v-model:open="open">
        <template #content>
            <UCommandPalette
                v-model:search-term="searchTerm"
                :loading="status === 'pending'"
                :groups="groups"
                placeholder="Search..."
                class="h-80"
            />
        </template>
    </UModal>
</template>
