<script setup lang="ts">
const props = defineProps({
    state: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update:state'])

function onFieldChange(field, value) {
    // Create a new object to avoid mutating the prop directly
    const newState = { ...props.state, [field]: value }
    emit('update:state', newState)
}
</script>

<template>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <h2 class="text-sm font-bold col-span-1 lg:col-span-2">
            {{ $t('notification.smtp.options') }}
        </h2>
        <UFormField name="host" label="Host" required>
            <UInput
                :value="state.hostname"
                class="w-full"
                placeholder="smtp.example.com"
                @input="onFieldChange('hostname', $event.target.value)"
            />
        </UFormField>
        <div class="grid grid-cols-2 gap-4">
            <UFormField name="port" label="Port" required>
                <UInputNumber
                    :value="state.port"
                    :ui="{ increment: 'hidden', decrement: 'hidden' }"
                    @input="onFieldChange('port', parseInt($event.target.value))"
                />
            </UFormField>
            <UFormField name="secure" label="Secure">
                <UCheckbox
                    :model-value="state.tls"
                    @update:model-value="onFieldChange('tls', $event)"
                />
            </UFormField>
        </div>
        <UFormField name="username" label="Username">
            <UInput
                :value="state.username"
                class="w-full"
                placeholder="user@example.com"
                @input="onFieldChange('username', $event.target.value)"
            />
        </UFormField>
        <UFormField name="password" label="Password">
            <UInput
                :value="state.password"
                type="password"
                class="w-full"
                placeholder="********"
                @input="onFieldChange('password', $event.target.value)"
            />
        </UFormField>
        <UFormField name="from" label="Sender" required>
            <UInput
                :value="state.from"
                type="email"
                class="w-full"
                @input="onFieldChange('from', $event.target.value)"
            />
        </UFormField>
        <UFormField name="to" label="Recipient" required>
            <UInput
                :value="state.to"
                type="email"
                class="w-full"
                @input="onFieldChange('to', $event.target.value)"
            />
        </UFormField>
        <UFormField name="cc" label="CC">
            <UInput
                :value="state.cc"
                type="email"
                class="w-full"
                placeholder="john@doe.com, jane@doe.com"
                @input="onFieldChange('cc', $event.target.value)"
            />
        </UFormField>
        <UFormField name="bcc" label="BCC">
            <UInput
                :value="state.bcc"
                type="email"
                class="w-full"
                placeholder="john@doe.com, jane@doe.com"
                @input="onFieldChange('bcc', $event.target.value)"
            />
        </UFormField>
    </div>
</template>

<style scoped></style>
