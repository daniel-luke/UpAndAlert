/**
 * @name logged-in
 * @description Redirects the user to the login page if they're not authenticated.
 * @since 1.0.0
 * @author Daniel Groothuis
 */
export default defineNuxtRouteMiddleware(() => {
    const { loggedIn } = useUserSession()
    const localePath = useLocalePath()

    // redirect the user to the login screen if they're not authenticated
    if (!loggedIn.value) {
        return navigateTo(localePath('/login'))
    }
})
