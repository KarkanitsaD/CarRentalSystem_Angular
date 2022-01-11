export class AddCarModel {
    id?: string;
    imageId?: string;
    brand: string = '';
    model: string = '';
    pricePerDay: number = 0;
    fuelConsumptionPerHundredKilometers: number = 0;
    numberOfSeats: number = 0;
    transmissionType?: string = '';
    color?: string = '';
    pictureExtension: string = '';
    rentalPointId: string = '';
    pictureShortName: string = '';
    pictureBase64Content: string = '';
    description?: string ='';
}