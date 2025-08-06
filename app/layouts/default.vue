<script setup lang="ts">
import SideNavigation from '~/components/navigation/SideNavigation.vue'
</script>

<template>
    <div class="flex flex-row h-screen">
        <side-navigation />
        <UContainer class="overflow-y-scroll w-full">
            <slot />
        </UContainer>
        <command-bar />
    </div>
</template>
