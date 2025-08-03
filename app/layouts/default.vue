<script setup lang="ts">
import SideNavigation from '~/components/SideNavigation.vue'
import ThemeSwitcher from '~/components/ThemeSwitcher.vue'
import LogoutButton from '~/components/LogoutButton.vue'
import ProfileMenuButton from '~/components/ProfileMenuButton.vue'

const route = useRoute()
</script>

<template>
    <div class="flex flex-row w-full overflow-x-hidden md:overflow-x-auto">
        <side-navigation />
        <div class="flex flex-col w-full p-4">
            <div
                class="flex flex-row align-center justify-between pb-2 mb-2 border-b border-gray-200 dark:border-gray-800"
            >
                <span class="text-2xl font-bold">{{ route.meta.title }}</span>
                <div class="flex flex-row gap-2 align-center">
                    <profile-menu-button />
                    <theme-switcher />
                    <logout-button />
                </div>
            </div>
            <slot />
        </div>
    </div>
</template>
