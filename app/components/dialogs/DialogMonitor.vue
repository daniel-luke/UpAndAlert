<script setup lang="ts">
import { z } from 'zod'
import type { RadioGroupItem } from '#ui/components/RadioGroup.vue'
import DialogActions from '~/types/dialogAction'
import type { Monitor } from '~~/server/modules/monitoring/models/Monitor'
import HeartbeatChart from '~/components/monitors/HeartbeatChart.vue'
import UptimeChart from '~/components/monitors/UptimeChart.vue'

const open = ref(false)

const { openDialog, action, monitor, openViaButton } = defineProps<{
    action: DialogActions
    openDialog?: boolean
    monitor?: Monitor
    openViaButton?: boolean
    beats?: {
        status: string
        created_at: string
        response_time: number
    }[]
}>()

const finalAction = ref(action)

watch(
    () => openDialog,
    () => {
        open.value = true
    }
)

const schema = z.object({
    id: z.number().optional(),
    name: z.string().min(3),
    monitor_type: z.string(),
    address: z.url(),
    polling_interval: z.number().min(60)
})

const state = ref<z.infer<typeof schema>>({
    name: '',
    monitor_type: 'http',
    address: '',
    polling_interval: 60
})

const intervalChoice = ref('Every minute')
const items = ref<RadioGroupItem[]>(['Every minute', 'Every hour', 'Every day', 'Custom'])

const formEditable = ref(false)
if (action === DialogActions.CREATE || action === DialogActions.EDIT) {
    formEditable.value = true
}

const dialogTitle = computed(() => {
    switch (action) {
        case DialogActions.CREATE:
            return $t('monitor.create')
        default:
            return monitor?.name || 'monitor'
    }
})

watch(intervalChoice, (value) => {
    state.value.polling_interval =
        value === 'Every minute'
            ? 60
            : value === 'Every hour'
              ? 3600
              : value === 'Every day'
                ? 86400
                : 60
})

