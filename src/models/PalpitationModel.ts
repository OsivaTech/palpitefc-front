import { prisma } from "../db/prisma"
import { PalpitationType } from "../types/PalpitationType"

function model() {

    // export all function that is in the return
    return { 
        async get(id?: number) {
            return id ? <PalpitationType> await prisma.palpitations.findFirst({ where: { id: id }, include: { game: true, user: { select: { id: true}} } }) 
            : <PalpitationType[]> await prisma.palpitations.findMany({ include: { game: true, user: { select: { name: true, email: true, points: true} } }, orderBy: { id: 'desc'} })
        },

        async getByUserId(id: number) {
            return <PalpitationType> await prisma.palpitations.findFirst({ where: { userId: id }, include: { game: true, user: { select: { id: true}} } }) 
        },

        async getByGame(id?: number) {
            return <PalpitationType[]> await prisma.palpitations.findMany({ where: { gameId: id }, include: { game: true, user: { select: { name: true, email: true, points: true} } } }) 
        },

        async create(palpitationsParam: any) {
            console.log(palpitationsParam)
            return <PalpitationType> await prisma.palpitations.create({
                data: palpitationsParam,
                include: { game: true, user: { select: { name: true, email: true, points: true} } }
            })
        },

    }
    
}

const PalpitationModel = model()

export default PalpitationModel