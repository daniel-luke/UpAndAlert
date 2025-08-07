<script setup lang="ts">
interface Props {
    beats: {
        status: string
        created_at: string
    }[]
}

const { beats } = defineProps<Props>()
</script>

<template>
    <div class="flex flex-row gap-1 overflow-x-hidden">
        <UTooltip
            v-for="beat in beats.slice(-28).reverse()"
            :key="beat.status"
            :delay-duration="0"
            :text="beat.created_at + ' - ' + (beat.status === 'up' ? $t('up') : $t('down'))"
        >
            <UBadge
                variant="solid"
                class="h-5"
                :color="beat.status === 'up' ? 'success' : 'error'"
            ></UBadge>
        </UTooltip>
    </div>
</template>
