import type { NextApiRequest, NextApiResponse } from 'next'
import NewsModel from 'src/models/NewsModel';
import TeamModel from 'src/models/TeamModel';
import { NewsType } from 'src/types/NewsType';
import { TeamType } from 'src/types/TeamType';

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

        const teamDb :TeamType | TeamType[] = await TeamModel.get(Number(id))

        if(!teamDb) return res.status(404).json({ message: 'team not found' })

        return res.status(200).json(teamDb)
        
    } catch(error) {

        console.error(error)
        return res.status(500).json({ message: error })
        
    }
    
}