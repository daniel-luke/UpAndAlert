<script setup lang="ts">
import type { Notification } from '~/types/Notification'
import type { TableColumn } from '#ui/components/Table.vue'
import type { Row } from '@tanstack/vue-table'
import { UCheckbox } from '#components'
import BaseListView from '~/components/BaseListView.vue'

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const loading = ref(true)
const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)
const { fetch } = notificationStore

const emit = defineEmits(['edit'])

const columns: TableColumn<Notification>[] = [
    {
        accessorKey: 'id',
        header: '#',
        cell: ({ row }) => `#${row.getValue('id')}`
    },
    {
        accessorKey: 'name',
        header: 'Name'
    },
    {
        accessorKey: 'notification_type',
        header: 'Type'
    },
    {
        accessorKey: 'is_active',
        header: 'Active',
        cell: ({ row }) => h(UCheckbox, { modelValue: row.getValue('is_active'), disabled: true })
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            return h(
                'div',
                { class: 'text-right' },
                h(
                    UDropdownMenu,
                    {
                        content: {
                            align: 'end'
                        },
                        items: getRowItems(row),
                        'aria-label': 'Actions dropdown'
                    },
                    () =>
                        h(UButton, {
                            icon: 'i-lucide-ellipsis-vertical',
                            color: 'primary',
                            variant: 'ghost',
                            class: 'ml-auto',
                            'aria-label': 'Actions dropdown'
                        })
                )
            )
        }
    }
]

function getRowItems(row: Row<Notification>) {
    return [
        {
            label: 'Edit',
            icon: 'i-lucide-pencil',
            onSelect() {
                editNotification(row.getValue('id'))
            }
        },
        {
            label: 'Delete',
            icon: 'i-lucide-trash',
            onSelect() {
                deleteNotification(row.getValue('id'))
            }
        }
    ]
}

function editNotification(id: number) {
    emit('edit', id)
}

async function deleteNotification(id: number) {
    await $fetch(`/api/notification/${id}`, {
        method: 'DELETE'
    })
        .then(() => {
            useToast().add({
                title: 'Notification deleted',
                description: 'The notification has been deleted successfully.',
                icon: 'i-lucide-check-circle-2',
                color: 'success'
            })
            fetch()
        })
        .catch((error) => {
            useToast().add({
                title: 'Error',
                description: error.data.message,
                icon: 'i-lucide-x-circle',
                color: 'error'
            })
        })
}

onMounted(() => {
    fetch()
    loading.value = false
})
</script>

<template>
    <base-list-view
        :data="notifications as Notification[]"
        :columns="columns"
        empty="No notifications found"
        :sticky="true"
    />
</template>
