import { Room } from "./Room";

export interface RentRoom {
    id: string;
    name: string;
    description: string;
    rooms: Room[];
}
