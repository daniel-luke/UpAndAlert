<script setup lang="ts">
definePageMeta({
    middleware: ['authenticated'],
    title: 'Monitors',
    layout: false
})

useHead({
    title: $t('monitors').concat(' - ').concat($t('app.name'))
})
</script>

<template>
    <NuxtLayout name="default">
        <template #title>{{ $t('monitors') }}</template>
        <div></div>
    </NuxtLayout>
</template>

<style scoped></style>
