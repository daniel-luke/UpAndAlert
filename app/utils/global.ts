/**
 * Logout the user
 *
 */
export async function logout() {
    const localePath = useLocalePath()
    const { clear: clearSession } = useUserSession()

    await clearSession()
    await navigateTo(localePath('/login'))
}

/**
 * Switch the theme between dark and light
 */
export function switchTheme() {
    const colorMode = useColorMode()
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
