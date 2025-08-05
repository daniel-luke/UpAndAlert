<script setup lang="ts">
definePageMeta({
    middleware: ['authenticated'],
    title: 'Status Pages',
    layout: false
})

useHead({
    title: $t('status.pages').concat(' - ').concat($t('app.name'))
})
</script>

<template>
    <NuxtLayout name="default">
        <template #title>{{ $t('status.pages') }}</template>
        <div></div>
    </NuxtLayout>
</template>

<style scoped></style>
