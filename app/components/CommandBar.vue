<script setup lang="ts">
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

const groups = computed(() => [
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
                placeholder="Search users..."
                class="h-80"
            />
        </template>
    </UModal>
</template>
