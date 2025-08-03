<script setup lang="ts">
import { z } from 'zod'
import type { User } from '~~/server/modules/auth/models/User'

definePageMeta({
    middleware: ['authenticated'],
    title: 'Profile',
    layout: false
})

useHead({
    title: $t('profile').concat(' - ').concat($t('app.name'))
})

const schema = z.object({
    email: z.email('Invalid email').optional(),
    is_admin: z.boolean().optional(),
    first_name: z.string().min(2, 'Must be at least 2 characters'),
    last_name: z.string().min(2, 'Must be at least 2 characters'),
    phone: z.string().min(8, 'Must be at least 8 characters').optional()
})

const loading = ref(false)

const form: Ref<Partial<User>, string> = ref({})

const { data } = await useFetch('/api/user/me')
if (data.value?.user) form.value = data.value?.user
const { fetch: refreshSession } = useUserSession()
const handleSubmit = () => {
    $fetch('/api/user/update', {
        method: 'POST',
        body: form.value
    })
        .then(async () => {
            await refreshSession()
            useToast().add({
                title: 'Success',
                description: 'Profile updated successfully',
                icon: 'i-heroicons-check-circle',
                color: 'success'
            })
        })
        .catch((error) => {
            useToast().add({
                title: 'Error',
                description: error.data.statusMessage,
                icon: 'i-heroicons-x-circle',
                color: 'error'
            })
        })
}
</script>

<template>
    <NuxtLayout name="default">
        <template #title>{{ $t('profile') }}</template>
        <div class="">
            <UForm
                :schema="schema"
                :state="form"
                class="space-y-6 max-w-md"
                @submit.prevent="handleSubmit"
            >
                <div class="flex flex-col space-y-4">
                    <div>
                        <label
                            for="first_name"
                            class="block mb-1 text-s font-medium text-gray-700 dark:text-gray-200"
                            >{{ $t('login.first_name') }}</label
                        >
                        <UInput
                            id="first_name"
                            v-model="form.first_name"
                            type="text"
                            required
                            autocomplete="first_name"
                            class="w-full"
                        />
                    </div>

                    <div>
                        <label
                            for="last_name"
                            class="block mb-1 text-s font-medium text-gray-700 dark:text-gray-200"
                            >{{ $t('login.last_name') }}</label
                        >
                        <UInput
                            id="last_name"
                            v-model="form.last_name"
                            type="text"
                            required
                            autocomplete="last_name"
                            class="w-full"
                        />
                    </div>

                    <div>
                        <label
                            for="email"
                            class="block mb-1 text-s font-medium text-gray-700 dark:text-gray-200"
                            >{{ $t('login.email') }}</label
                        >
                        <UInput
                            id="email"
                            v-model="form.email"
                            type="email"
                            placeholder="you@example.com"
                            disabled
                            class="w-full"
                        />
                    </div>

                    <div>
                        <label
                            for="is_admin"
                            class="block mb-1 text-s font-medium text-gray-700 dark:text-gray-200"
                            >{{ $t('login.is_admin') }}</label
                        >
                        <UCheckbox id="is_admin" v-model="form.is_admin" disabled class="w-full" />
                    </div>
                </div>
                <UButton
                    type="submit"
                    color="primary"
                    block
                    :loading="loading"
                    class="hover:cursor-pointer"
                >
                    {{ $t('save.changes') }}
                </UButton>
            </UForm>
            <div class="w-full border-b border-gray-200 dark:border-gray-700 my-4"></div>
            <UForm
                :schema="schema"
                :state="form"
                class="space-y-6 max-w-md"
                @submit.prevent="handleSubmit"
            >
                <div class="flex flex-col space-y-4">
                    <div>
                        <label
                            for="last_name"
                            class="block mb-1 text-s font-medium text-gray-700 dark:text-gray-200"
                            >{{ $t('login.password') }}</label
                        >
                        <UInput
                            id="password"
                            v-model="form.password!"
                            type="password"
                            placeholder="********"
                            class="w-full"
                        />
                    </div>
                </div>
                <UButton
                    type="submit"
                    color="primary"
                    block
                    :loading="loading"
                    class="hover:cursor-pointer"
                >
                    {{ $t('save.password.changes') }}
                </UButton>
            </UForm>
        </div>
    </NuxtLayout>
</template>

<style scoped></style>
