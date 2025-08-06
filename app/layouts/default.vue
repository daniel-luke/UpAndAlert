<script setup lang="ts">
import SideNavigation from '~/components/SideNavigation.vue'
</script>

<template>
    <div class="flex flex-row h-screen">
        <side-navigation />
        <div class="overflow-y-scroll w-full">
            <slot />
        </div>
        <command-bar />
    </div>
</template>
