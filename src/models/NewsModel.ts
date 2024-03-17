import { prisma } from "../db/prisma"
import { NewsType } from "../types/NewsType"

function model() {

    // export all function that is in the return
    return { 
        async get(id?: number) {
            return id ? <NewsType> await prisma.news.findFirst({ where: {id: id}, include : { author: {select: {id: true, name: true, team: true}} } }) 
            : <NewsType[]> await prisma.news.findMany({ orderBy: { id: 'desc'}, include : { author: {select: {id: true, name: true, team: true}} } })
        },

        async upsert(news: NewsType) {
            return <NewsType> await prisma.news.upsert({
                where: { id: news.id ? news.id : -1},
                create: news,
                update: { title: news.title, content: news.content, info: news.info },
                include : { author: {select: {id: true, name: true, team: true}} },
            })
        },

        async delete(id: number) {
            return <NewsType> await prisma.news.delete({ where: { id: id } })
        },

    }
    
}

const NewsModel = model()

export default NewsModel