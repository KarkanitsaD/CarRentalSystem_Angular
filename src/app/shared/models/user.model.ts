export interface User {
    id: string,
    email: string,
    name: string,
    surname: string,
    jwt: string,
    refreshToken: string,
    roles: string[]
}