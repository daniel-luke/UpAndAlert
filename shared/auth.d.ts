// auth.d.ts
declare module '#auth-utils' {
    interface User {
        id: number
        email: string
        password_hash: string
        first_name: string
        last_name: string
        is_admin: boolean
    }
}

export {}
