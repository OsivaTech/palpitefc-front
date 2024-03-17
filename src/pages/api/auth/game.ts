import type { NextApiRequest, NextApiResponse } from 'next'
import GameModel from 'src/models/GameModel';
import PalpitationModel from 'src/models/PalpitationModel';
import TeamsGameModel from 'src/models/TeamsGameModel';
import UserModel from 'src/models/UserModel';
import { GameType } from 'src/types/GameType';
import { PalpitationType } from 'src/types/PalpitationType';
import { UserType } from 'src/types/UserType';
import nodemailer from "nodemailer";

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

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: `${process.env.EMAIL_ADDRESS}` as string, // generated ethereal user
      pass: `${process.env.EMAIL_PASSWORD}` as string, // generated ethereal password
    },
});

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    
    try {
    
        const { method } = req

        if(method === 'GET') {

            const { id, championshipId } = req.query

            let gameDb: any;
            
            if(championshipId) gameDb = await GameModel.getBychampionship(Number(championshipId))
            gameDb = await GameModel.get(Number(id))

            return res.status(200).json( handleGameObject(gameDb) )

        }

        if(method === 'POST') {

            const { id, name, championshipId, start, finished, firstTeam, secondTeam } = req.body

            const gameBefore = <GameType> await GameModel.get(id)

            const gameDb :GameType = await GameModel.upsert({id, name, championshipId, start, finished})

            if(!gameDb) return res.status(500).json({ message: 'game not created' })

            await TeamsGameModel.save({ teamId: firstTeam.id, gol: firstTeam.gol, gameId: gameDb.id  }, { teamId: secondTeam.id, gol: secondTeam.gol, gameId: gameDb.id  })

            const game = handleGameObject(await GameModel.get(gameDb.id))
            
            if(finished === true && gameBefore.finished === false) {

                (<PalpitationType[]> await PalpitationModel.getByGame(game.id)).forEach(async(palpitation:PalpitationType) => {
                    
                    if(palpitation.gameId !== game.id) return;
                    if(palpitation.firstTeamGol !== game.firstTeam.gol || palpitation.secondTeamGol !== game.secondTeam.gol) return

                    const userDb = <UserType> await UserModel.get(palpitation.userId)
                    if(!userDb || !userDb.id) return;

                    await UserModel.addRakingPoint(userDb.id)
                    if(!userDb.email) return;

                    const info = await transporter.sendMail({
                        from: '"Palpitefc" <palpitefc.com@gmail.com>', // sender address
                        to: userDb.email, // list of receivers
                        subject: `[Palpitefc] Parabéns, você acertou um palpite.`, // Subject line
                        text: `Você acertou o palpite do jogo ${game.firstTeam.name} x ${game.secondTeam.name}. Resultado: ${game.firstTeam.name} - ${game.firstTeam.gol} x ${game.secondTeam.gol} - ${game.secondTeam.name}`, // plain text body
                        html: (`
                            <p>
                                Você acertou o palpite do jogo <b>${game.firstTeam.name} x ${game.secondTeam.name}</b>.<br> 
                                Resultado: <b>${game.firstTeam.name} - ${game.firstTeam.gol} x ${game.secondTeam.gol} - ${game.secondTeam.name}</b>
                            </p>
                        `), // html body
                    });

                })

            }

            return res.status(200).json( game )

        }

        if(method === 'DELETE') {

            const { id } = req.query

            if(!id) return res.status(406).json({ message: 'missing params' })

            const gameDb :GameType = await GameModel.delete(Number(id))

            if(!gameDb) return res.status(500).json({ message: 'game not deleted' })

            return res.status(200).json(gameDb)

        }
        
        
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