<script setup lang="ts">
import { z } from 'zod'

const { id } = defineProps<{
    // eslint-disable-next-line vue/require-default-prop
    id?: number | undefined
}>()

const userStore = userUserStore()
const { fetch } = userStore

const dialogOpen: Ref | undefined = inject('dialogOpen')

const schema = z.object({
    first_name: z.string().min(3),
    last_name: z.string().min(3),
    email: z.email(),
    password: z.string().optional(),
    is_admin: z.boolean().optional()
})

const state = ref<z.infer<typeof schema>>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    is_admin: false
})

if (id) {
    const existingUser = await $fetch<z.infer<typeof schema>>(`/api/user/admin/${id}`)
    if (existingUser) {
        state.value = existingUser
    }
}

async function onSubmit() {
    if (state.value.is_admin) {
        state.value.is_admin = true
    } else {
        state.value.is_admin = false
    }

    if (id) {
        await $fetch(`/api/user/admin/${id}`, {
            method: 'PATCH',
            body: state.value
        })
            .then(() => {
                useToast().add({
                    title: 'User updated',
                    description: 'The User has been updated successfully',
                    icon: 'i-heroicons-check-circle',
                    color: 'success'
                })

                fetch()
                if (dialogOpen) dialogOpen.value = false
            })
            .catch((error) => {
                useToast().add({
                    title: 'Error',
                    description: error.data.message,
                    icon: 'i-heroicons-exclamation-circle',
                    color: 'error'
                })
            })
    } else {
        await $fetch('/api/user/admin/', {
            method: 'POST',
            body: state.value
        })
            .then(() => {
                useToast().add({
                    title: 'User created',
                    description: 'The user has been created successfully',
                    icon: 'i-heroicons-check-circle',
                    color: 'success'
                })

                fetch()
                if (dialogOpen) dialogOpen.value = false
            })
            .catch((error) => {
                useToast().add({
                    title: 'Error',
                    description: error.data.message,
                    icon: 'i-heroicons-exclamation-circle',
                    color: 'error'
                })
            })
    }
}
</script>
<template>
    <UForm
        :state="state"
        :schema="schema"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        @submit="onSubmit"
    >
        <div class="flex flex-col col-span-1 gap-4">
            <UFormField name="name" label="Name" required>
                <UInput v-model="state.first_name" class="w-full" placeholder="John" />
            </UFormField>
            <UFormField name="last_name" label="Last name" required>
                <UInput v-model="state.last_name" class="w-full" placeholder="Doe" />
            </UFormField>
        </div>
        <div class="flex flex-col col-span-1 gap-4">
            <UFormField name="email" label="Email" required>
                <UInput
                    v-model="state.email"
                    type="email"
                    class="w-full"
                    placeholder="john.doe@email.com"
                />
            </UFormField>
            <UFormField name="password" label="Password" :required="!id">
                <UInput v-model="state.password" class="w-full" placeholder="********" />
            </UFormField>
        </div>
        <div class="flex flex-col col-span-1 gap-4">
            <UFormField name="is_admin" label="Is admin" required>
                <USwitch v-model="state.is_admin" />
            </UFormField>
        </div>
        <div class="col-span-1 md:col-span-2 lg:col-span-3 mt-4">
            <UButton type="button" @click.prevent="onSubmit">Submit</UButton>
        </div>
    </UForm>
</template>
