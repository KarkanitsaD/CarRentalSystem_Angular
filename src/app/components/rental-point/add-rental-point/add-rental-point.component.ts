import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MANAGEMENT_PAGE_PATH } from "src/app/core/constants/page-constans";
import { RentalPoint } from "src/app/shared/models/rental-point.model";
import { RentalPointService } from "src/app/shared/services/rental-point.service";

@Component({
    selector: 'app-add-rental-point',
    templateUrl: './add-rental-point.component.html',
    styleUrls: ['./add-rental-point.component.css']
})
export class AddRentalPointComponent implements OnInit {

    marker!: google.maps.Marker;

    @ViewChild('mapContainer', {static: false}) gmap!: ElementRef;
    public map!: google.maps.Map;
    public form = this.fb.group({
        title: ['', Validators.required],
        address: ['', Validators.required],
        country: ['', Validators.required],
        city: ['', Validators.required],
        locationX: [0],
        locationY: [0]
    });

    constructor
    (
        private fb: FormBuilder,
        private rpService: RentalPointService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.ngAfterViewInit();
    }

    ngAfterViewInit(): void {
        this.mapInitializer();
      }

    mapInitializer(): void {
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
                console.log(response);
                this.parseRentalPoint(response[0].formatted_address);
            });
        });
      }

    public addRentalPoint(){
        let rentalPoint: RentalPoint = {
            title: this.form.value.title,
            address: this.form.value.address,
            country: this.form.value.country,
            city: this.form.value.city,
            locationX: this.form.value.locationX,
            locationY: this.form.value.locationY        
        };
        this.rpService.createRentalPoint(rentalPoint).subscribe(() => {
            this.router.navigate([MANAGEMENT_PAGE_PATH]);
        });
    }

    private parseRentalPoint(fullAddress: string): void {
        console.log(fullAddress);
        let parts = fullAddress.split(',');
        let address = parts[0].trim();
        let country = parts[parts.length - 1].trim();
        let city = parts[parts.length - 2].trim();
        // let city = parts[1].trim().split(' ')[0];

        this.form.controls['address'].setValue(address);
        this.form.controls['city'].setValue(city);
        this.form.controls['country'].setValue(country);
    }
}