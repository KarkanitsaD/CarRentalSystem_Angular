import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { RENTAL_POINTS_PAGE } from "src/app/core/constants/page-constans";
import { RentalPointFormValues } from "src/app/shared/components/forms/rental-point/rental-point-form.component";
import { AddRentalPointModel } from "src/app/shared/models/rental-point/add-rental-point.model";
import { GoogleMapService } from "src/app/shared/services/google-map.service";
import { RentalPointService } from "src/app/shared/services/rental-point.service";

export interface GeoCodingValues {
    country: string;
    city: string;
    address: string;
}

export interface MapClikcValues {
    country: string;
    city: string;
    address: string;
    locationX: number;
    locationY: number;
}

@Component({
    selector: 'app-add-rental-point',
    templateUrl: './add-rental-point.component.html',
    styleUrls: ['./add-rental-point.component.css']
})
export class AddRentalPointComponent implements AfterViewInit {

    mainForm: FormGroup = this.fb.group({
        rentalPoint: [, [Validators.required]]
    });

    marker!: google.maps.Marker;

    @ViewChild('mapContainer', {static: false}) gmap!: ElementRef;
    public map!: google.maps.Map;

    constructor
    (
        private fb: FormBuilder,
        private rpService: RentalPointService,
        private router: Router,
        private googleMapService: GoogleMapService
    ) {}

    ngAfterViewInit(): void {
        this.setUpMap();
    }

    public addRentalPoint() {
        let rentalPointFormValues = this.mainForm.controls.rentalPoint.value as RentalPointFormValues;
        let locationX = rentalPointFormValues.locationX;
        let locationY = rentalPointFormValues.locationY;

        this.googleMapService.GetTimeOffset(locationX, locationY).then(res => {
            const offsetData = res.data;
            let offset =  offsetData.rawOffset;
            let addRentalPointModel: AddRentalPointModel = {
                title: rentalPointFormValues.title,
                address: rentalPointFormValues.address,
                country: rentalPointFormValues.country,
                city: rentalPointFormValues.city,
                locationX: locationX,
                locationY: locationY,
                timeOffset: Number(offset)
            };
            this.rpService.addRentalPoint(addRentalPointModel).subscribe(() => {
                this.router.navigate([RENTAL_POINTS_PAGE]);
            });
        });
    }

    private setUpMap(): void {
        let defaultLocation = new google.maps.LatLng(0, 0);
        let mapOptions: google.maps.MapOptions = { center: defaultLocation, zoom: 2 };
        this.marker = new google.maps.Marker({ position: defaultLocation });
        this.map = new google.maps.Map(this.gmap.nativeElement, mapOptions);
        this.marker.setMap(this.map);
        this.map.addListener('click', (event) => this.onMapClick(event));
    }

    private onMapClick(event: google.maps.MapMouseEvent): void {
        let locationX = event.latLng.lat();
        let locationY = event.latLng.lng();
        let coordinate = new google.maps.LatLng(locationX, locationY);
        this.marker.setPosition(coordinate);

        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat: locationX, lng: locationY } }, (response) => {
            let geoCodingValues = this.parseGeoCodingValuesFromString(response[0].formatted_address);
            let rentalPointFormValues = this.mainForm.controls.rentalPoint.value;
            let rentalPointFormNewValues: RentalPointFormValues = {
                title: rentalPointFormValues ? rentalPointFormValues.title : '',
                country: geoCodingValues.country,
                city: geoCodingValues.city,
                address: geoCodingValues.address,
                locationX: locationX,
                locationY: locationY
            };
            this.mainForm.controls.rentalPoint.setValue(rentalPointFormNewValues);
        });
    }

    private parseGeoCodingValuesFromString(fullAddress: string): GeoCodingValues {
        let values: GeoCodingValues = { address: '', city: '', country: '' };
        let parts = fullAddress.split(',');
        if(parts[0]) {
            values.address = parts[0].trim();
        }
        if(parts[parts.length - 1]) {
            values.country = parts[parts.length - 1].trim();
        }
        if(parts[parts.length - 2]) {
            values.city = parts[parts.length - 2].trim();
        }
        return values;
    }
}