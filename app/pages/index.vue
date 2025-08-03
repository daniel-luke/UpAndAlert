<script setup lang="ts">
definePageMeta({
    middleware: ['authenticated'],
    title: 'Dashboard'
})

useHead({
    title: $t('dashboard.title').concat(' - ', $t('app.name'))
})

const { user, clear: clearSession } = useUserSession()
const localePath = useLocalePath()

async function logout() {
    await clearSession()
    await navigateTo(localePath('/login'))
}
</script>

<template>
    <div>
        <h1>{{ $t('homepage.welcome') }} {{ user!.first_name }} {{ user!.last_name }}</h1>
        <button @click="logout">{{ $t('logout') }}</button>
    </div>
</template>

<style scoped></style>
