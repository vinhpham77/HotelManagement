export interface RoomDTO {
    _id: string;
    name: string;
    roomTypeId: string;
    roomTypeName: string;
    pricePerDay: number;
    status: boolean;
    cleanRoom: boolean;
    cleanRoomAt: Date;
    description: string;
    maxAdult: number;
    maxChild: number;
}
