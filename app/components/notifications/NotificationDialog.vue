<script setup lang="ts">
import { z } from 'zod'
import SmtpNotificationOptions from '~/components/notifications/SmtpNotificationOptions.vue'

const { id } = withDefaults(
    defineProps<{
        id?: number | undefined
    }>(),
    {
        id: undefined
    }
)

const notificationStore = useNotificationStore()
const { fetch } = notificationStore

const dialogOpen: Ref | undefined = inject('dialogOpen')

const schema = z.object({
    name: z.string().min(3),
    notification_type: z.string(),
    hostname: z.string().min(3),
    port: z.number().min(1).max(65535),
    username: z.string().optional(),
    password: z.string().optional(),
    from: z.email(),
    to: z.email(),
    cc: z.string().optional(),
    bcc: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().optional(),
    tls: z.boolean().optional(),
    is_active: z.boolean().optional()
})

const state = ref<z.infer<typeof schema>>({
    name: '',
    notification_type: 'smtp',
    hostname: '',
    port: 587,
    username: '',
    password: '',
    from: '',
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    message: '',
    tls: false,
    is_active: true
})

if (id) {
    const existingNotification = await $fetch<z.infer<typeof schema>>(`/api/notification/${id}`)
    if (existingNotification) {
        state.value = existingNotification
    }
}

const notification_types = ref([
    {
        label: 'SMTP',
        value: 'smtp'
    }
])

const components = {
    smtp: SmtpNotificationOptions
}

async function onSubmit() {
    console.log(state.value)
    if (id) {
        await $fetch(`/api/notification/${id}`, {
            method: 'POST',
            body: state.value
        })
            .then(() => {
                useToast().add({
                    title: 'Notification updated',
                    description: 'The notification has been updated successfully',
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
        await $fetch('/api/notification/create', {
            method: 'POST',
            body: state.value
        })
            .then(() => {
                useToast().add({
                    title: 'Notification created',
                    description: 'The notification has been created successfully',
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
            <h2 class="text-sm font-bold">{{ $t('notification.general') }}</h2>
            <UFormField name="name" label="Name">
                <UInput v-model="state.name" class="w-full" placeholder="My notification" />
            </UFormField>
            <UFormField name="type" label="Type">
                <USelect
                    v-model="state.notification_type"
                    :items="notification_types"
                    class="w-full"
                />
            </UFormField>
            <UButton class="w-fit hidden md:block" type="button" @click.prevent="onSubmit"
                >Submit</UButton
            >
        </div>
        <div class="col-span-1 lg:col-span-2">
            <component :is="components[state.notification_type]" v-model:state="state" />
        </div>
        <div class="col-span-1 md:col-span-2 lg:col-span-3 mt-4">
            <UButton class="md:hidden" type="button" @click.prevent="onSubmit">Submit</UButton>
        </div>
    </UForm>
</template>
