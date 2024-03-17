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

        if(method !== 'GET') return res.status(405).json({ message: 'method Not allowed' })

        const { id } = req.query

        const voteDb :VoteType | VoteType[] = await VoteModel.get(id ? Number(id) : undefined)

        if(!voteDb) return res.status(404).json({ message: 'vote not found' })

        return res.status(200).json(voteDb)

    } catch(error) {

        console.error(error)
        return res.status(500).json({ message: error })
        
    }
    
}