import { Role } from "../role.model";

export interface AddUpdateUserModel {
    id?: string,
    email: string,
    name?: string,
    surname?: string,
    password?: string,
    role: Role
}