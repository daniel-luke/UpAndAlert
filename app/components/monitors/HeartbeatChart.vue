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
    status: string
    created_at: string
    response_time: number
}

const AreaChartData: AreaChartItem[] = props.beats

//const xFormatter = (i: number): string | number => ``

const xFormatter = (tick: number): string => {
    return `${AreaChartData[tick]?.created_at}`
    return `${AreaChartData[tick]?.created_at}`
}

const yFormatter = (tick: number): string => {
    return `${AreaChartData[tick]?.response_time}`
}

onMounted(() => {
    console.log(AreaChartData)
})
</script>

<template>
    <AreaChart
        class="lg:w-[75%]"
        :data="AreaChartData"
        :height="150"
        :categories="categories"
        :y-grid-line="false"
        :min-max-ticks-only="true"
        :y-num-ticks="1"
        :x-num-ticks="1"
        :x-formatter="xFormatter"
        :legend-position="LegendPosition.Bottom"
        :hide-legend="false"
    />
</template>
