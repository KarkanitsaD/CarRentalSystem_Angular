import { HttpParams } from "@angular/common/http";
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { ADD_RENTAL_POINT_PATH, CARLIST_PAGE_PATH, PAGE_NOT_FOUND_PATH, RENTAL_POINTS_PAGE, UPDATE_RENTAL_POINT_PAGE_PATH } from "src/app/core/constants/page-constans";
import { RentalPointFiltrationModel } from "src/app/shared/models/rental-point/rental-point-filtration.model";
import { RentalPoint } from "src/app/shared/models/rental-point/rental-point.model";
import { LoginService } from "src/app/shared/services/login.service";
import { RentalPointService } from "src/app/shared/services/rental-point.service";

@Component({
    selector: 'app-rental-points',
    templateUrl: './rental-points.component.html',
    styleUrls: ['./rental-points.component.css']
})
export class RentalPointsComponent implements AfterViewInit {

    //filtration
    private querySubscription!: Subscription;
    public rpFiltrationModel!: RentalPointFiltrationModel;
    //filtration

    //maps options
    @ViewChild('mapContainer', {static: false}) gmap!: ElementRef;
    map!: google.maps.Map;
    coordinates = new google.maps.LatLng(0, 0);
    mapOptions: google.maps.MapOptions = {
     center: this.coordinates,
     zoom: 4,
    };
    markers: google.maps.Marker[] = new Array<google.maps.Marker>();
    public rentalPoints: RentalPoint[] = new Array<RentalPoint>();
    //maps options

    public canChooseCars: boolean = true;

    constructor
    (
        private router: Router,
        private route: ActivatedRoute,
        private rpService: RentalPointService,
        private loginService: LoginService
    ) {
        this.querySubscription = route.queryParams.subscribe(
            (queryParams: any) => {
                let rpFiltrationModel = queryParams['rpFiltartionModel'];
                if(rpFiltrationModel !== undefined) {
                    this.rpFiltrationModel = JSON.parse(rpFiltrationModel);
                }
                else if(!this.isAdmin()) {
                    this.router.navigate([PAGE_NOT_FOUND_PATH]);
                }
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
        this.canChooseCars = true;
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
        if(rpfilter !== undefined) {
            if(rpfilter.numberOfAvaliableCars != null) {
                params = params.append('numberOfAvailableCars', rpfilter.numberOfAvaliableCars);
            }
            if(rpfilter.countryId !== undefined && rpfilter.countryId !== '' && rpfilter.countryId !== null) {
                params = params.append('countryId', rpfilter.countryId);
            }
            if(rpfilter.cityId !== undefined && rpfilter.cityId !== '' && rpfilter.cityId !== null) {
                params = params.append('cityId', rpfilter.cityId);
            }
            if(rpfilter.keyHandOverTime !== undefined && rpfilter.keyReceivingTime !== undefined) {
                params = params.append('keyReceivingTime', new Date(rpfilter.keyReceivingTime.toString()).toJSON());
                params = params.append('keyHandOverTime', new Date(rpfilter.keyHandOverTime.toString()).toJSON());
            }
        }
        return params;
    }

    public onFiltered(rpModel: RentalPointFiltrationModel): void {
        this.rpFiltrationModel = rpModel;
        let httpParams = this.getHttpParams(this.rpFiltrationModel);
        this.filterRentalPoints(httpParams);
    }

    public onFiltrationChanged(): void {
        this.canChooseCars = false;
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

    isAdmin(): boolean {
        return this.loginService.getRole() === "Admin";
    }

    public showCars(rpId: string | undefined): void {
        if(rpId !== undefined && this.rpFiltrationModel !== undefined) {
            if(this.rpFiltrationModel.keyHandOverTime !== undefined && this.rpFiltrationModel.keyReceivingTime !== undefined) {
                let httpParams = new HttpParams();
                httpParams = httpParams.append('keyReceivingTime', this.rpFiltrationModel.keyReceivingTime.toString());
                httpParams = httpParams.append('keyHandOverTime', this.rpFiltrationModel.keyHandOverTime.toString());
                this.router.navigate([RENTAL_POINTS_PAGE, rpId, CARLIST_PAGE_PATH], { queryParams: { 
                'keyReceivingTime' : this.rpFiltrationModel.keyReceivingTime.toString(),
                'keyHandOverTime' : this.rpFiltrationModel.keyHandOverTime.toString()
            } });
            }
        }
        if(this.isAdmin()){
            this.router.navigate([RENTAL_POINTS_PAGE, rpId, CARLIST_PAGE_PATH]);
        }
    }
}