<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { useWindowSize } from '@vueuse/core'
import { useUserSession } from '#imports'

const localePath = useLocalePath()
const { user } = useUserSession()
const { width } = useWindowSize()
const isOpen = ref()

const toggleMenu = () => {
    isOpen.value = !isOpen.value
}

watch(width, () => {
    if (width.value > 768) {
        isOpen.value = true
    } else {
        isOpen.value = false
    }
})

onMounted(() => {
    if (width.value > 768) {
        isOpen.value = true
    } else {
        isOpen.value = false
    }
})

const items = ref<NavigationMenuItem[][]>([
    [
        {
            label: $t('dashboard'),
            icon: 'i-lucide-home',
            to: localePath('/'),
            tooltip: true,
            tooltipText: $t('dashboard')
        },
        {
            label: $t('monitors'),
            icon: 'i-lucide-monitor',
            to: localePath('/monitors'),
            tooltip: true,
            tooltipText: $t('monitors')
        }
    ],
    [
        {
            label: $t('components'),
            icon: 'i-lucide-component',
            to: localePath('/components'),
            tooltip: true,
            tooltipText: $t('components')
        },
        {
            label: $t('projects'),
            icon: 'i-lucide-folder',
            to: localePath('/projects'),
            tooltip: true,
            tooltipText: $t('projects')
        },
        {
            label: $t('incidents'),
            icon: 'i-lucide-alert-triangle',
            to: localePath('/incidents'),
            tooltip: true,
            tooltipText: $t('incidents')
        },
        {
            label: $t('status.pages'),
            icon: 'i-lucide-file-text',
            to: localePath('/status-pages'),
            tooltip: true,
            tooltipText: $t('status.pages')
        }
    ],
    [
        {
            label: $t('settings'),
            icon: 'i-lucide-settings',
            to: localePath('/settings'),
            tooltip: true,
            class: user.value!.is_admin ? '' : 'hidden',
            tooltipText: $t('settings')
        },
        {
            label: 'GitHub',
            icon: 'i-simple-icons-github',
            to: 'https://github.com/daniel-luke/UpAndAlert',
            target: '_blank',
            tooltip: true,
            tooltipText: 'GitHub'
        }
    ]
])
</script>

<template>
    <div
        class="flex flex-col gap-6 justify-between h-screen p-4 border-r border-gray-200 dark:border-gray-800"
    >
        <div class="flex flex-col gap-6">
            <div class="flex items-center justify-baseline gap-4 min-h-11">
                <UTooltip :text="$t('toggle.menu')">
                    <UButton icon="i-lucide-menu" size="lg" variant="outline" @click="toggleMenu" />
                </UTooltip>
                <div v-if="isOpen" class="flex flex-col">
                    <span class="text-lg font-bold">UpAndAlert</span>
                    <span class="text-xs">1.0.0-alpha</span>
                </div>
            </div>
            <UNavigationMenu
                :collapsed="!isOpen"
                orientation="vertical"
                :items="items"
                class="data-[orientation=vertical]"
                :class="isOpen ? 'w-64' : 'pl-1'"
            />
        </div>
    </div>
</template>
