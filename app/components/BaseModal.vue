<!-- components/BaseModal.vue -->
<script setup lang="ts">
defineProps<{
    modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue'])

function close() {
    emit('update:modelValue', false)
}
</script>

<template>
    <transition name="fade">
        <div
            v-if="modelValue"
            class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs"
            @click.self="close"
        >
            <div
                class="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 w-full max-w-md"
                role="dialog"
                aria-modal="true"
            >
                <UButton
                    class="absolute top-4 right-4 text-gray-100 hover:text-gray-300"
                    @click="close"
                    variant="outline"
                    size="xl"
                    icon="i-heroicons-x-mark-20-solid"
                    aria-label="Close"
                >
                </UButton>
                <slot />
            </div>
        </div>
    </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
