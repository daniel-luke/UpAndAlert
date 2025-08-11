<script setup lang="ts">
import type { Notification } from '~/types/Notification'
import type { TableColumn } from '#ui/components/Table.vue'
import type { Row } from '@tanstack/vue-table'
import { UCheckbox } from '#components'
import BaseListView from '~/components/BaseListView.vue'
import type { User } from '#auth-utils'
import { userUserStore } from '~/stores/users'

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const loading = ref(true)
const userstore = userUserStore()
const { users } = storeToRefs(userstore)
const { fetch } = userstore

const emit = defineEmits(['edit'])

const columns: TableColumn<Notification>[] = [
    {
        accessorKey: 'id',
        header: '#',
        cell: ({ row }) => `#${row.getValue('id')}`
    },
    {
        accessorKey: 'first_name',
        header: 'First Name'
    },
    {
        accessorKey: 'last_name',
        header: 'Last Name'
    },
    {
        accessorKey: 'is_admin',
        header: 'Administrator',
        cell: ({ row }) =>
            h(UCheckbox, { modelValue: Boolean(row.getValue('is_admin')), disabled: true })
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
                editUser(row.getValue('id'))
            }
        },
        {
            label: 'Delete',
            icon: 'i-lucide-trash',
            onSelect() {
                deleteUser(row.getValue('id'))
            }
        }
    ]
}

function editUser(id: number) {
    emit('edit', id)
}

async function deleteUser(id: number) {
    await $fetch(`/api/user/admin/${id}`, {
        method: 'DELETE'
    })
        .then(() => {
            useToast().add({
                title: 'User deleted',
                description: 'The user has been deleted successfully.',
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
        :data="users as User[]"
        :columns="columns"
        empty="No users found"
        :sticky="true"
    />
</template>
