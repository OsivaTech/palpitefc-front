

export interface GameType {
    id?: number;
    name: string;
    championshipId?: number;
    start?:     Date;
    finished?: boolean;
}