<script setup lang="ts">
definePageMeta({
    middleware: ['authenticated'],
    title: 'Incidents',
    layout: false
})

useHead({
    title: $t('incidents').concat(' - ').concat($t('app.name'))
})
</script>

<template>
    <NuxtLayout name="default">
        <template #title>{{ $t('incidents') }}</template>
        <div></div>
    </NuxtLayout>
</template>

<style scoped></style>
