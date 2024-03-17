import type { NextApiRequest, NextApiResponse } from 'next'
import PalpitationModel from 'src/models/PalpitationModel';
import UserModel from 'src/models/UserModel';
import VoteModel from 'src/models/VoteModel';
import { authorizationToken, verify } from 'src/providers/http/jwt';
import { PalpitationType } from 'src/types/PalpitationType';
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

            const palpitationDb :PalpitationType | PalpitationType[] = await PalpitationModel.get(id ? Number(id) : undefined)

            if(!palpitationDb) return res.status(404).json({ message: 'palpitation not found' })

            return res.status(200).json(palpitationDb)

        }

        if(method === 'POST') {

            const { gameId, firstTeam, secondTeam, userId } = req.body

            if(!gameId) return res.status(401).json({ message: 'missing gameId param'})
            if(!firstTeam.id) return res.status(401).json({ message: 'missing firstTeam.id param' })
            if(!firstTeam.gol) return res.status(401).json({ message: 'missing firstTeam.gol param' })
            if(!secondTeam.id) return res.status(401).json({ message: 'missing secondTeam.id param' })
            if(!firstTeam.gol) return res.status(401).json({ message: 'missing secondTeam.gol param' })

            const token = await authorizationToken(req)
            
            const decodedToken = await verify(token, process.env.ACCESS_TOKEN as string)
            
            if(!decodedToken) return res.status(401).json({ message: 'missing bearer token' })
            
            const userDb :any = await UserModel.get(Number(decodedToken.id))
            
            if(!userDb) return res.status(404).json({ message: 'user not found' })

            // if(await PalpitationModel.getByUserId(userDb.id)) return res.status(406).json({ message: 'jogo já foi palpitado!' })

            const palpitationDb = await PalpitationModel.create({ firstTeamId: Number(firstTeam.id), firstTeamGol: Number(firstTeam.gol),  secondTeamId: Number(secondTeam.id), secondTeamGol: Number(secondTeam.gol), gameId: Number(gameId), userId: userDb.id })
            
            return res.status(201).json(palpitationDb)

        }
        
    } catch(error) {

        console.error(error)
        return res.status(500).json({ message: error })
        
    }
    
}