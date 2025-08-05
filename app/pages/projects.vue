<script setup lang="ts">
definePageMeta({
    middleware: ['authenticated'],
    title: 'Projects',
    layout: false
})

useHead({
    title: $t('projects').concat(' - ').concat($t('app.name'))
})
</script>

<template>
    <NuxtLayout name="default">
        <template #title>{{ $t('projects') }}</template>
        <div></div>
    </NuxtLayout>
</template>

<style scoped></style>
