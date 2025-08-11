<script setup lang="ts">
const { title } = defineProps<{
    title: string
}>()
</script>

<template>
    <div class="flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10 p-4">
        <h1 class="text-2xl font-bold">{{ title }}</h1>
        <div class="flex gap-4">
            <slot name="actions" />
        </div>
    </div>
</template>

<style scoped></style>
