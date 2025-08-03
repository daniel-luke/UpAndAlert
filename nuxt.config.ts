// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt', 'nuxt-auth-utils', '@nuxtjs/i18n'],
    css: ['~/assets/css/main.css'],
    i18n: {
        locales: [
            { code: 'en', name: 'English', file: 'en.json' },
            { code: 'nl', name: 'Nederlands', file: 'nl.json' }
        ],
        defaultLocale: 'en',
        strategy: 'prefix_except_default'
    }
})
