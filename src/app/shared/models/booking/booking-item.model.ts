import { AdditionalFacility } from "../additional-facility/additional-facility.model";

export interface BookingItem {
    price: number;
    id: string;
    carId: string;
    model: string;
    brand: string;
    country: string;
    city: string;
    keyReceivingTime: Date;
    keyHandOverTime: Date;
    bookingTime: Date;
    customerName: string;
    customerSurname: string;
    customerEmail: string;
    phoneNumber: string;
    additionalFacilities?: AdditionalFacility[]
}