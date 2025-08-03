<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { useWindowSize } from '@vueuse/core'

const localePath = useLocalePath()
const { width } = useWindowSize()
const isOpen = ref(false)

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
    }
})

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
