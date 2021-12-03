import { BookingItem } from "./booking-item.model";

export interface PageBookingList {
    bookings: BookingItem[];
    itemsTotalCount: number;
}