watch(open, async (val) => {
    if (val) {
        if (action !== DialogActions.CREATE) await getUpdatedMonitor()
    }
})
async function create() {
    $fetch('/api/monitor/create', {
        method: 'POST',
        body: state.value
    })
        .then(async () => {
            useToast().add({
                title: 'Monitor created',
                description: 'Your monitor has been created successfully',
                icon: 'i-heroicons-check-circle',
                color: 'success'
            })
            state.value = {
                name: '',
                monitor_type: 'http',
                address: '',
                polling_interval: 60
            }
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

async function unalive() {
    if (!monitor) return
    $fetch('/api/monitor/delete', {
        method: 'POST',
        body: {
            id: monitor.id
        }
    })
        .then(async () => {
            useToast().add({
                title: 'Monitor deleted',
                description: 'Your monitor has been deleted successfully',
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

async function update() {
    if (!monitor) return

    $fetch('/api/monitor/update', {
        method: 'POST',
        body: {
            ...state.value,
            id: monitor.id
        }
    })
        .then(async () => {
            useToast().add({
                title: 'Monitor updated',
                description: 'Your monitor has been updated successfully',
                icon: 'i-heroicons-check-circle',
                color: 'success'
            })
            finalAction.value = DialogActions.VIEW
            open.value = false
            makeFormNonEditable()
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

async function getUpdatedMonitor() {
    if (finalAction.value === DialogActions.EDIT || finalAction.value === DialogActions.VIEW) {
        await useFetch<Monitor>(`/api/monitor/${monitor?.id}`, {
            method: 'GET'
        }).then((res) => {
            if (res.data.value) {
                console.log(res.data.value)
                state.value.monitor_type = res.data.value.monitor_type
                state.value.name = res.data.value.name
                state.value.address = res.data.value.address
                state.value.polling_interval = res.data.value.polling_interval
            }
        })
    }
}

function makeFormEditable() {
    finalAction.value = DialogActions.EDIT
    formEditable.value = true
}

function makeFormNonEditable() {
    finalAction.value = DialogActions.VIEW
    formEditable.value = false
}
</script>

<template>
    <UDrawer
        v-model:open="open"
        direction="bottom"
        :title="dialogTitle"
        should-scale-background
        set-background-color-on-scale
    >
        <UButton
            v-if="openViaButton"
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
                    <div
                        v-if="
                            finalAction === DialogActions.VIEW || finalAction === DialogActions.EDIT
                        "
                        class="col-span-1 md:col-span-2 lg:col-span-3"
                    >
                        <div
                            class="grid grid-cols-1 gap-4 md:grid-cols-2 md:max-h-[150px] mb-5 md:mb-20 lg:flex"
                        >
                            <heartbeat-chart v-if="beats" :beats="beats" />
                            <uptime-chart v-if="beats && monitor" :id="monitor.id" :beats="beats" />
                        </div>
                    </div>
                    <div class="flex flex-col gap-2 flex-1">
                        <h2 class="text-sm font-bold">{{ $t('monitor.general') }}</h2>
                        <UFormField :label="$t('monitor.field.name')" name="name">
                            <UInput
                                v-model="state.name"
                                :disabled="!formEditable"
                                icon="i-heroicons-tag"
                                placeholder="My Monitor"
                                class="w-full"
                            />
                        </UFormField>
                        <UFormField :label="$t('monitor.field.type')" name="type">
                            <USelect
                                v-model="state.monitor_type"
                                :disabled="!formEditable"
                                :items="['http']"
                                default-value="http"
                                class="w-full"
                            />
                        </UFormField>
                        <UFormField :label="$t('monitor.field.address')" name="address">
                            <UInput
                                v-model="state.address"
                                :disabled="!formEditable"
                                icon="i-heroicons-globe-alt"
                                placeholder="https://example.com"
                                class="w-full"
                            />
                        </UFormField>
                        <UFormField :label="$t('monitor.field.interval')" name="interval">
                            <URadioGroup
                                v-model="intervalChoice"
                                :disabled="!formEditable"
                                orientation="horizontal"
                                variant="table"
                                size="sm"
                                default-value="4"
                                :items="items"
                                indicator="hidden"
                            />
                        </UFormField>
                        <UFormField
                            v-if="intervalChoice === 'Custom'"
                            :label="$t('monitor.field.custom.interval')"
                            name="custom_interval"
                        >
                            <UInputNumber
                                v-model="state.polling_interval"
                                :disabled="!formEditable"
                                icon="i-heroicons-clock"
                                :min="60"
                                :default-value="60"
                                :step="60"
                                size="sm"
                                class="w-32"
                            />
                        </UFormField>
                    </div>
                    <div class="flex flex-col gap-2 flex-1">
                        <h2 class="text-sm font-bold">{{ $t('monitor.specific') }}</h2>
                    </div>
                    <div class="flex flex-col gap-2 flex-1">
                        <h2 class="text-sm font-bold">{{ $t('monitor.notifications') }}</h2>
                        <span class="text-sm text-gray-500 self-center justify-self-center"
                            >Not implemented yet.</span
                        >
                    </div>
                    <div
                        class="col-span-1 inline-flex flex-col md:gap-4 md:flex-row md:col-span-2 lg:col-span-3"
                    >
                        <UButton
                            v-if="formEditable && finalAction === DialogActions.CREATE"
                            type="submit"
                            class="mt-4 font-bold"
                            icon="i-heroicons-check"
                            >{{ $t('save.monitor') }}
                        </UButton>
                        <UButton
                            v-if="finalAction === DialogActions.EDIT"
                            type="button"
                            class="mt-4 font-bold"
                            color="info"
                            icon="i-heroicons-x-mark"
                            @click.prevent="makeFormNonEditable"
                            >{{ $t('view.monitor') }}
                        </UButton>
                        <UButton
                            v-if="formEditable && finalAction === DialogActions.EDIT"
                            type="button"
                            color="success"
                            class="mt-4 font-bold"
                            icon="i-heroicons-check"
                            @click.prevent="update"
                            >{{ $t('update.monitor') }}
                        </UButton>

                        <UButton
                            v-if="finalAction === DialogActions.VIEW"
                            type="button"
                            class="mt-4 font-bold"
                            color="warning"
                            icon="i-heroicons-pencil-square"
                            @click.prevent="makeFormEditable"
                            >{{ $t('edit.monitor') }}
                        </UButton>
                        <UButton
                            v-if="
                                finalAction === DialogActions.EDIT ||
                                finalAction === DialogActions.VIEW
                            "
                            type="button"
                            class="mt-4 font-bold"
                            color="error"
                            icon="i-heroicons-trash"
                            @click.prevent="unalive"
                            >{{ $t('delete.monitor') }}
                        </UButton>
                    </div>
                </div>
            </LazyUForm>
        </template>
    </UDrawer>
</template>
