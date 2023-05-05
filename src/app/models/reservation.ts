export interface Reservation {
    id: string;
    roomIds: string[];
    customerId: string;
    employeeId: string;
    reservedAt: Date;
}
