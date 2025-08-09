<script setup lang="ts">
import type { TableColumn } from '#ui/components/Table.vue'
import { useElementSize, useWindowSize } from '@vueuse/core'
import type { Notification } from '~/types/Notification'

const { data, columns } = defineProps<{
    data: Notification[]
    columns: TableColumn<Notification>[]
    empty: string
    sticky: boolean
}>()

const el = useTemplateRef('tableContainer')
const { height: containerHeight } = useElementSize(el)

const { height: windowHeight } = useWindowSize()

const maxContentHeight = computed(() => {
    return windowHeight.value - 64 + 'px'
})
</script>

<template>
    <div ref="tableContainer" :style="{ height: maxContentHeight }">
        <div class="flex flex-1">
            <UTable
                :data="data"
                :columns="columns"
                class="w-full"
                :sticky="sticky"
                :style="{ height: containerHeight + 'px' }"
                :empty="empty"
            />
        </div>
    </div>
</template>
