// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import jsdoc from 'eslint-plugin-jsdoc'

export default withNuxt([eslintPluginPrettierRecommended], {
    files: ['**/*.ts'],
    plugins: {
        jsdoc
    },
    rules: {
        'jsdoc/require-jsdoc': 'error',
        'jsdoc/require-param': 'error',
        'jsdoc/require-returns': 'error',
        'jsdoc/require-throws': 'error',
        'vue/require-default-prop': 'off'
    }
})
