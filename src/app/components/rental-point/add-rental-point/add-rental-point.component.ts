import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";

@Component({
    selector: 'app-add-rental-point',
    templateUrl: './add-rental-point.component.html',
    styleUrls: ['./add-rental-point.component.css']
})
export class AddRentalPointComponent {

    constructor
    (
        private fb: FormBuilder
    ) {}
}