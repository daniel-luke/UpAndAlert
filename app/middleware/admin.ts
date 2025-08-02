import type {User as IUser} from "~~/server/modules/auth/models/User";

/**
 * @name admin
 * @description Middleware to check if the user is an admin
 * @since 1.0.0
 * @author Daniel Groothuis
 */
export default defineNuxtRouteMiddleware(() => {
    const { user } = useUserSession()
    const typedUser = user as Ref<IUser | null>;

    // redirect the user to the login screen if they're not authenticated
    if (!typedUser.value) {
        return navigateTo('/login')
    }

    if (!typedUser.value.is_admin) {
        return abortNavigation("You don't have permission to access this page");
    }
})
