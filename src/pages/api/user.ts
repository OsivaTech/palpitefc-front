import type { NextApiRequest, NextApiResponse } from 'next'
import NewsModel from 'src/models/NewsModel';
import UserModel from 'src/models/UserModel';
import { authorizationToken, verify } from 'src/providers/http/jwt';
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

        if(method !== 'GET') return res.status(405).json({ message: 'method Not allowed' })

        const token = await authorizationToken(req)
            
        const decodedToken = await verify(token, process.env.ACCESS_TOKEN as string)
        
        if(!decodedToken) return res.status(406).json({ message: 'missing params' })

        const userDb :any = await UserModel.get()

        return res.status(200).json(userDb)
        
    } catch(error) {

        console.error(error)
        return res.status(500).json({ message: error })
        
    }
    
}