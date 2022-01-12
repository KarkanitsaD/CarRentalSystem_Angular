export interface AddCarModel {
    brand: string;
    model: string;
    pricePerDay: number;  
    fuelConsumptionPerHundredKilometers: number;
    numberOfSeats: number;
    transmissionType: string;
    color: string;
    rentalPointId: string;
    description: string;
    pictureShortName: string;
    pictureBase64Content: string;
    pictureExtension: string;
}