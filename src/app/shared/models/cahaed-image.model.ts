export interface CachedImage {
    url: string;
    expirationTime: Date;
    fileResult: Blob;
    shortName: string;
}