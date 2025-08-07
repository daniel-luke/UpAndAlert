<script lang="ts" setup>
const props = defineProps({
    id: {
        type: Number,
        required: true
    }
})

type UptimeResponse = {
    up: number
    down: number
}
const data = await useFetch<UptimeResponse>('/api/monitor/uptime/' + props.id).then((res) => {
    console.log(res)
    return [
        {
            color: '#f75555',
            name: 'Downtime',
            value: Math.round(res.data.value?.down || 0).toFixed(3)
        },
        {
            color: '#22c55e',
            name: 'Uptime',
            value: Math.round(res.data.value?.up || 0).toFixed(3)
        }
    ]
})
</script>
<template>
    <div class="relative">
        <DonutChart
            :data="data.map((i) => i.value)"
            :labels="data"
            :height="150"
            :hide-legend="true"
            :radius="0"
        >
            <div class="absolute text-center">
                <div class="font-semibold">Uptime in %</div>
            </div>
        </DonutChart>
    </div>
</template>
