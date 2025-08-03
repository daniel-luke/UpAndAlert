<script setup lang="ts">
import { switchTheme } from '~/utils/global'

const colorMode = useColorMode()
</script>

<template>
    <UTooltip :text="$t('switch.theme')">
        <UButton
            :icon="colorMode.value === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'"
            size="lg"
            variant="ghost"
            @click="switchTheme"
        />
    </UTooltip>
</template>
