import { User } from "./user.model";

export interface PageUserList {
    users: User[],
    itemsTotalCount: number
}