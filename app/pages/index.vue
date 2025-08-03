<script setup lang="ts">
definePageMeta({
    middleware: ['authenticated'],
    title: 'Dashboard',
    layout: false
})

useHead({
    title: $t('dashboard').concat(' - ').concat($t('app.name'))
})
</script>

<template>
    <NuxtLayout name="default">
        <template #title>{{ $t('dashboard') }}</template>
        <div></div>
    </NuxtLayout>
</template>

<style scoped></style>
