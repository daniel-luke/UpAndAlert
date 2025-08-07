<script setup lang="ts">
interface Props {
    beats: {
        status: string
        created_at: string
        response_time: number
    }[]
}

const { beats } = defineProps<Props>()
const isLoading = ref(true)
onMounted(() => {
    isLoading.value = false
})
</script>

<template>
    <div class="flex flex-row gap-1 overflow-x-hidden">
        <UTooltip
            v-if="!isLoading"
            v-for="beat in beats.slice(-14).reverse()"
            :key="beat.status"
            :delay-duration="0"
            :text="
                beat.created_at +
                ' - ' +
                beat.response_time +
                'ms - ' +
                (beat.status === 'up' ? $t('up') : $t('down'))
            "
        >
            <UBadge
                variant="solid"
                class="h-2 min-w-5"
                :color="beat.status === 'up' ? 'success' : 'error'"
            ></UBadge>
        </UTooltip>
        <USkeleton v-else v-for="i in 14" class="h-2 min-w-5" :key="i" />
    </div>
</template>
