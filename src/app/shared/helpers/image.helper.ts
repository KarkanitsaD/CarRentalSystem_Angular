import { Injectable } from "@angular/core";

@Injectable()
export class ImageHelper {
    
    public getImageDetailsFromUrlString(imageUrl: string): {extension: string, imageBase64Content: string} {
        let firstExtensionIndex = imageUrl.indexOf(':');
        let secondExtensionIndex = imageUrl.indexOf(';');
        let base64Index = imageUrl.indexOf(';base64,') + ';base64,'.length;

        let extension = imageUrl.substring(firstExtensionIndex + 1, secondExtensionIndex);
        let imageBase64Content = imageUrl.substring(base64Index);

        return {extension, imageBase64Content};
    }

    
}