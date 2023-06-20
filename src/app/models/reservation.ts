export interface Reservation {
    id: string;
    roomIds: string[];
    customerId: string;
    personnelId: string;
    reservedAt: Date;
    reservedOut:Date;
    deposit: number;
}
