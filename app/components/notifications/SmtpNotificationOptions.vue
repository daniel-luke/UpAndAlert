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
                @input="onFieldChange('hostname', $event.target.value)"
                placeholder="smtp.example.com"
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
                    @input="onFieldChange('tls', $event.target.checked)"
                />
            </UFormField>
        </div>
        <UFormField name="username" label="Username">
            <UInput
                :value="state.username"
                class="w-full"
                @input="onFieldChange('username', $event.target.value)"
                placeholder="user@example.com"
            />
        </UFormField>
        <UFormField name="password" label="Password">
            <UInput
                :value="state.password"
                type="password"
                class="w-full"
                @input="onFieldChange('password', $event.target.value)"
                placeholder="********"
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
                @input="onFieldChange('cc', $event.target.value)"
                placeholder="john@doe.com, jane@doe.com"
            />
        </UFormField>
        <UFormField name="bcc" label="BCC">
            <UInput
                :value="state.bcc"
                type="email"
                class="w-full"
                @input="onFieldChange('bcc', $event.target.value)"
                placeholder="john@doe.com, jane@doe.com"
            />
        </UFormField>
        <div class="col-span-1 lg:col-span-2 border-b-1 border-gray-200 dark:border-gray-600"></div>
        <div class="col-span-1 lg:col-span-2 text-lg font-bold">Message</div>
        <p class="col-span-1 lg:col-span-2 text-sm text-gray-500 dark:text-gray-400">
            You can use variables in the message. For example: <code>${monitor.name}</code> will be
            replaced with the monitor name. Available variables: <code>${monitor.name}</code>,
            <code>${monitor.url}</code>.
        </p>
        <UFormField class="lg:col-span-2" name="subject" label="Subject" required>
            <UInput
                :value="state.subject"
                type="text"
                class="w-full"
                @input="onFieldChange('subject', $event.target.value)"
                placeholder="Alert! Monitor ${monitor.name} is down!"
            />
        </UFormField>
        <UFormField class="lg:col-span-2" name="message" label="Message">
            <UTextarea
                :value="state.message"
                class="w-full"
                @input="onFieldChange('message', $event.target.value)"
                placeholder="Monitor ${monitor.name} is down!"
                :rows="5"
            />
        </UFormField>
    </div>
</template>

<style scoped></style>
