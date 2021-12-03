import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { MANAGEMENT_PAGE_PATH, PAGE_NOT_FOUND_PATH, RENTAL_POINTS_PAGE } from "src/app/core/constants/page-constans";
import { RentalPoint } from "src/app/shared/models/rental-point/rental-point.model";
import { UpdateRentalPointModel } from "src/app/shared/models/rental-point/update-rental-point.model";
import { GoogleMapService } from "src/app/shared/services/google-map.service";
import { RentalPointService } from "src/app/shared/services/rental-point.service";

@Component({
    selector: 'app-update-rental-point',
    templateUrl: './update-rental-point.component.html',
    styleUrls: ['./update-rental-point.component.css']
})
export class UpdateRentalPointComponent implements AfterViewInit {   

    private rentalPointId!: string;

    public form!: FormGroup;
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

    ngAfterViewInit(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
            let id = params.get('rentalPointId');
            if(id === null) {
                this.router.navigate([PAGE_NOT_FOUND_PATH]);
            }
            else {
                this.rentalPointId = id;
                this.fillData(this.rentalPointId);
            }
        });
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
            let id = params.get('rentalPointId');
            if(id === null) {
                this.router.navigate([PAGE_NOT_FOUND_PATH]);
            }
            else {
                this.rentalPointId = id;
                this.fillData(this.rentalPointId);
            }
        });
    }

    private fillData(rpId: string): void {
        this.rentalPointService.getRentalPoint(rpId).subscribe(data => {
            this.form = this.fb.group({
                title: [data.title, Validators.required],
                country: [data.country, [Validators.required, Validators.pattern('^[A-ZА-Я][a-zа-я]+$')]],
                city: [data.city ],
                address: [data.address, [Validators.required]],
                locationX: [data.locationX, [Validators.required]],
                locationY: [data.locationY, Validators.required],
            });

            let location = new google.maps.LatLng(data.locationX, data.locationY);
            let mapOptions: google.maps.MapOptions = {
                zoom: 4,
                center: location
            };
            this.map = new google.maps.Map(this.gmap.nativeElement, mapOptions);
            this.marker = new google.maps.Marker({position: location});
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

    updateRentalPoint(){

        let locationX = Number(this.form.value.locationX);
        let locationY = Number(this.form.value.locationY);

        this.googleMapService.GetTimeOffset(locationX, locationY).then(res => {
            const offsetData = res.data;
            let offset =  offsetData.rawOffset;
            let updateRentalPointModel: UpdateRentalPointModel = {
                id: this.rentalPointId,
                title: this.form.value.title,
                address: this.form.value.address,
                country: this.form.value.country,
                city: this.form.value.city,
                locationX: locationX,
                locationY: locationY,
                timeOffset: Number(offset)
            };

            this.rentalPointService.updateRentalPoint(updateRentalPointModel).subscribe(() => {
                this.router.navigate([RENTAL_POINTS_PAGE]);
            });
        });
    }
}