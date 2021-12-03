import { Router } from "@angular/router";
import { RentalPoint } from "src/app/shared/models/rental-point/rental-point.model";
import { RentalPointService } from "src/app/shared/services/rental-point.service";
import { OnInit, Component, ViewChild, ElementRef } from 
'@angular/core';
import { UPDATE_RENTAL_POINT_PAGE_PATH } from "src/app/core/constants/page-constans";
import { HttpParams } from "@angular/common/http";

@Component({
    selector: 'app-rental-point-list',
    templateUrl: './rental-point-list.component.html',
    styleUrls: ['./rental-point-list.component.css']
})
export class RentalPointListComponent implements OnInit {

    //maps options
    @ViewChild('mapContainer', {static: false}) gmap!: ElementRef;
    map!: google.maps.Map;

    lat = 0;
    lng = 0;

    coordinates = new google.maps.LatLng(this.lat, this.lng);

    mapOptions: google.maps.MapOptions = {
     center: this.coordinates,
     zoom: 4,
    };

    marker = new google.maps.Marker({
      position: this.coordinates,
      map: this.map,
    });
    //maps options

    public rentalPoints: RentalPoint[] = new Array<RentalPoint>();

    constructor 
    (
        private router: Router,
        private rpService: RentalPointService
    ) {}

    ngOnInit(): void {
        let params = new HttpParams();
        params = params.append('PageIndex', 0);
        params = params.append('PageSize', 10);
        this.rpService.getPageRentalPointsList(params).subscribe(data => {
            this.rentalPoints = data.rentalPoints;
            this.ngAfterViewInit();
        });
    }

    ngAfterViewInit() {
        this.mapInitializer();
      }
  
    mapInitializer() {
        this.map = new google.maps.Map(this.gmap.nativeElement, 
        this.mapOptions);
        this.rentalPoints.forEach(rp => {
                let coordinates = new google.maps.LatLng(rp.locationX, rp.locationY);
                let marker = new google.maps.Marker({position: coordinates, map: this.map, label: rp.title});
        });
      } 

    deleteRentalPoint(id: string | undefined) {
          if(id !== undefined) {
            this.rpService.deleteRentalPoint(id).subscribe();
          }
      }

    updateRentalPoint(id: string | undefined) {
      if(id !== undefined) {
        this.router.navigate([UPDATE_RENTAL_POINT_PAGE_PATH, id]);
      }
    }
}