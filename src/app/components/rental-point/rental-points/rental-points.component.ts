import { HttpParams } from "@angular/common/http";
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { ADD_RENTAL_POINT_PATH, UPDATE_RENTAL_POINT_PAGE_PATH } from "src/app/core/constants/page-constans";
import { RentalPointFiltrationModel } from "src/app/shared/models/rental-point/rental-point-filtration.model";
import { RentalPoint } from "src/app/shared/models/rental-point/rental-point.model";
import { RentalPointService } from "src/app/shared/services/rental-point.service";

@Component({
    selector: 'app-rental-points',
    templateUrl: './rental-points.component.html',
    styleUrls: ['./rental-points.component.css']
})
export class RentalPointsComponent implements AfterViewInit {


    //filtration
    private querySubscription!: Subscription
    public rpFiltrationModel!: RentalPointFiltrationModel;
    //filtration

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

    markers: google.maps.Marker[] = new Array<google.maps.Marker>();

    public rentalPoints: RentalPoint[] = new Array<RentalPoint>();
    //maps options

    constructor
    (
        private router: Router,
        private route: ActivatedRoute,
        private rpService: RentalPointService
    ) {
        this.querySubscription = route.queryParams.subscribe(
            (queryParams: any) => {
                this.rpFiltrationModel = JSON.parse(queryParams['rpFiltartionModel']);
            }
        );
    }

    public addRentalPoint() {
        this.router.navigate([ADD_RENTAL_POINT_PATH]);
    }

    ngAfterViewInit(): void {
        this.map = new google.maps.Map(this.gmap.nativeElement, 
            this.mapOptions);
        let params = this.getHttpParams(this.rpFiltrationModel);
        this.filterRentalPoints(params);
    }

    private filterRentalPoints(httpParams?: HttpParams): void {
        this.rpService.getPageRentalPointsList(httpParams).subscribe(data => {
            this.rentalPoints = data.rentalPoints;
            this.updateMarkers();
        });
    }

    private setMapOnAll(map: google.maps.Map | null) {
        for (let i = 0; i < this.markers.length; i++) {
          this.markers[i].setMap(map);
        }
    }

    private updateMarkers(): void {
        this.setMapOnAll(null);
        this.markers = [];
        this.markers = this.rentalPoints.map<google.maps.Marker>(rp => {
            let coordinates = new google.maps.LatLng(rp.locationX, rp.locationY);
            return new google.maps.Marker({ position: coordinates, label: rp.title });
        });
        this.setMapOnAll(this.map);
    }

    private getHttpParams(rpfilter: RentalPointFiltrationModel): HttpParams {
        let params = new HttpParams();
        if(rpfilter.numberOfAvaliableCars != null) {
            params = params.append('numberOfAvailableCars', rpfilter.numberOfAvaliableCars);
        }
        if(rpfilter.countryId !== undefined) {
            params = params.append('countryId', rpfilter.countryId);
        }
        if(rpfilter.cityId !== undefined) {
            params = params.append('cityId', rpfilter.cityId);
        }
        // params = params.append('keyReceivingTime', rpfilter.keyReceivingTime.toString());
        // params = params.append('keyHandOverTime', rpfilter.keyHandOverTime.toString());
        debugger
        return params;
    }

    public onFiltered(rpModel: RentalPointFiltrationModel): void {
        let params = this.getHttpParams(rpModel);
        this.filterRentalPoints(params);
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