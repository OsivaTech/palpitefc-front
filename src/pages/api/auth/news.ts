import type { NextApiRequest, NextApiResponse } from 'next'
import NewsModel from 'src/models/NewsModel';
import { NewsType } from 'src/types/NewsType';

// 200 OK
// 201 Created
// 202 Accepted
// 203 Non-Authoritative Information
// 204 No Content
// 205 Reset Content
// 206 Partial Content

// 400 Bad Request
// 401 Unauthorized
// 402 Payment Required
// 403 Forbidden
// 404 Not Found
// 405 Method Not Allowed
// 406 Not Acceptable
// 429 Too Many Requests
// 500 Internal Server Error
// 501 Not Implemented
// 502 Bad Gateway
// 503 Service Unavailable

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    
    try {
    
        const { method } = req

        if(method === 'GET') {

            const { id } = req.query

            const newDb :NewsType | NewsType[] = await NewsModel.get(Number(id))

            if(!newDb) return res.status(404).json({ message: 'news not found' })

            return res.status(200).json(newDb)

        }

        if(method === 'POST') {

            const { news } : { news: NewsType } = req.body

            if(!news.title) return res.status(406).json({ message: 'missing title param' })
            if(!news.content) return res.status(406).json({ message: 'missing content param' })
            if(!news.userId) return res.status(406).json({ message: 'missing userId param' })

            const newDb: NewsType = await NewsModel.upsert(news)

            if(!newDb) return res.status(500).json({ message: 'news not created' })

            return res.status(200).json(newDb)

        }

        if(method === 'DELETE') {

            const { id } = req.query

            if(!id) return res.status(406).json({ message: 'missing params' })

            const newDb :NewsType = await NewsModel.delete(Number(id))

            if(!newDb) return res.status(500).json({ message: 'news not deleted' })

            return res.status(200).json(newDb)

        }
        
        
    } catch(error) {

        console.error(error)
        return res.status(500).json({ message: error })
        
    }
    
}