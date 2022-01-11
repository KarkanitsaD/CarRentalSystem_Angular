export interface UpdateCarModel {
    id: string;
    brand: string;
    model: string;
    pricePerDay: number;  
    fuelConsumption: number;
    numberOfSeats: number;
    transmissionType: string;
    color: string;
    description: string;
    imageId: string;
    rentalPointId: string;
    pictureBase64Content: string;
    pictureShortName: string;
    pictureExtension: string;
}