import { resolve } from 'pathe'

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    ssr: false,
    devtools: { enabled: process.env.NODE_ENV === 'development' },
    modules: [
        '@nuxt/eslint',
        '@nuxt/ui',
        '@pinia/nuxt',
        'nuxt-auth-utils',
        '@nuxtjs/i18n',
        '@pinia/nuxt',
        'nuxt-charts'
    ],
    css: ['~/assets/css/main.css'],
    i18n: {
        locales: [
            { code: 'en', file: 'en/messages.json' },
            { code: 'nl', file: 'nl/messages.json' }
        ],
        defaultLocale: 'en',
        langDir: resolve(__dirname, 'i18n/locales')
    },
    nitro: {
        publicAssets: [
            {
                baseURL: '/_i18n', // <--- This matches the fetch path
                dir: resolve(__dirname, 'i18n/locales')
            }
        ],
        experimental: {
            websocket: true
        }
    }
})
