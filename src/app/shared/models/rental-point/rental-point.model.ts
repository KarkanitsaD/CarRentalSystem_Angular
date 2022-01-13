export interface RentalPoint {
    id?: string;
    title: string;
    address: string;
    locationX: number;
    locationY: number;
    cityId: number;
    city: string;
    countryId?: number;
    country: string;
}