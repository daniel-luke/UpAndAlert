<script setup lang="ts">
import EditProfileForm from '~/components/forms/EditProfileForm.vue'
import ChangePassword from '~/components/forms/ChangePassword.vue'

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
        <edit-profile-form />
        <div class="w-full border-b border-gray-200 dark:border-gray-700 my-4"></div>
        <span class="text-2xl font-bold">{{ $t('change.password') }}</span>
        <change-password />
    </NuxtLayout>
</template>

<style scoped></style>
