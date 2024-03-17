import type { NextApiRequest, NextApiResponse } from 'next'
import ConfigModel from 'src/models/ConfigModel';
import NewsModel from 'src/models/NewsModel';
import { ConfigType } from 'src/types/ConfigType';
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

        const url :ConfigType | ConfigType[] = await ConfigModel.get('URLvideo')

        if(!url) return res.status(404).json({ message: 'news not found' })

        return res.status(200).json(url)
        
    } catch(error) {

        console.error(error)
        return res.status(500).json({ message: error })
        
    }
    
}