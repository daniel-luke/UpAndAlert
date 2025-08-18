<script setup lang="ts">
interface Props {
    beats:
        | {
              status: string
              created_at: string
              response_time: number
          }[]
        | undefined
}

const { beats } = defineProps<Props>()
const isLoading = ref(true)
onMounted(() => {
    isLoading.value = false
})
</script>

<template>
    <div>
        <div v-if="beats" class="flex flex-row gap-1 overflow-x-hidden">
            <UTooltip
                v-for="beat in beats.slice(-14).reverse()"
                :key="beat.status"
                :delay-duration="0"
                :text="
                    new Date(beat.created_at).toLocaleString() +
                    ' - ' +
                    Math.round(beat.response_time) +
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
        </div>
        <USkeleton v-else class="h-2 w-14" />
    </div>
</template>
