export interface Car {
    id: string;
    brand: string;
    model: string;
    fuelConsumptionPerHundredKilometers: number;
    transmissionType: string;
    numberOfSeats: number;
    color: string;
    rentalPointId: string;
    lastViewTime: Date;
    pricePerDay: number;  
    description?: string;
}