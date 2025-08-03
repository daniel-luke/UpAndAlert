<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed({
    get() {
        return colorMode.value === 'dark'
    },
    set(_isDark) {
        colorMode.preference = _isDark ? 'dark' : 'light'
    }
})
</script>

<template>
    <UTooltip :text="$t('switch.theme')">
        <UButton
            :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
            size="lg"
            variant="ghost"
            @click="isDark = !isDark"
        />
    </UTooltip>
</template>
