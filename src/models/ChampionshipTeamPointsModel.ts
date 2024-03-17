import { prisma } from "../db/prisma"
import { ChampionshipTeamPoints } from "../types/ChampionshipTeamPointsType"

function model() {

    // export all function that is in the return
    return { 
        async get(id?: number) {
            return id ? <ChampionshipTeamPoints> await prisma.championshipTeamPoints.findFirst({ where: {id: id}, include: { team: true}}) 
            : <ChampionshipTeamPoints[]> await prisma.championshipTeamPoints.findMany({ include: { team: true, championships: true}, orderBy: { position: 'asc'} })
        },

        async upsert(championshipTeamPoints: any) {

            const found = <ChampionshipTeamPoints> await prisma.championshipTeamPoints.findFirst({ where: {
                teamId: championshipTeamPoints.teamId, championshipsId: championshipTeamPoints.championshipsId
            } }) 

            return <ChampionshipTeamPoints> await prisma.championshipTeamPoints.upsert({
                where: { id: found ? found.id : -1 },
                create:  { id: championshipTeamPoints.id, championshipsId: championshipTeamPoints.championshipId, teamId: championshipTeamPoints.teamId, position: championshipTeamPoints.position, points: championshipTeamPoints.points},
                update: { championshipsId: championshipTeamPoints.championshipId, teamId: championshipTeamPoints.teamId, position: championshipTeamPoints.position, points: championshipTeamPoints.points},
            })
        },

        async delete(id: number) {
            return <ChampionshipTeamPoints> await prisma.championshipTeamPoints.delete({ where: { id: id } })
        },

    }
    
}

const championshipTeamPointsModel = model()

export default championshipTeamPointsModel