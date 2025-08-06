<script setup lang="ts">
import type { DropdownMenuItem } from '#ui/components/DropdownMenu.vue'
import type { User } from '~~/server/modules/auth/models/User'
import { logout, switchTheme } from '~/utils/global'

const localePath = useLocalePath()
const { user } = useUserSession()

const showLangModal = ref(false)

const typedUser = user as Ref<User | null>
let alt: string | undefined = undefined
if (typedUser.value) {
    alt =
        typedUser.value.first_name?.toString().charAt(0) +
        typedUser.value.last_name?.toString().charAt(0)
}

const items = ref<DropdownMenuItem[][]>([
    [
        {
            label: `${typedUser.value?.first_name} ${typedUser.value?.last_name}`,
            avatar: {
                text: alt
            },
            type: 'label'
        }
    ],
    [
        {
            label: $t('profile'),
            icon: 'i-lucide-user',
            to: localePath('/profile')
        },
        {
            label: 'Open action bar',
            icon: 'i-lucide-terminal',
            kbds: ['.'],
            onSelect: () => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: '.' }))
            }
        }
    ],
    [
        {
            label: 'Report a bug',
            icon: 'i-lucide-bug',
            to: 'https://github.com/daniel-luke/UpAndAlert/issues/new',
            target: '_blank'
        },
        {
            label: 'Documentation',
            icon: 'i-lucide-circle-help',
            to: 'https://github.com/daniel-luke/UpAndAlert/wiki',
            target: '_blank'
        },
        {
            label: 'Check for updates',
            icon: 'i-lucide-refresh-cw',
            to: 'https://github.com/daniel-luke/UpAndAlert/releases',
            target: '_blank',
            disabled: true
        }
    ],
    [
        {
            label: $t('switch.language'),
            icon: 'i-lucide-languages',
            onSelect: () => {
                showLangModal.value = true
            }
        },
        {
            label: $t('switch.theme'),
            icon: 'i-lucide-moon-star',
            onSelect: () => {
                switchTheme()
            }
        },
        {
            label: $t('logout'),
            icon: 'i-lucide-log-out',
            onSelect: () => {
                logout()
            }
        }
    ]
])
</script>

<template>
    <UTooltip :text="$t('edit.profile')">
        <UDropdownMenu
            v-if="typedUser"
            :items="items"
            :ui="{
                content: 'w-48'
            }"
        >
            <UAvatar :text="alt" size="lg" class="hover:cursor-pointer" />
        </UDropdownMenu>
    </UTooltip>
    <language-modal v-model="showLangModal" />
</template>
