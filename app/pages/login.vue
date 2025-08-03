<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
    layout: 'empty'
})

useHead({
    title: $t('login').concat(' - ').concat($t('app.name'))
})

const switchLocalePath = useSwitchLocalePath()
const { loggedIn, fetch: refreshSession } = useUserSession()
const localePath = useLocalePath()

if (loggedIn.value) {
    await navigateTo(localePath('/'))
}

const credentials = reactive({
    email: '',
    password: ''
})

const schema = z.object({
    email: z.email('Invalid email'),
    password: z.string().min(8, 'Must be at least 8 characters')
})

const loading = ref(false)
const error = ref('')

async function login() {
    $fetch('/api/login', {
        method: 'POST',
        body: credentials
    })
        .then(async () => {
            // Refresh the session on client-side and redirect to the home page
            await refreshSession()
            await navigateTo(localePath('/'))
        })
        .catch(() => {
            error.value = 'Invalid credentials'
        })
}
</script>

<template>
    <div
        class="flex flex-col gap-6 min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900"
    >
        <UIcon name="i-heroicons-lock-closed" class="h-12 w-12 text-indigo-600" />
        <UCard class="w-full max-w-md p-6">
            <template #header>
                <h2 class="text-2xl font-bold text-center">{{ $t('login.title') }}</h2>
            </template>
            <UForm :schema="schema" :state="credentials" class="space-y-6" @submit.prevent="login">
                <div class="flex flex-col space-y-4">
                    <div>
                        <label
                            for="email"
                            class="block mb-1 text-s font-medium text-gray-700 dark:text-gray-200"
                            >{{ $t('login.email') }}</label
                        >
                        <UInput
                            id="email"
                            v-model="credentials.email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            autocomplete="email"
                            class="w-full"
                        />
                    </div>

                    <div>
                        <label
                            for="password"
                            class="block mb-1 text-m font-medium text-gray-700 dark:text-gray-200"
                            >{{ $t('login.password') }}</label
                        >
                        <UInput
                            id="password"
                            v-model="credentials.password"
                            type="password"
                            placeholder="••••••••"
                            required
                            autocomplete="current-password"
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
                    {{ $t('login') }}
                </UButton>
                <span v-if="error" class="text-red-500 text-sm">{{ error }}</span>
            </UForm>
            <template #footer>
                <p class="text-center text-sm text-gray-700 dark:text-gray-200 mt-4">
                    {{ $t('login.footer') }}
                </p>
                <div class="flex justify-center mt-2">
                    <language-switcher />
                    <theme-switcher />
                </div>
            </template>
        </UCard>
    </div>
</template>
