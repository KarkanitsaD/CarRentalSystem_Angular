import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { RENTAL_POINTS_PAGE } from "src/app/core/constants/page-constans";
import { AddRentalPointModel } from "src/app/shared/models/rental-point/add-rental-point.model";
import { GoogleMapService } from "src/app/shared/services/google-map.service";
import { RentalPointService } from "src/app/shared/services/rental-point.service";

@Component({
    selector: 'app-add-rental-point',
    templateUrl: './add-rental-point.component.html',
    styleUrls: ['./add-rental-point.component.css']
})
export class AddRentalPointComponent implements AfterViewInit {

    marker!: google.maps.Marker;

    @ViewChild('mapContainer', {static: false}) gmap!: ElementRef;
    public map!: google.maps.Map;
    public form = this.fb.group({
        title: ['', Validators.required],
        address: ['', Validators.required],
        country: ['', [Validators.required, Validators.pattern('^[A-ZА-Я][a-zа-я]+$')]],
        city: ['', [Validators.required, Validators.pattern('^[A-ZА-Я][a-zа-я]+$')]],
        locationX: [, [Validators.required]],
        locationY: [, Validators.required]
    });

    constructor
    (
        private fb: FormBuilder,
        private rpService: RentalPointService,
        private router: Router,
        private googleMapService: GoogleMapService
    ) {}

    ngAfterViewInit(): void {
        let defaultLocation = new google.maps.LatLng(0, 0);
        let mapOptions: google.maps.MapOptions = {
            center: defaultLocation,
            zoom: 2,
            };
        this.marker = new google.maps.Marker({
            position: defaultLocation});
        this.map = new google.maps.Map(this.gmap.nativeElement, 
        mapOptions);
        this.marker.setMap(this.map);

        this.map.addListener('click', (mapsMouseEvent) => {
            let coordinates = new google.maps.LatLng(mapsMouseEvent.latLng.lat(), mapsMouseEvent.latLng.lng());
            this.marker.setPosition(coordinates);
            this.form.controls['locationX'].setValue(coordinates.lat());
            this.form.controls['locationY'].setValue(coordinates.lng());
            let geocoder: google.maps.Geocoder = new google.maps.Geocoder();
            geocoder.geocode({location: coordinates}, (response) => {
                this.parseRentalPoint(response[0].formatted_address);
            });
        });
    }

    public addRentalPoint() {
        let locationX = Number(this.form.value.locationX);
        let locationY = Number(this.form.value.locationY);
        this.googleMapService.GetTimeOffset(locationX, locationY).then(res => {
            const offsetData = res.data;
            let offset =  offsetData.rawOffset;
            let addRentalPointModel: AddRentalPointModel = {
                title: this.form.value.title,
                address: this.form.value.address,
                country: this.form.value.country,
                city: this.form.value.city,
                locationX: locationX,
                locationY: locationY,
                timeOffset: Number(offset)
            };

            this.rpService.addRentalPoint(addRentalPointModel).subscribe(() => {
                this.router.navigate([RENTAL_POINTS_PAGE]);
            });
        });
    }

    private parseRentalPoint(fullAddress: string): void {
        let address = '';
        let city = '';
        let country = '';


        let parts = fullAddress.split(',');
        if(parts[0]) {
            address = parts[0].trim();
        }
        if(parts[parts.length - 1]) {
            country = parts[parts.length - 1].trim();
        }
        if(parts[parts.length - 2]) {
            city = parts[parts.length - 2].trim();
        }

        this.form.controls['address'].setValue(address);
        this.form.controls['city'].setValue(city);
        this.form.controls['country'].setValue(country);
    }
}