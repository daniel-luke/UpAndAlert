<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
    <UTooltip :text="$t('edit.profile')">
        <NuxtLink :to="localePath('/profile')">
            <UAvatar alt="DG" size="lg" />
        </NuxtLink>
    </UTooltip>
</template>
