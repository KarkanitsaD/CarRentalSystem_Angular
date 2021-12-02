import { HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { USERS_PAGINATION_SIZE } from "src/app/core/constants/pagination-constans";
import { Role } from "src/app/shared/models/role.model";
import { User } from "src/app/shared/models/user/user.model";
import { RoleService } from "src/app/shared/services/role.service";
import { UserService } from "src/app/shared/services/user.service";
import { AddUpdateUserComponent } from "../add-update-user/add-update-user.component";


@Component({
    selector: 'app-management',
    templateUrl: './management.component.html',
    styleUrls: ['./management.component.css']
})
export class ManagementComponent implements OnInit{

    public roles!: Role[];
    public users!: User[];

    public filterForm = this.fb.group({
        name: [''],
        surname: [''],
        email: ['', Validators.email]
    });
    public itemsTotalCount: number = 0;
    public currentPageNumber: number = 1;

    constructor
    (
        private userService: UserService,
        private roleService: RoleService,
        private modalService: NgbModal,
        private fb: FormBuilder,
    ) {}

    ngOnInit(): void {
        this.roleService.getAllRoles().subscribe(data => {
            this.roles = data;
        });
        this.getPage(1);
    }

    showUpdateUserWindow(user: User): void {
        const modalRef = this.modalService.open(AddUpdateUserComponent, { centered: true });
        modalRef.componentInstance.user = user;
        modalRef.componentInstance.roles = this.roles;
        modalRef.result.then(() => {
            this.getPage(this.currentPageNumber);
        });
    }

    showAddUserWindow(): void {
        const modalRef = this.modalService.open(AddUpdateUserComponent, { centered: true });
        modalRef.componentInstance.roles = this.roles;
        modalRef.result.then(() => {
            this.getPage(this.currentPageNumber);
        });
    }

    deleteUser(user: User): void {
        this.userService.deleteUser(user.id).subscribe(data => this.getPage(this.currentPageNumber));
    }

    isAdmin(user: User): boolean {
        return user.role.title === 'Admin'
    }

    getPage(pageNumber: number): void {
        this.currentPageNumber = pageNumber;
        let params = new HttpParams();
        params = this.setPaginationParams(params, this.currentPageNumber);
        params = this.setFilterParams(params);
        this.userService.getPageUserList(params).subscribe(data => {
            this.itemsTotalCount = data.itemsTotalCount;
            this.users = data.users;
        });
    }

    private setPaginationParams(params: HttpParams, pageNumber: number): HttpParams {
        params = params.append('pageIndex', pageNumber - 1);
        params = params.append('pageSize', USERS_PAGINATION_SIZE);
        return params;
    }

    private setFilterParams(params: HttpParams): HttpParams {
        if(this.filterForm.value.name != null && (this.filterForm.value.name as string).trim() != '') {
            params = params.append('name', this.filterForm.value.name);
        }
        if(this.filterForm.value.surname != null && (this.filterForm.value.surname as string).trim() != '') {
            params = params.append('surname', this.filterForm.value.surname);
        }
        if(this.filterForm.value.email != null && (this.filterForm.value.email as string).trim() != '') {
            params = params.append('email', Number(this.filterForm.value.email));
        }

        return params;
    }
}