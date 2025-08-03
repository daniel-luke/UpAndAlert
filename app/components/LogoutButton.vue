<script setup lang="ts">
const localePath = useLocalePath()
const { clear: clearSession } = useUserSession()

async function logout() {
    await clearSession()
    await navigateTo(localePath('/login'))
}
</script>

<template>
    <UTooltip :text="$t('logout')">
        <UButton icon="i-lucide-log-out" size="md" variant="ghost" @click="logout" />
    </UTooltip>
</template>
