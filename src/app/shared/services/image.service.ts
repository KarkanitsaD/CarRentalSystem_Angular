import { Injectable } from "@angular/core";
import { CachedImage } from "../models/cahaed-image.model";
import { ApiService } from "./api.service";

@Injectable()
export class ImageService {

    private images: CachedImage[] = [];

    constructor
    (
        private apiService: ApiService
    ) {} 
}