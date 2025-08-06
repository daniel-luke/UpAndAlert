<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const UButton = resolveComponent('UButton')
const UButtonGroup = resolveComponent('UButtonGroup')

type MonitorList = {
    id: number
    name: string
    monitor_type: string
    address: string
    polling_interval: number
    in_maintenance: boolean
}

const isLoading = ref(true)
const { data } = await useFetch<MonitorList[]>('/api/monitor/list')

const columns: TableColumn<MonitorList>[] = [
    {
        accessorKey: 'id',
        header: 'ID'
    },
    {
        accessorKey: 'name',
        header: 'Name'
    },
    {
        accessorKey: 'monitor_type',
        header: 'Type'
    },
    {
        accessorKey: 'address',
        header: 'Address'
    },
    {
        accessorKey: 'polling_interval',
        header: 'Interval'
    },
    {
        header: 'Actions',
        cell: ({ row }) => {
            const editAction = h(UButton, {
                variant: 'ghost',
                color: 'primary',
                icon: 'i-heroicons-pencil-square',
                label: 'Edit',
                tooltipText: 'Edit'
            })
            const deleteAction = h(UButton, {
                variant: 'ghost',
                color: 'error',
                icon: 'i-heroicons-trash',
                label: 'Delete',
                tooltipText: 'Delete',
                onClick: async () => {
                    await useFetch('/api/monitor/delete', {
                        method: 'POST',
                        body: { id: row.original.id }
                    })
                    await refreshNuxtData()
                }
            })
            return h(UButtonGroup, { size: 'xs' }, () => [editAction, deleteAction])
        }
    }
]
</script>

<template>
    <UTable :data="data" :columns="columns" :loading="isLoading" />
</template>
