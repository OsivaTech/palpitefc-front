import { prisma } from "../db/prisma"
import { TeamType } from "../types/TeamType"

function model() {

    // export all function that is in the return
    return { 
        async get(id?: number) {
            return id ? <TeamType> await prisma.teams.findFirst({ where: {id: id}, include: { games: true}}) 
            : <TeamType[]> await prisma.teams.findMany({ include: { games: true}, orderBy: { name: 'asc'} })
        },

        async upsert(teams: TeamType) {
            return <TeamType> await prisma.teams.upsert({
                where: { id: teams.id ? teams.id : -1},
                create: teams,
                update: teams,
                include: { games: true}
            })
        },

        async delete(id: number) {
            return <TeamType> await prisma.teams.delete({ where: { id: id } })
        },

    }
    
}

const TeamModel = model()

export default TeamModel