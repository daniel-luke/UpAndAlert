<script setup lang="ts">
const props = defineProps<{
    beats: {
        status: string
        created_at: string
        response_time: number
    }[]
}>()

const categories: Record<string, BulletLegendItemInterface> = {
    response_time: {
        name: 'Resp. time (in ms)',
        color: '#22c55e'
    }
}

interface AreaChartItem {
    created_at: string
    response_time: number
}

const AreaChartData: AreaChartItem[] = props.beats.map((beat) => {
    return {
        created_at: new Date(beat.created_at).toLocaleString(),
        response_time: Math.round(beat.response_time)
    }
})

const xFormatter = (tick: number): string => {
    return `${new Date(AreaChartData[tick]!.created_at).toLocaleString()}`
}
</script>

<template>
    <AreaChart
        class="lg:w-[75%]"
        :data="AreaChartData"
        :height="150"
        :categories="categories"
        :y-grid-line="false"
        :min-max-ticks-only="false"
        :y-num-ticks="2"
        :x-num-ticks="1"
        :x-formatter="xFormatter"
        :y-formatter="(tick: number) => `${tick}ms`"
        :legend-position="LegendPosition.Bottom"
        :hide-legend="false"
    />
</template>
