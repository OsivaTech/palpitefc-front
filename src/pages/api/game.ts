import type { NextApiRequest, NextApiResponse } from 'next'
import ChampionshipModel from 'src/models/ChampionshipModel';
import GameModel from 'src/models/GameModel';
import NewsModel from 'src/models/NewsModel';
import { ChampionshipType } from 'src/types/ChampionshipType';
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

        const { id, championshipId } = req.query

        let gameDb: any;
        
        if(championshipId) gameDb = await GameModel.getBychampionship(Number(championshipId))
        gameDb = await GameModel.get(Number(id))

        return res.status(200).json( handleGameObject(gameDb) )
        
    } catch(error) {

        console.error(error)
        return res.status(500).json({ message: error })
        
    }
    
}

function handleGameObject(gameDb:any) {
    if(Array.isArray(gameDb)) {
                
        let manipuledGame: any[] = [] 

        gameDb.forEach((game:any)=>{

            manipuledGame = [...manipuledGame, {
                id: game.id,
                name: game.name,
                start: game.start,
                championshipId: game.championshipId,
                firstTeam: {
                    gol: game.teamsGame[0].gol,
                    ...game.teamsGame[0].team,
                },
                secondTeam: {
                    gol: game.teamsGame[1].gol,
                    ...game.teamsGame[1].team,
                },
                createdAt: game.createdAt,
                updatedAt: game.updatedAt
            }]

        })

        return manipuledGame

    } else {
        let manipuledGame: any = {
            id: gameDb.id,
            name: gameDb.name,
            start: gameDb.start,
            championshipId: gameDb.championshipId,
            firstTeam: {
                id: gameDb.teamsGame[0].team.id,
                name: gameDb.teamsGame[0].team.name,
                gol: gameDb.teamsGame[0].gol,
            },
            secondTeam: {
                id: gameDb.teamsGame[1].team.id,
                name: gameDb.teamsGame[1].team.name,
                gol: gameDb.teamsGame[1].gol,
            },
            createdAt: gameDb.createdAt,
            updatedAt: gameDb.updatedAt
        }
        return manipuledGame
    }
}