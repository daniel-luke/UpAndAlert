<script setup lang="ts">
import LoginForm from '~/components/forms/LoginForm.vue'

definePageMeta({
    layout: 'empty'
})

useHead({
    title: $t('login').concat(' - ').concat($t('app.name'))
})

const { loggedIn } = useUserSession()
const localePath = useLocalePath()

if (loggedIn.value) {
    await navigateTo(localePath('/'))
}
</script>

<template>
    <div
        class="flex flex-col gap-6 min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900"
    >
        <UIcon name="i-heroicons-lock-closed" class="h-12 w-12 dark:text-indigo-600" />
        <login-form />
    </div>
</template>
