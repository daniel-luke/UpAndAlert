<script setup lang="ts">
import UserList from '~/components/UserList.vue'

definePageMeta({
    middleware: ['authenticated', 'admin'],
    title: 'Users',
    layout: false
})

useHead({
    title: $t('users').concat(' - ').concat($t('app.name'))
})

const selectedUser: Ref<number | undefined> = ref(undefined)
const dialogOpen = ref(false)

provide('dialogOpen', dialogOpen)

const editUser = (id: number) => {
    selectedUser.value = id
    dialogOpen.value = true
}
</script>

<template>
    <NuxtLayout name="default">
        <page-header :title="$t('users')">
            <template #actions>
                <UDrawer
                    v-model:open="dialogOpen"
                    direction="bottom"
                    title="dialogTitle"
                    description="dialogDescription"
                    should-scale-background
                    set-background-color-on-scale
                    @close="selectedUser = undefined"
                >
                    <UButton
                        icon="i-heroicons-plus"
                        variant="solid"
                        :label="$t('user.create')"
                        type="button"
                    />
                    <template #body>
                        <user-dialog v-if="selectedUser" :id="selectedUser" />
                        <user-dialog v-else />
                    </template>
                </UDrawer>
            </template>
        </page-header>
        <user-list @edit="editUser" />
    </NuxtLayout>
</template>

<style scoped></style>
