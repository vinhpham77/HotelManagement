export interface Room {
    id(id: any): unknown;
    _id: string;
    name: string;
    roomTypeId: string;
    pricePerDay: number;
    status: boolean;
    cleanRoom: boolean;
    cleanRoomAt: Date;
    description: string;
    maxAdult: number;
    maxChild: number;
}
