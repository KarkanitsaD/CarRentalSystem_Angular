export interface Car {
    id: string;
    brand: string;
    model: string;
    fuelConsumptionPerHundredKilometers: number;
    transmissionType: string;
    numberOfSeats: number;
    color: string;
    rentalPointId: number;
    lastViewTime: Date;
    pricePerDay: number;  
}