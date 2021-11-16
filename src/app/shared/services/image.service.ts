import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map, tap } from "rxjs/operators";
import { IMAGE_CACHE_TIME } from "src/app/core/constants/cache";
import { CachedImage } from "../models/cahaed-image.model";
import { Image } from "../models/image.model";
import { ApiService } from "./api.service";

@Injectable()
export class ImageService {

    private images: CachedImage[] = [];

    constructor
    (
        private apiService: ApiService
    ) {}

    public getImageUrl(imageUrl: string): Observable<CachedImage> {    
        let index = this.images.findIndex(image => image.url === imageUrl);

        if(index > -1) {
            let image = this.images[index];

            if(image.expirationTime > new Date()) {
                return of(image);
            }

            this.images.slice(index, 1);
        }

        let cachedImage: CachedImage;
        return this.apiService.get<Image>(imageUrl).pipe(
            tap(image => {
                let fiveMinutesLater = new Date();
                fiveMinutesLater.setSeconds(fiveMinutesLater.getSeconds() + IMAGE_CACHE_TIME);

            

                var binary_string = window.atob(image.content);
                var len = binary_string.length;
                var bytes = new Uint8Array(len);
                for (var i = 0; i < len; i++) {
                    bytes[i] = binary_string.charCodeAt(i);
                }

                let blob = new Blob([bytes], { type: image.extension });



                cachedImage = {
                    url: imageUrl,
                    expirationTime: fiveMinutesLater,
                    fileResult: blob,
                    shortName: image.shortName,
                    extension: image.extension,
                }
                this.images.push(cachedImage);
            }),
            map(() => cachedImage)
        );
    }
}