import { HttpParams } from "@angular/common/http";
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { ADD_RENTAL_POINT_PATH, CARLIST_PAGE_PATH, PAGE_NOT_FOUND_PATH, RENTAL_POINTS_PAGE, UPDATE_RENTAL_POINT_PAGE_PATH } from "src/app/core/constants/page-constans";
import { RentalPointFiltrationModel } from "src/app/shared/models/rental-point/rental-point-filtration.model";
import { RentalPoint } from "src/app/shared/models/rental-point/rental-point.model";
import { LoginService } from "src/app/shared/services/login.service";
import { MapService } from "src/app/shared/services/map.service";
import { RentalPointService } from "src/app/shared/services/rental-point.service";

@Component({
    selector: 'app-rental-points',
    templateUrl: './rental-points.component.html',
    styleUrls: ['./rental-points.component.css']
})
export class RentalPointsComponent implements AfterViewInit {

    markerImage = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";

    public spinner: boolean = true;

    //filtration
    private querySubscription!: Subscription;
    public rpFiltrationModel!: RentalPointFiltrationModel;
    //filtration

    //maps options
    @ViewChild('mapContainer', {static: false}) gmap!: ElementRef;
    map!: google.maps.Map;
    coordinates = new google.maps.LatLng(53.669933, 23.815113);
    mapOptions: google.maps.MapOptions = {}
    markers: google.maps.Marker[] = new Array<google.maps.Marker>();
    public rentalPoints: RentalPoint[] = new Array<RentalPoint>();
    //maps options

    constructor
    (
        private router: Router,
        private route: ActivatedRoute,
        private rpService: RentalPointService,
        private loginService: LoginService,
        private mapService: MapService
    ) {
        this.querySubscription = this.route.queryParams.subscribe(
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

    ngAfterViewInit(): void {
        this.map = new google.maps.Map(this.gmap.nativeElement,
            this.mapOptions);
        let params = this.getHttpParams(this.rpFiltrationModel);
        this.filterRentalPoints(params);
    }

    private filterRentalPoints(httpParams?: HttpParams): void {
        this.spinner = true;
        this.rpService.getPageRentalPointsList(httpParams).subscribe(data => {
            this.rentalPoints = data.rentalPoints;
            this.updateMarkers();
            this.mapService.centerAndZoomMap(this.map, this.markers);
            this.spinner = false;
        });
    }

    private setMapOnAll(map: google.maps.Map | null) {
        for (let i = 0; i < this.markers.length; i++) {
          this.markers[i].setMap(map);
          this.markers[i].addListener('click', event => {
            this.setCenterMapLocation(event.latLng);
          });
        }
    }

    private updateMarkers(): void {
        this.setMapOnAll(null);
        this.markers = [];
        this.markers = this.rentalPoints.map<google.maps.Marker>(rp => {
            let coordinates = new google.maps.LatLng(rp.locationX, rp.locationY);
            return new google.maps.Marker({ position: coordinates, title: rp.title, icon: this.markerImage });
        });
        this.setMapOnAll(this.map);
    }

    private getHttpParams(rpfilter: RentalPointFiltrationModel): HttpParams {
        let params = new HttpParams();
        if(rpfilter !== undefined) {
            if(rpfilter.numberOfAvaliableCars) {
                params = params.append('numberOfAvailableCars', rpfilter.numberOfAvaliableCars);
            }
            if(rpfilter.countryId) {
                params = params.append('countryId', rpfilter.countryId);
            }
            if(rpfilter.cityId) {
                params = params.append('cityId', rpfilter.cityId);
            }
            if(rpfilter.keyHandOverTime && rpfilter.keyReceivingTime) {
                params = params.append('keyReceivingTime', new Date(rpfilter.keyReceivingTime).toJSON());
                params = params.append('keyHandOverTime', new Date(rpfilter.keyHandOverTime).toJSON());
            }
        }
        return params;
    }

    public onFiltered(rpModel: RentalPointFiltrationModel): void {
        this.rpFiltrationModel = rpModel;
        let httpParams = this.getHttpParams(this.rpFiltrationModel);
        this.filterRentalPoints(httpParams);
    }

    public showCars(rpId: string | undefined): void {
        if(rpId && this.rpFiltrationModel && this.rpFiltrationModel.keyHandOverTime && this.rpFiltrationModel.keyReceivingTime) {
                let httpParams = new HttpParams();
                httpParams = httpParams.append('keyReceivingTime', this.rpFiltrationModel.keyReceivingTime.toString());
                httpParams = httpParams.append('keyHandOverTime', this.rpFiltrationModel.keyHandOverTime.toString());
                this.router.navigate([RENTAL_POINTS_PAGE, rpId, CARLIST_PAGE_PATH], { queryParams: {
                'keyReceivingTime' : new Date(this.rpFiltrationModel.keyReceivingTime).toJSON(),
                'keyHandOverTime' : new Date(this.rpFiltrationModel.keyHandOverTime).toJSON()
                }});
        } else if(this.isAdmin()){
            this.router.navigate([RENTAL_POINTS_PAGE, rpId, CARLIST_PAGE_PATH]);
        }
    }

    public addRentalPoint(): void {
        this.router.navigate([ADD_RENTAL_POINT_PATH]);
    }

    public deleteRentalPoint(id: string | undefined): void {
        if(id !== undefined) {
            this.rpService.deleteRentalPoint(id).subscribe();
        }
    }

    public updateRentalPoint(id: string | undefined): void {
        if(id !== undefined) {
            this.router.navigate([RENTAL_POINTS_PAGE + `/${id}/` + UPDATE_RENTAL_POINT_PAGE_PATH]);
        }
    }

    public isAdmin(): boolean {
        return this.loginService.getRole() === "Admin";
    }

    public onRentalPointChoosed(rentalPoint: RentalPoint): void {
        let mapCenter = new google.maps.LatLng(rentalPoint.locationX, rentalPoint.locationY);
        this.setCenterMapLocation(mapCenter);
    }

    private setCenterMapLocation(mapCenter: google.maps.LatLng): void {
        let mapOptions: google.maps.MapOptions = {
            center: mapCenter,
            zoom: this.map.getZoom() > 14 ? this.map.getZoom() : 14
        };
        this.map.setOptions(mapOptions);
    }
}
