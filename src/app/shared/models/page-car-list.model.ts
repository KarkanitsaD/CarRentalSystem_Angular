import { Car } from "./car.model";

export interface PageCarList {
    cars: Car[];
    itemsTotalCount: number
}