import { ChampionshipTeamPoints } from './../../types/ChampionshipTeamPointsType';
import type { NextApiRequest, NextApiResponse } from 'next'
import championshipTeamPointsModel from 'src/models/ChampionshipTeamPointsModel';
import { authorizationToken, verify } from 'src/providers/http/jwt';

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

            const { id, championshipId } = req.query

            let championshipTeamPoints: any;
            
            if(championshipId) championshipTeamPoints = await championshipTeamPointsModel.get()
            championshipTeamPoints = await championshipTeamPointsModel.get(Number(id))

            return res.status(200).json( championshipTeamPoints )

        }
        
    } catch(error) {

        console.error(error)
        return res.status(500).json({ message: error })
        
    }
    
}