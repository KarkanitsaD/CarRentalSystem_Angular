import { RentalPoint } from "./rental-point.model";

export interface PageRentalPointList {
    rentalPoints: RentalPoint[];
    itemsTotalCount: number;
}