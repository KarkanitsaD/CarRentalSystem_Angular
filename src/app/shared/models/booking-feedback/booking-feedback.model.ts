export interface BookingFeedbackModel {
    id: string;
    comment: string;
    rating: number;
    carId: string;
    userId: string;
    bookingId: string;
}