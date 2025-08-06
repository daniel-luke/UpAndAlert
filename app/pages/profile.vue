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
        <div
            class="flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10 p-4"
        >
            <h1 class="text-2xl font-bold">{{ $t('profile') }}</h1>
        </div>
        <div class="p-4">
            <edit-profile-form />
            <div class="w-full border-b border-gray-200 dark:border-gray-700 my-4"></div>
            <span class="text-2xl font-bold">{{ $t('change.password') }}</span>
            <change-password />
        </div>
    </NuxtLayout>
</template>

<style scoped></style>
