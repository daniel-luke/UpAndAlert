<script setup lang="ts">
const showLangModal = ref(false)
</script>

<template>
    <UTooltip :text="$t('switch.language')">
        <UButton
            icon="i-heroicons-language"
            variant="ghost"
            aria-label="Theme"
            @click="showLangModal = true"
        />
    </UTooltip>
    <language-modal v-model="showLangModal" />
</template>

<style scoped></style>
