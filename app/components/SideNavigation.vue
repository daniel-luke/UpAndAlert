<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const localePath = useLocalePath()

const isOpen = ref(false)
const toggleMenu = () => {
    isOpen.value = !isOpen.value
}
const items = ref<NavigationMenuItem[][]>([
    [
        {
            label: 'Dashboard',
            icon: 'i-lucide-home',
            to: localePath('/'),
            tooltip: true,
            tooltipText: $t('dashboard')
        }
    ],
    [
        {
            label: 'GitHub',
            icon: 'i-simple-icons-github',
            to: 'https://github.com/daniel-luke/UpAndAlert',
            target: '_blank',
            tooltip: true,
            tooltipText: 'GitHub'
        },
        {
            label: 'Help',
            icon: 'i-lucide-circle-help',
            to: 'https://github.com/daniel-luke/UpAndAlert/wiki',
            target: '_blank',
            tooltip: true,
            tooltipText: 'GitHub Wiki'
        }
    ]
])
</script>

<template>
    <div
        class="flex flex-col gap-6 justify-between h-screen p-4 border-r border-gray-200 dark:border-gray-800"
    >
        <div class="flex flex-col gap-6">
            <div class="flex items-center justify-baseline gap-4">
                <UTooltip :text="$t('toggle.menu')">
                    <UButton icon="i-lucide-menu" size="lg" variant="outline" @click="toggleMenu" />
                </UTooltip>
                <span v-if="isOpen" class="text-lg font-bold">UpAndAlert</span>
            </div>
            <UNavigationMenu
                collapsible
                :collapsed="!isOpen"
                orientation="vertical"
                :items="items"
                class="data-[orientation=vertical]"
                :class="isOpen ? 'w-64' : 'pl-1'"
            />
        </div>
    </div>
</template>
