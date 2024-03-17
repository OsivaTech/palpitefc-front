import { prisma } from "../db/prisma"
import { UserType } from "../types/UserType"

function model() {

    // export all function that is in the return
    return { 
        async get(id?: number) {
            return id ? <UserType> await prisma.users.findFirst({ where: {id: id}, select: {id: true, name: true, email: true, role: true, points: true, document: true, team: true, info: true, number: true, birthday: true} }) 
            : <UserType[]> await prisma.users.findMany({ select: {id: true, name: true, email: true, role: true, points: true,  document: true, team: true, info: true, number: true, birthday: true}, orderBy: { id: 'desc'} })
        },

        async getByEmail(email?: string) {
            return <UserType> await prisma.users.findUnique({ where: {email: email}, select: {id: true, name: true, email: true, role: true, points: true, document: true, team: true, info: true, number: true, birthday: true, code: true} }) 
        },

        async create(user: UserType) {
            return await prisma.users.create({
                data: user,
                select: {id: true, name: true, email: true, role: true, points: true, document: true, team: true, info: true, number: true, birthday: true}
            })
        },

        async update(user: { email: string, name: string, document: string, team: string, info: string, number: string, birthday: string, code: string }) {
            return await prisma.users.update({
                where: { email: user.email },
                data: {
                    name: user.name ? user.name : undefined,
                    document: user.document ? user.document : undefined,
                    team: user.team ? user.team : undefined,
                    info: user.info ? user.info : undefined,
                    number: user.number ? user.number : undefined,
                    birthday: user.birthday ? user.birthday : undefined,
                    code: user.code ? user.code : undefined
                },
                select: {id: true, name: true, email: true, role: true, points: true, document: true, team: true, info: true, number: true, birthday: true}
            })
        },

        async changePassword(email: string, password: any) {
            return await prisma.users.update({
                where: { email: email },
                data: {
                    password: password,
                },
                select: {id: true, name: true, email: true, role: true, points: true, document: true, team: true, info: true, number: true, birthday: true}
            })
        },

        async addRakingPoint(userId: number) {
            const { points } = <UserType> await prisma.users.findUnique({ where: { id: userId }, select: { points : true} })
            return await prisma.users.update({
                where: { id: userId },
                data: { points: points ? points + 1 : 1 },
                select: {id: true, name: true, email: true, role: true, points: true, document: true, team: true, info: true, number: true, birthday: true}
            })
        },

        async getByPoints() {
            return <UserType[]> await prisma.users.findMany({ where: { points: { gte: 1 }  } ,orderBy: { points: 'desc'}, select: {id: true, name: true, email: true, role: true, points: true, document: true, team: true, info: true, number: true, birthday: true} }) 
        },

    }
    
    
}

const UserModel = model()

export default UserModel