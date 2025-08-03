/**
 * @name User
 * @description User model
 * @since 1.0.0
 * @author Daniel Groothuis
 */
export interface User {
    id: number
    email: string
    password_hash: string
    first_name: string
    last_name: string
    is_admin: boolean
}
