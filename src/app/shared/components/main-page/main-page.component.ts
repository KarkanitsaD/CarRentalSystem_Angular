import { Component } from "@angular/core";
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { RentalPointFiltrationModel } from "../../models/rental-point/rental-point-filtration.model";
import { Router } from "@angular/router";

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {

    rpFiltrationModel: RentalPointFiltrationModel = {
        numberOfAvaliableCars: 1,
        keyReceivingTime: new Date(),
        keyHandOverTime: new Date()
    }   

    constructor
    (
        private router: Router
    ) {}

    onFiltered(event: any){
        let rpFilteredModel = event as RentalPointFiltrationModel;
        this.router.navigate(['/rentalPoints'], { queryParams : { 'rpFiltartionModel': JSON.stringify(rpFilteredModel)}});
    }
}