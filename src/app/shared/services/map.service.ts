import { Injectable } from "@angular/core";

@Injectable()
export class MapService {
    constructor
    ()
    {}

    public centerAndZoomMap(map: google.maps.Map, markers: google.maps.Marker[]) {
        let bounds = new google.maps.LatLngBounds();
        markers.forEach(marker => {
           let position = marker.getPosition();
           if(position)
               bounds.extend(position);
        });
        map.fitBounds(bounds);
    }

    //custom searching map center
    public getMapCenter(markers: google.maps.Marker[]): google.maps.LatLng {
        let defaultCenter = markers[0].getPosition();
        if(defaultCenter)
        {
            let leftCoordinate: number = defaultCenter.lng();
            let rightCoordinate: number = defaultCenter.lng();
            let bottomCoordinate: number = defaultCenter.lat();
            let topCoordinate: number = defaultCenter.lat();

            for(let i = 1; i < markers.length; i++) {
                let position = markers[i].getPosition();
                if(position)
                {
                    if(position.lng() > rightCoordinate) {
                        rightCoordinate = position.lng();
                    }
                    else if(position.lng() < leftCoordinate) {
                        leftCoordinate = position.lng();
                    }
                    if(position.lat() > topCoordinate) {
                        topCoordinate= position.lat();
                    }
                    else if(position.lat() < bottomCoordinate) {
                        bottomCoordinate = position.lat();
                    }
                }
            }

            let lat = (bottomCoordinate + topCoordinate) / 2;
            let lng = (rightCoordinate + leftCoordinate) / 2;
            return new google.maps.LatLng(lat, lng);
        }

        return new google.maps.LatLng(0,0);
    }
}
