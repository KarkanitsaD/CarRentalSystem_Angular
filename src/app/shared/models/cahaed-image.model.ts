export interface CachedImage {
    url: string;
    blob: Blob;
    expirationTime: Date;
}