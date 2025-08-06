<script setup lang="ts">
import { z } from 'zod'

const open = ref(false)

const schema = z.object({
    name: z.string().min(3),
    monitor_type: z.string(),
    address: z.url(),
    polling_interval: z.number().min(60)
})

const state = reactive({
    name: undefined,
    monitor_type: 'http',
    address: undefined,
    polling_interval: 60
})

async function create() {
    $fetch('/api/monitor/create', {
        method: 'POST',
        body: state
    })
        .then(async () => {
            useToast().add({
                title: 'Monitor created',
                description: 'Your monitor has been created successfully',
                icon: 'i-heroicons-check-circle',
                color: 'success'
            })
            open.value = false
            await refreshNuxtData()
        })
        .catch((err) => {
            useToast().add({
                title: 'Error',
                description: err.message,
                icon: 'i-heroicons-x-circle',
                color: 'error'
            })
        })
}
</script>

<template>
    <UDrawer
        v-model:open="open"
        direction="bottom"
        :title="$t('new.monitor')"
        should-scale-background
        set-background-color-on-scale
    >
        <UButton
            icon="i-heroicons-plus"
            color="success"
            variant="solid"
            :label="$t('new.monitor')"
        />
        <template #body>
            <LazyUForm
                :schema="schema"
                :state="state"
                class="min-h-[10vh]"
                @submit.prevent="create"
            >
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div class="flex flex-col gap-2 flex-1">
                        <h2 class="text-sm font-bold">General</h2>
                        <UFormField label="Name" name="name">
                            <UInput
                                v-model="state.name"
                                icon="i-heroicons-tag"
                                placeholder="My Monitor"
                                class="w-full"
                            />
                        </UFormField>
                        <UFormField label="Type" name="type">
                            <USelect
                                v-model="state.monitor_type"
                                :items="['http']"
                                default-value="http"
                                class="w-full"
                            />
                        </UFormField>
                        <UFormField label="Address" name="address">
                            <UInput
                                v-model="state.address"
                                icon="i-heroicons-globe-alt"
                                placeholder="https://example.com"
                                class="w-full"
                            />
                        </UFormField>
                        <UFormField label="Interval" name="interval">
                            <UInputNumber
                                v-model="state.polling_interval"
                                icon="i-heroicons-clock"
                                :min="60"
                                :default-value="60"
                                class="w-32"
                            />
                        </UFormField>
                    </div>
                    <div class="flex flex-col gap-2 flex-1">
                        <h2 class="text-sm font-bold">Monitor Specific</h2>
                        <span
                            v-if="state.type === 'HTTP'"
                            class="text-sm text-gray-500 self-center justify-self-center"
                            >No specific options available.</span
                        >
                    </div>
                    <div class="flex flex-col gap-2 flex-1">
                        <h2 class="text-sm font-bold">Notifications</h2>
                        <span class="text-sm text-gray-500 self-center justify-self-center"
                            >Not implemented yet.</span
                        >
                    </div>
                    <div class="col-span-1 md:col-span-2 lg:col-span-3 inline-flex">
                        <UButton type="submit" class="mt-4"> Save Monitor</UButton>
                    </div>
                </div>
            </LazyUForm>
        </template>
    </UDrawer>
</template>
