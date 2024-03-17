import { prisma } from "../db/prisma"
import { VoteType } from "../types/VoteType"

function model() {

    return {
        
        async getOptionById(idOption:number) {
            const optionDb = <any> await prisma.options.findUnique({
                where: { id: idOption },
            })
            return optionDb
        },
    
        async addVote(idOption:number, count:number) {
            const optionDb = <any> await prisma.options.update({
                where: { id: idOption },
                data: { count: count},
            })
            return optionDb
        },
    
        async delete(id: number) {
            return await prisma.options.delete({ where: { id: id } })
        },

        async create(title: string, voteId: number) {
            return await prisma.options.create({ data: {title: title, voteId: voteId} })
        }

    }


}

const OptionModel = model()

export default OptionModel