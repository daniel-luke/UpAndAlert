<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
    password: z
        .string($t('error.form.cannot.be.empty'))
        .min(8, $t('error.form.password.too.short')),
    new_password: z
        .string($t('error.form.cannot.be.empty'))
        .min(8, $t('error.form.password.too.short')),
    confirm_password: z
        .string($t('error.form.cannot.be.empty'))
        .min(8, $t('error.form.password.too.short'))
})

const loading = ref(false)

const form: Ref<{ password: string; new_password: string; confirm_password: string }> = ref({})

const handleSubmit = () => {
    if (form.value.new_password !== form.value.confirm_password) {
        useToast().add({
            title: $t('error'),
            description: $t('error.form.passwords.not.match'),
            icon: 'i-heroicons-x-circle',
            color: 'error'
        })
        return
    }
    $fetch('/api/user/update', {
        method: 'POST',
        body: {
            password: form.value.password,
            new_password: form.value.new_password
        }
    })
        .then(async () => {
            useToast().add({
                title: $t('success'),
                description: $t('password.changed.successfully'),
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
    <UForm :schema="schema" :state="form" class="space-y-6 max-w-md" @submit.prevent="handleSubmit">
        <div class="flex flex-col space-y-4">
            <UFormField :label="$t('current.password')" name="password" required>
                <UInput v-model="form.password" class="w-full" type="password" />
            </UFormField>

            <UFormField :label="$t('new.password')" name="new_password" required>
                <UInput v-model="form.new_password" class="w-full" type="password" />
            </UFormField>

            <UFormField :label="$t('confirm.password')" name="confirm_password" required>
                <UInput v-model="form.confirm_password" class="w-full" type="password" />
            </UFormField>
        </div>
        <UButton
            type="submit"
            color="primary"
            block
            :loading="loading"
            class="hover:cursor-pointer"
        >
            {{ $t('save.password') }}
        </UButton>
    </UForm>
</template>
