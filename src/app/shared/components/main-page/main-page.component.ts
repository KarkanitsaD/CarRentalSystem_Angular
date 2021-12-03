import { Component } from "@angular/core";
import { RentalPointFiltrationModel } from "../../models/rental-point/rental-point-filtration.model";
import { Router } from "@angular/router";
import { TestService } from "../../services/test.service";

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {

    constructor
    (
        private router: Router,
        private testService: TestService
    ) {
        console.log(new Date());
        this.testService.testPost(new Date()).subscribe(data => {
            console.log(data);
        });
    }

    onFiltered(event: any) {
        let rpFilteredModel = event as RentalPointFiltrationModel;
        this.router.navigate(['/rentalPoints'], { queryParams : { 'rpFiltartionModel': JSON.stringify(rpFilteredModel)}});
    }
}