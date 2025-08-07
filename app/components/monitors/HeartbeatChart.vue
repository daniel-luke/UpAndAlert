<script setup lang="ts">
const data = [{ respTime: 50 }, { respTime: 50 }, { respTime: 50 }, { respTime: 50 }]

const categories = {
    respTime: {
        name: 'Resp. Time (ms)',
        color: '#10b981'
    }
}

const xFormatter = (i) => data[i].month
</script>

<template>
    <LineChart
        :data="data"
        :categories="categories"
        :height="150"
        :xFormatter="xFormatter"
        xLabel="Month"
    />
</template>
