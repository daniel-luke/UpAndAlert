<script setup lang="ts">
import SideNavigation from '~/components/SideNavigation.vue'
import ThemeSwitcher from '~/components/ThemeSwitcher.vue'
import LogoutButton from '~/components/LogoutButton.vue'
import ProfileMenuButton from '~/components/ProfileMenuButton.vue'
import { useWindowSize } from '@vueuse/core'

const route = useRoute()
const title = route.meta.title as string
const { width } = useWindowSize()

useHead({
    title: title.concat(' - ', $t('app.name'))
})
</script>

<template>
    <div class="flex flex-row full overflow-x-hidden md:overflow-x-auto">
        <side-navigation />
        <div class="flex flex-col w-full p-4">
            <div
                class="flex flex-row align-center gap-4 justify-between pb-2 mb-2 border-b border-gray-200 dark:border-gray-800"
            >
                <span class="text-2xl font-bold">{{ title }}</span>
                <div class="flex flex-row gap-2 align-center">
                    <profile-menu-button />
                    <span v-if="width > 768"><theme-switcher /></span>
                    <span v-if="width > 768"><language-switcher /></span>
                    <span v-if="width > 768"><logout-button /></span>
                </div>
            </div>
            <slot />
        </div>
        <command-bar />
    </div>
</template>
