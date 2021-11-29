export interface CarFiltrationModel {
    rentalPointId: string,
    brand?: string,
    color?: string,
    minPricePerDay?: number,
    maxPricePerDay?: number,
    keyReceivingTime: Date,
    keyHandOverTime: Date
}