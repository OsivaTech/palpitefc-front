import type { NextApiRequest, NextApiResponse } from 'next'
import VoteModel from 'src/models/VoteModel';
import { VoteType } from 'src/types/VoteType';

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

            const voteDb :VoteType | VoteType[] = await VoteModel.get(id ? Number(id) : undefined)

            if(!voteDb) return res.status(404).json({ message: 'vote not found' })

            return res.status(200).json(voteDb)

        }

        if(method === 'POST') {

            const { id, title }: {id: number, title: string, options: any[] } = req.body

            if(!title) return res.status(406).json({ message: 'missing params' })

            const voteDb :VoteType = await VoteModel.upsert({ id, title })

            if(!voteDb) return res.status(500).json({ message: 'vote not created' })

            return res.status(201).json(voteDb)

        }

        if(method === 'DELETE') {

            const { id } = req.query

            if(!id) return res.status(406).json({ message: 'missing name param' })

            const voteDb :VoteType = await VoteModel.delete(Number(id))

            if(!voteDb) return res.status(500).json({ message: 'config not deleted' })

            return res.status(200).json(voteDb)

        }
        
        
    } catch(error) {

        console.error(error)
        return res.status(500).json({ message: error })
        
    }
    
}