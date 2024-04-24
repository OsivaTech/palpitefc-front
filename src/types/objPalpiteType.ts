export interface objPalpiteType {
    id: number | string;
    horario: string;
    mandante: string | number;
    visitante: string | number;
    homeTeamId: string | number;
    awayTeamId: string | number;
}