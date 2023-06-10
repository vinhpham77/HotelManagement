export interface Receipt {
    id: string;
    personnelId: string;
    reservationDetailId: string;
    createdAt: Date;
    orderPrice: number;
    totalPrice: number;
}
