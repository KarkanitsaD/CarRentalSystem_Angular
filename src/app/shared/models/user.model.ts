export interface User {
    id: string,
    email: string,
    name: string,
    jwt: string,
    refreshToken: string,
    roles: string[]
}