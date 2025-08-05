<script setup lang="ts">
definePageMeta({
    middleware: ['authenticated'],
    title: 'Components',
    layout: false
})

useHead({
    title: $t('components').concat(' - ').concat($t('app.name'))
})
</script>

<template>
    <NuxtLayout name="default">
        <template #title>{{ $t('components') }}</template>
        <div></div>
    </NuxtLayout>
</template>

<style scoped></style>
