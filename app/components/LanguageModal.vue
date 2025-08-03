<script setup lang="ts">
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import BaseModal from './BaseModal.vue'

const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const props = defineProps<{
    modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue'])

const languages = [
    { code: 'en', label: 'English', icon: 'GB' },
    { code: 'nl', label: 'Nederlands', icon: 'NL' }
]

const open = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

async function selectLanguage(code: string) {
    switch (code) {
        case 'en':
            await navigateTo(switchLocalePath('en'))
            window.location.reload()
            break
        case 'nl':
            await navigateTo(switchLocalePath('nl'))
            window.location.reload()
            break
    }
    emit('update:modelValue', false)
}
</script>

<template>
    <BaseModal v-model="open">
        <h2 class="text-lg font-semibold mb-4">{{ $t('select.language') }}</h2>
        <ul>
            <li v-for="lang in languages" :key="lang.code" class="mb-2">
                <UButton
                    variant="link"
                    class="w-full text-left px-4 py-2 text-lg font-semibold"
                    :class="{ 'bg-primary-100 dark:bg-neutral-700': lang.code === locale }"
                    @click="selectLanguage(lang.code)"
                >
                    {{ getUnicodeFlagIcon(lang.icon) }} {{ lang.label }}
                </UButton>
            </li>
        </ul>
    </BaseModal>
</template>
