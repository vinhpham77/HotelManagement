export interface Room {
    id: string;
    name: string;
    roomType: string;
    pricePerDay: number;
    status: boolean;
    cleanRoom: boolean;
    cleanRoomAt: Date;
    description: string;
    maxAdults: number;
    maxChildren: number; 
}
