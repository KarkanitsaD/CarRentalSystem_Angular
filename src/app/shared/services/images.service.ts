import { HttpClient } from "@angular/common/http";
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
        private httpClient: HttpClient,
        private apiService: ApiService,
    ) {}

    getImage(imageUrl: string): Observable<string> {

        debugger
        const index = this.cachedImages.findIndex(image => image.url === imageUrl);
        if(index > -1) {
            const image = this.cachedImages[index];
            return of(URL.createObjectURL(image.blob));
        }

        debugger

        return this.apiService.get<Blob>(imageUrl).pipe(
            tap(blob => {
                debugger
                let imageToInsert: CachedImage = {
                    url: imageUrl,
                    blob: blob,
                    expirationTime: new Date()
                }

                this.cachedImages.push(imageToInsert);
            }),
            map(data => URL.createObjectURL(data))
        );
    }
}