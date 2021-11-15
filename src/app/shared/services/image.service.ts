import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { IMAGE_CACHE_TIME } from "src/app/core/constants/cache";
import { CachedImage } from "../models/cahaed-image.model";
import { ApiService } from "./api.service";

@Injectable()
export class ImageService {

    private images: CachedImage[] = [];

    constructor
    (
        private apiService: ApiService
    ) {}

    public getImageUrl(imageUrl: string): Observable<string> {        
        let imageToRenturn = this.images.find(image => image.url === imageUrl);

        if(imageToRenturn != null) {
            if(imageToRenturn.expirationTime > new Date()) {
                return of(URL.createObjectURL(imageToRenturn.blob));
            }
            
            let imageToReturnIndex = this.images.indexOf(imageToRenturn);
            this.images.slice(imageToReturnIndex, 1);
        }

        this.apiService.get<Blob>(imageUrl).subscribe(blob => {

            var fiveMinutesLater = new Date();
            fiveMinutesLater.setSeconds(fiveMinutesLater.getSeconds() + IMAGE_CACHE_TIME);

            imageToRenturn = {
                url: imageUrl,
                blob: blob,
                expirationTime: fiveMinutesLater,
            }

            this.images.push(imageToRenturn);
        });

        return of(URL.createObjectURL(imageToRenturn?.blob));
    }
}