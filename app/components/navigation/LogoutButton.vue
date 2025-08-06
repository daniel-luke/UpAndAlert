<script setup lang="ts">
import { logout } from '~/utils/global'
</script>

<template>
    <UTooltip :text="$t('logout')">
        <UButton icon="i-lucide-log-out" size="md" variant="ghost" @click="logout" />
    </UTooltip>
</template>
