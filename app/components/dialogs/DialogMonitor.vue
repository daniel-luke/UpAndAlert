<script setup lang="ts">
import { z } from 'zod'
import type { RadioGroupItem } from '#ui/components/RadioGroup.vue'
import DialogActions from '~/types/dialogAction'
import type { Monitor } from '~~/server/modules/monitoring/models/Monitor'
import HeartbeatChart from '~/components/monitors/HeartbeatChart.vue'
import UptimeChart from '~/components/monitors/UptimeChart.vue'
import { useWindowSize } from '@vueuse/core'

const monitorStore = useMonitorStore()
const { fetch } = monitorStore
const { lastKnownPage, reloadOverview } = storeToRefs(monitorStore)

const open = ref(false)
const { width } = useWindowSize()
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

const notAvailable = computed(() => {
    if (action === DialogActions.CREATE) return false
    return !monitor?.is_active || monitor?.in_maintenance
})

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
            return $t('new.monitor')
        default:
            return monitor?.name || 'monitor'
    }
})

const dialogDescription = computed(() => {
    switch (action) {
        case DialogActions.CREATE:
            return
        default:
            return monitor?.address + ' (' + monitor?.monitor_type.toUpperCase() + ')' || ''
    }
})

watch(intervalChoice, (value) => {
    console.log(value)
    state.value.polling_interval =
        value === 'Every minute'
            ? 60
            : value === 'Every hour'
              ? 3600
              : value === 'Every day'
                ? 86400
                : 60
})

watch(open, async () => {
    if (open.value) {
        if (action !== DialogActions.CREATE) await getUpdatedMonitor()
        intervalChoice.value =
            state.value.polling_interval === 60
                ? 'Every minute'
                : state.value.polling_interval === 3600
                  ? 'Every hour'
                  : state.value.polling_interval === 86400
                    ? 'Every day'
                    : 'Custom'
    } else {
        finalAction.value = DialogActions.VIEW
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
            reloadNuxtApp({ force: true })
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
            await fetch(lastKnownPage.value)
            reloadOverview.value = true
            finalAction.value = DialogActions.VIEW
            makeFormNonEditable()
            open.value = false
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
            makeFormNonEditable()
            await fetch(lastKnownPage.value)
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

async function pause() {
    if (!monitor) return
    $fetch('/api/monitor/pause', {
        method: 'POST',
        body: {
            id: monitor.id
        }
    })
        .then(async () => {
            useToast().add({
                title: 'Monitor paused',
                description: 'Your monitor has been paused successfully',
                icon: 'i-heroicons-check-pause',
                color: 'success'
            })
            await getUpdatedMonitor()
            await fetch(lastKnownPage.value)
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

async function resume() {
    if (!monitor) return
    $fetch('/api/monitor/resume', {
        method: 'POST',
        body: {
            id: monitor.id
        }
    })
        .then(async () => {
            useToast().add({
                title: 'Monitor resumed',
                description: 'Your monitor has been resumed successfully',
                icon: 'i-heroicons-check-play',
                color: 'success'
            })
            await getUpdatedMonitor()
            await fetch(lastKnownPage.value)
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
        await $fetch<Monitor>(`/api/monitor/${monitor?.id}`, {
            method: 'GET'
        }).then((res) => {
            if (res) {
                state.value.monitor_type = res.monitor_type
                state.value.name = res.name
                state.value.address = res.address
                state.value.polling_interval = res.polling_interval
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
        :description="dialogDescription"
        should-scale-background
        set-background-color-on-scale
    >
        <UButton
            v-if="openViaButton && width > 768"
            icon="i-heroicons-plus"
            color="success"
            variant="solid"
            :label="$t('new.monitor')"
        />
        <UButton
            v-if="openViaButton && width < 768"
            icon="i-heroicons-plus"
            color="success"
            variant="solid"
        />
        <template #header>
            <div class="flex w-full justify-between">
                <div>
                    <UBadge v-if="notAvailable" size="md" class="mb-2" variant="soft" color="error"
                        >{{ $t('paused') }}
                    </UBadge>
                    <h2 class="text-highlighted font-semibold">{{ dialogTitle }}</h2>
                    <p class="mt-1 text-muted text-sm">{{ dialogDescription }}</p>
                </div>
                <div class="inline-flex flex-row gap-2 h-fit">
                    <UButton
                        v-if="
                            !notAvailable &&
                            finalAction !== DialogActions.CREATE &&
                            finalAction !== DialogActions.EDIT
                        "
                        :disabled="formEditable"
                        type="button"
                        variant="outline"
                        class="font-bold"
                        color="info"
                        icon="i-heroicons-pause"
                        @click.prevent="pause"
                    />
                    <UButton
                        v-if="notAvailable && finalAction !== DialogActions.CREATE"
                        :disabled="formEditable"
                        type="button"
                        variant="outline"
                        class="font-bold"
                        color="info"
                        icon="i-heroicons-play"
                        @click.prevent="resume"
                    />
                    <UButton
                        v-if="finalAction === DialogActions.VIEW"
                        type="button"
                        variant="outline"
                        class="font-bold"
                        color="warning"
                        icon="i-heroicons-pencil-square"
                        @click.prevent="makeFormEditable"
                    />
                    <UButton
                        v-if="finalAction === DialogActions.VIEW"
                        type="button"
                        variant="outline"
                        class="font-bold"
                        color="error"
                        icon="i-heroicons-trash"
                        @click.prevent="unalive"
                    />
                </div>
            </div>
        </template>
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
                            <heartbeat-chart
                                v-if="beats"
                                :beats="beats"
                                :class="notAvailable ? 'opacity-50 pointer-events-none' : ''"
                            />
                            <uptime-chart
                                v-if="beats && monitor"
                                :id="monitor.id"
                                :beats="beats"
                                :class="notAvailable ? 'opacity-50 pointer-events-none' : ''"
                            />
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
                    <div class="col-span-1 flex justify-between md:col-span-2 lg:col-span-3">
                        <div
                            class="inline-flex flex-col md:gap-4 md:flex-row md:col-span-2 lg:col-span-3"
                        >
                            <UButton
                                v-if="formEditable && finalAction === DialogActions.CREATE"
                                type="button"
                                variant="outline"
                                class="font-bold"
                                color="success"
                                :label="$t('monitor.create')"
                                icon="i-heroicons-check"
                                @click.prevent="create"
                            />
                            <UButton
                                v-if="formEditable && finalAction === DialogActions.EDIT"
                                type="button"
                                variant="outline"
                                color="success"
                                :label="$t('monitor.update')"
                                class="font-bold"
                                icon="i-heroicons-check"
                                @click.prevent="update"
                            />
                            <UButton
                                v-if="finalAction === DialogActions.EDIT"
                                type="button"
                                variant="outline"
                                class="font-bold"
                                color="warning"
                                :label="$t('cancel')"
                                icon="i-heroicons-x-mark"
                                @click.prevent="makeFormNonEditable"
                            />
                        </div>
                    </div>
                </div>
            </LazyUForm>
        </template>
    </UDrawer>
</template>
