import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import {  PAGE_NOT_FOUND_PATH, RENTAL_POINTS_PAGE } from "src/app/core/constants/page-constans";
import { CheckBoxItem } from "src/app/shared/components/custom-inputs/check-box-group/check-box-group.component";
import { RentalPointFormValues } from "src/app/shared/components/forms/rental-point/rental-point-form.component";
import { RentalPoint } from "src/app/shared/models/rental-point/rental-point.model";
import { UpdateRentalPointModel } from "src/app/shared/models/rental-point/update-rental-point.model";
import { GoogleMapService } from "src/app/shared/services/google-map.service";
import { RentalPointService } from "src/app/shared/services/rental-point.service";

@Component({
    selector: 'app-update-rental-point',
    templateUrl: './update-rental-point.component.html',
    styleUrls: ['./update-rental-point.component.css']
})
export class UpdateRentalPointComponent implements OnInit {   

    public rentalPointId!: string;
    private rentalPointCoordinates = new google.maps.LatLng(0, 0);

    mainForm: FormGroup = this.fb.group({
        rentalPoint: [, [Validators.required]]
    });

    public map!: google.maps.Map;

    @ViewChild('mapContainer', {static: false}) gmap!: ElementRef;
    public marker!: google.maps.Marker;

    constructor
    (
        private fb: FormBuilder,
        private rentalPointService: RentalPointService,
        private router: Router,
        private route: ActivatedRoute,
        private googleMapService: GoogleMapService
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
            let rentalPointId = params.get('rentalPointId');
            if(!rentalPointId) {
                this.router.navigate([PAGE_NOT_FOUND_PATH]);
            } else {
                this.rentalPointId = rentalPointId;
                this.rentalPointService.getRentalPoint(this.rentalPointId)
                    .subscribe(data =>{
                        this.fillRentalPointForm(data);
                        this.rentalPointCoordinates = new google.maps.LatLng(data.locationX, data.locationY);
                        this.setUpMap(this.rentalPointCoordinates);
                    });
            }
        });
    }

    ngAfterViewInit(): void {
        this.setUpMap(this.rentalPointCoordinates);
    }

    updateRentalPoint(){
        let formValues = this.mainForm.controls.rentalPoint.value as RentalPointFormValues;
        let locationX = formValues.locationX;
        let locationY = formValues.locationY

        this.googleMapService.GetTimeOffset(locationX, locationY).then(res => {
            const offsetData = res.data;
            let offset =  offsetData.rawOffset;
            let updateRentalPointModel: UpdateRentalPointModel = {
                id: this.rentalPointId,
                title: formValues.title,
                address: formValues.address,
                country: formValues.country,
                city: formValues.city,
                locationX: locationX,
                locationY: locationY,
                timeOffset: Number(offset)
            };

            this.rentalPointService.updateRentalPoint(updateRentalPointModel).subscribe(() => {
                this.router.navigate([RENTAL_POINTS_PAGE]);
            });
        });
    }

    private setUpMap(coordinates: google.maps.LatLng): void {
        let mapOptions: google.maps.MapOptions = { zoom: 4, center: coordinates };
        this.map = new google.maps.Map(this.gmap.nativeElement, mapOptions);
        this.marker = new google.maps.Marker({position: coordinates});
        this.marker.setMap(this.map);
    }

    private fillRentalPointForm(rentalPoint: RentalPoint): void {
        let rentalPointFormValues: RentalPointFormValues = {
            title: rentalPoint.title,
            country: rentalPoint.country,
            city: rentalPoint.city,
            address: rentalPoint.address,
            locationX: rentalPoint.locationX,
            locationY: rentalPoint.locationY                
        };
        this.mainForm.controls.rentalPoint.setValue(rentalPointFormValues);
    }
}