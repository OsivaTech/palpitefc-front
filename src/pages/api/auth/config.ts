import type { NextApiRequest, NextApiResponse } from 'next'
import ConfigModel from 'src/models/ConfigModel';
import { ConfigType } from 'src/types/ConfigType';

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

            const { name } = req.query

            const configDb :ConfigType | ConfigType[] = await ConfigModel.get(name as string)

            if(!configDb) return res.status(404).json({ message: 'config not found' })

            return res.status(200).json(configDb)

        }

        if(method === 'POST') {

            const { id, name, value }: {id: number, name: string, value: string } = req.body

            if(!name || !value) return res.status(406).json({ message: 'missing params' })

            const configDb :ConfigType = await ConfigModel.upsert({ id, name, value })

            if(!configDb) return res.status(500).json({ message: 'config not created' })

            return res.status(200).json(configDb)

        }

        if(method === 'DELETE') {

            const { name } = req.query

            if(!name) return res.status(406).json({ message: 'missing name param' })

            const configDb :ConfigType = await ConfigModel.delete(String(name))

            if(!configDb) return res.status(500).json({ message: 'config not deleted' })

            return res.status(200).json(configDb)

        }
        
        
    } catch(error) {

        console.error(error)
        return res.status(500).json({ message: error })
        
    }
    
}