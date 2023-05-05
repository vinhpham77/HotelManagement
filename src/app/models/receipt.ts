export interface Receipt {
    id: string;
    employeeId: string;
    reservationDetailId: string;
    createdAt: Date;
    orderPrice: number;
    roomPrice: number;
}
