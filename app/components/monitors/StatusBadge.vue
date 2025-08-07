<script setup lang="ts">
import type { Monitor } from '~~/server/modules/monitoring/models/Monitor'

interface Props {
    monitor: Monitor
    lastStatus: string
}

const { monitor, lastStatus } = defineProps<Props>()
</script>

<template>
    <UBadge
        v-if="!monitor.in_maintenance"
        :color="lastStatus === $t('up') ? 'success' : 'error'"
        variant="solid"
        class="font-bold capitalize"
        >{{ lastStatus }}
    </UBadge>
    <UBadge
        v-else-if="monitor.in_maintenance && monitor.is_active"
        color="info"
        variant="solid"
        class="font-bold capitalize"
        >{{ $t('maintenance') }}
    </UBadge>
    <UBadge
        v-else-if="!monitor.is_active"
        color="warning"
        variant="solid"
        class="font-bold capitalize"
        >{{ $t('disabled') }}
    </UBadge>
</template>
