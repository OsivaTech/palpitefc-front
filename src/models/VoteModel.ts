import { prisma } from "../db/prisma"
import { VoteType } from "../types/VoteType"

function model() {

    // export all function that is in the return
    return { 
        async get(id?: number) {
            return id ? <VoteType> await prisma.votes.findFirst({ where: { id: id }, include: { options: true } }) 
            : <VoteType[]> await prisma.votes.findMany({ include: { options: true } })
        },

        async upsert(vote: VoteType) {
            return <VoteType> await prisma.votes.upsert({
                where: { id: vote.id ? vote.id : -1 },
                create: vote,
                update: vote,
                include: { options: true }
            })
        },

        async delete(id: number) {
            await prisma.options.deleteMany({ where: { voteId: id } })
            return <VoteType> await prisma.votes.delete({ where: { id: id } })
        },

    }
    
}

const VoteModel = model()

export default VoteModel