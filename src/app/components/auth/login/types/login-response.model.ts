export interface LoginResponseModel {
    id: string;
    email: string;
    name?: string;
    jwt: string;
    refreshToken: string;
}