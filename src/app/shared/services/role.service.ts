import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ROLES_URL } from "src/app/core/constants/api-url-constans";
import { environment } from "src/environments/environment";
import { Role } from "../models/role.model";
import { ApiService } from "./api.service";

@Injectable()
export class RoleService {

    constructor
    (
        private apiService: ApiService
    ) {}

    getAllRoles(): Observable<Role[]> {
        return this.apiService.get<Role[]>(`${environment.api_url}${ROLES_URL}`);
    }
}