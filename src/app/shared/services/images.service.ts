import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map, tap } from "rxjs/operators";
import { CachedImage } from "../models/cahaed-image.model";
import { ApiService } from "./api.service";

@Injectable()
export class ImagesService {
    
    private cachedImages: CachedImage[] = [];

    constructor
    (
        private apiService: ApiService,
    ) {}

    getImage(imageUrl: string): Observable<string> {

        const index = this.cachedImages.findIndex(image => image.url === imageUrl);
        if(index > -1) {
            const image = this.cachedImages[index];
            return of(URL.createObjectURL(image.fileResult));
        }

        return this.apiService.get<Blob>(imageUrl).pipe(
            tap(blob => {
                let imageToInsert: CachedImage = {
                    url: imageUrl,
                    fileResult: blob,
                    expirationTime: new Date(),
                    shortName: 'shortName'
                }

                this.cachedImages.push(imageToInsert);
            }),
            map(data => URL.createObjectURL(data))
        );
    }
}