import { prisma } from "../db/prisma"
import { ChampionshipType } from "../types/ChampionshipType"

function model() {

    // export all function that is in the return
    return { 
        async get(id?: number) {
            return id ? <ChampionshipType> await prisma.championships.findFirst({ where: {id: id}, include: { games: true}}) 
            : <ChampionshipType[]> await prisma.championships.findMany({ include: { games: true}, orderBy: { id: 'desc'} })
        },

        async upsert(championshipParam: any) {
            const {games,  ...championship } = championshipParam
            return <ChampionshipType> await prisma.championships.upsert({
                where: { id: championship.id ? championship.id : -1},
                create: championship,
                update: championship,
                include: { games: true}
            })
        },

        async delete(id: number) {
            return <ChampionshipType> await prisma.championships.delete({ where: { id: id } })
        },

    }
    
}

const ChampionshipModel = model()

export default ChampionshipModel