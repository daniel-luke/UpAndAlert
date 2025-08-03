<script setup lang="ts">
definePageMeta({
    middleware: ['authenticated'],
    title: 'Profile',
    layout: false
})

useHead({
    title: $t('profile').concat(' - ').concat($t('app.name'))
})
</script>

<template>
    <NuxtLayout name="default">
        <template #title>{{ $t('profile') }}</template>
        <div></div>
    </NuxtLayout>
</template>

<style scoped></style>
