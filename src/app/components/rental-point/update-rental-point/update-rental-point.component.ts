import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { MANAGEMENT_PAGE_PATH, PAGE_NOT_FOUND_PATH } from "src/app/core/constants/page-constans";
import { RentalPoint } from "src/app/shared/models/rental-point/rental-point.model";
import { RentalPointService } from "src/app/shared/services/rental-point.service";

@Component({
    selector: 'app-update-rental-point',
    templateUrl: './update-rental-point.component.html',
    styleUrls: ['./update-rental-point.component.css']
})
export class UpdateRentalPointComponent implements AfterViewInit{   

    private rentalPointId!: string;

    public updateForm!: FormGroup;
    public map!: google.maps.Map;
    @ViewChild('mapContainer', {static: false}) gmap!: ElementRef;
    public marker!: google.maps.Marker;

    constructor
    (
        private fb: FormBuilder,
        private rentalPointService: RentalPointService,
        private router: Router,
        private route: ActivatedRoute
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
            this.updateForm = this.fb.group({
                title: [data.title],
                country: [data.country],
                city: [data.city],
                address: [data.address],
                locationX: [data.locationX],
                locationY: [data.locationY],
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
                this.updateForm.controls['locationX'].setValue(coordinates.lat());
                this.updateForm.controls['locationY'].setValue(coordinates.lng());
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

        this.updateForm.controls['address'].setValue(address);
        this.updateForm.controls['city'].setValue(city);
        this.updateForm.controls['country'].setValue(country);
    }

    updateRentalPoint(){
        let rentalPoint: RentalPoint = {
            id: this.rentalPointId,
            title: this.updateForm.value.title,
            address: this.updateForm.value.address,
            country: this.updateForm.value.country,
            city: this.updateForm.value.city,
            locationX: this.updateForm.value.locationX,
            locationY: this.updateForm.value.locationY    
        };
        this.rentalPointService.updateRentalPoint(rentalPoint).subscribe(() => {
            this.router.navigate([MANAGEMENT_PAGE_PATH]);
        });
    }
}