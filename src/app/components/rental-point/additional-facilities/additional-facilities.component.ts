import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators, } from "@angular/forms";
import { AddAdditionalFacilityModel } from "src/app/shared/models/additional-facility/add-additional-facility.model";
import { AdditionalFacility } from "src/app/shared/models/additional-facility/additional-facility.model";
import { UpdateAdditionalFacilityModel } from "src/app/shared/models/additional-facility/update-additional-facility.model";
import { AdditionalFacilityService } from "src/app/shared/services/additional-facility.service";


@Component({
    selector: 'app-additional-facilities',
    styleUrls: ['additional-facilities.component.css'],
    templateUrl: 'additional-facilities.component.html'
}) export class AdditionalFacilitiesComponent implements OnInit {

    @Input() rentalPointId!: string;

    addFacilityForm = this.formBuilder.group({
        title: [, [Validators.required]],
        price: [, [Validators.required]]
    });

    form = this.formBuilder.group({
        facilities: this.formBuilder.array([])
    });
    facilities: AdditionalFacility[] = [];


    addButtonActive = true;

    constructor
    (
        private formBuilder: FormBuilder,
        private additionalFacilityService: AdditionalFacilityService
    ) {}

    ngOnInit(): void {
        if(this.rentalPointId) {
            this.additionalFacilityService.getAdditionalFacilityByRentalPointId(this.rentalPointId)
            .subscribe(data => {
                this.facilities = data;
                data.forEach(af => {
                    const facilityForm = this.formBuilder.group({
                        title: [af.title, Validators.required],
                        price: [af.price, Validators.required]
                    });
                    this.facilitiesFormArray.push(facilityForm);
                });
            });
        }
    }

    get facilitiesFormArray() {
        return this.form.controls['facilities'] as FormArray;
    }

    getFacilitiesFormArrayGroup(index: number) {
        return this.facilitiesFormArray.controls[index] as FormGroup;
    }

    isValidFacilityForm(index: number) {
        return this.getFacilitiesFormArrayGroup(index).valid;
    }

    isFormTouched(index: number): boolean {
        return (this.getFacilitiesFormArrayGroup(index) as FormGroup).touched;
    }

    removeFacility(index: number): void {
        let facilityToDelete = this.facilities[index];
        this.additionalFacilityService.deleteAdditionalFacility(facilityToDelete.id)
        .subscribe(() => {
            this.facilities = this.facilities.filter(f => f.id != facilityToDelete.id);
            this.facilitiesFormArray.removeAt(index);
        });
    }

    addFacility(): void {
        let price = this.addFacilityForm.controls.price.value;
        let title = this.addFacilityForm.controls.title.value;
        let addAdditionalFacilityModel: AddAdditionalFacilityModel = {
            price: price,
            title: title,
            rentalPointId: this.rentalPointId
        };

        this.additionalFacilityService.createAdditionalFacility(addAdditionalFacilityModel)
        .subscribe(data => {
            this.facilities.push(data);
            const facilityForm = this.formBuilder.group({
                title: [data.title, Validators.required],
                price: [data.price, Validators.required]
            });
            this.facilitiesFormArray.push(facilityForm);
            this.addFacilityForm.controls.title.setValue(null);
            this.addFacilityForm.controls.price.setValue(null);
            this.addButtonActive = true;
        });
    }

    updateFacility(index: number): void {
        let facilityForm = (this.form.controls['facilities'] as FormArray).controls[index] as FormGroup;
        let price = facilityForm.controls.price.value;
        let title = facilityForm.controls.title.value;

        let facilityToUpdate = this.facilities[index];
        let updateFacilityModel: UpdateAdditionalFacilityModel = {
            price: price,
            title: title,
            id: facilityToUpdate.id
        };

        this.additionalFacilityService.updateAdditionalFacility(updateFacilityModel)
        .subscribe(data => {
            facilityToUpdate.price = price;
            facilityToUpdate.title = title;
            this.getFacilitiesFormArrayGroup(index).markAsUntouched();
        });

    }
}