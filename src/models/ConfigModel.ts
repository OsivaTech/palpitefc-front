import { prisma } from "../db/prisma"
import { ConfigType } from "../types/ConfigType"

function model() {

    // export all function that is in the return
    return { 
        async get(name?: string) {
            return name ? <ConfigType> await prisma.config.findFirst({ where: {name: name} }) 
            : <ConfigType[]> await prisma.config.findMany()
        },

        async upsert(config: ConfigType) {
            return <ConfigType> await prisma.config.upsert({
                where: { name: config.name },
                create: config,
                update: config,
            })
        },

        async delete(name: string) {
            return <ConfigType> await prisma.config.delete({ where: { name: name } })
        },

    }
    
}

const ConfigModel = model()

export default ConfigModel