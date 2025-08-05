/**
 * @name admin
 * @description Middleware to check if the user is an admin
 * @since 1.0.0
 * @author Daniel Groothuis
 */
export default defineNuxtRouteMiddleware(() => {
    const { user } = useUserSession()

    // redirect the user to the login screen if they're not authenticated
    if (!user.value) {
        return navigateTo('/login')
    }

    if (!user.value.is_admin) {
        return abortNavigation("You don't have permission to access this page")
    }
})
