export default defineNuxtRouteMiddleware(() => {
    const { loggedIn } = useUserSession()
    const localePath = useLocalePath()

    // redirect the user to the login screen if they're not authenticated
    if (!loggedIn.value) {
        return navigateTo(localePath('/login'))
    }
})
