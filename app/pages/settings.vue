<script setup lang="ts">
definePageMeta({
    middleware: ['authenticated'],
    title: 'Settings',
    layout: false
})

useHead({
    title: $t('settings').concat(' - ').concat($t('app.name'))
})
</script>

<template>
    <NuxtLayout name="default">
        <template #title>{{ $t('settings') }}</template>
        <div></div>
    </NuxtLayout>
</template>

<style scoped></style>
