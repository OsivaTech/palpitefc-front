import type { NextApiRequest, NextApiResponse } from 'next'
import UserModel from 'src/models/UserModel';
import bcrypt from 'bcrypt'

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

        if(method !== 'POST') return res.status(405).json({ message: 'method Not allowed' })

        const { email, password, code } = req.body

        if(!email || !password || !code) return res.status(406).json({ message: 'missing params'})

        const userDb: any = await UserModel.getByEmail(email)

        if(!userDb) return res.status(404).json({ message: 'user not found' })

        console.log(code, userDb.code , String(code) !== String(userDb.code))

        if(String(code) === '-' || String(code) !== String(userDb.code)) return res.status(403).json({ message: 'code is wrong' })

        await UserModel.update({ ...userDb, code: '-' })

        await UserModel.changePassword(userDb.email, await bcrypt.hash(String(password), 2))

        return res.status(200).json('senha foi alterada com sucesso!')
        
    } catch(error) {

        console.error(error)
        return res.status(500).json({ message: error })
        
    }
    
}