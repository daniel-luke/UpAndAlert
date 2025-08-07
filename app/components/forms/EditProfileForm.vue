<script setup lang="ts">
import { z } from 'zod'
import type { User } from '#auth-utils'

const schema = z.object({
    email: z.email($t('error.form.email.invalid')),
    is_admin: z.boolean(),
    first_name: z.string($t('error.form.cannot.be.empty')).min(2, $t('error.form.input.too.short')),
    last_name: z.string($t('error.form.cannot.be.empty')).min(2, $t('error.form.input.too.short'))
})

const loading = ref(false)

const form: Ref<Partial<User>> = ref({})

const { data } = await useFetch('/api/user/me')
if (data.value) form.value = data.value
if (typeof form.value.is_admin === 'number') {
    form.value.is_admin = Boolean(form.value.is_admin)
}
const { fetch: refreshSession } = useUserSession()
const handleSubmit = () => {
    $fetch('/api/user/update', {
        method: 'POST',
        body: form.value
    })
        .then(async () => {
            await refreshSession()
            useToast().add({
                title: $t('success'),
                description: $t('profile.changed.successfully'),
                icon: 'i-heroicons-check-circle',
                color: 'success'
            })
            await refreshNuxtData()
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
    <UForm :schema="schema" :state="form" class="space-y-6 max-w-md" @submit.prevent="handleSubmit">
        <div class="flex flex-col space-y-4">
            <UFormField :label="$t('login.first_name')" name="first_name" required>
                <UInput v-model="form.first_name" class="w-full" />
            </UFormField>

            <UFormField :label="$t('login.last_name')" name="last_name" required>
                <UInput v-model="form.last_name" class="w-full" />
            </UFormField>

            <UFormField :label="$t('login.email')" name="email" required>
                <UInput v-model="form.email" disabled type="email" class="w-full" />
            </UFormField>

            <UFormField
                :label="$t('login.is_admin')"
                name="is_admin"
                required
                class="flex items-center gap-2"
            >
                <UCheckbox id="is_admin" v-model="form.is_admin" disabled class="w-full" />
            </UFormField>
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
</template>
