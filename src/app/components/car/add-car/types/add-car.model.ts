export interface AddCarModel {
    id?: string;
    brand: string;
    model: string;
    pricePerDay: number;
    fuelConsumptionPerHundredKilometers: number;
    numberOfSeats: number;
    transmissionType?: string;
    color?: string;
    pictureExtension: string;
    rentalPointId: string;
    pictureShortName: string;
    pictureBase64Content: string;
}