import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from "nodemailer";
import UserModel from 'src/models/UserModel';

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

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    
    try {
    
        const { method } = req

        if(method !== 'POST') return res.status(405).json({ message: 'method Not allowed' })

        const { email } = req.body

        if(!email) return res.status(406).json({ message: 'missing email param' })

        const userDb: any = await UserModel.getByEmail(email)

        if(!userDb) return res.status(404).json({ message: 'user not found' })

        const code =  String(getRandomInt(100000, 999999))

        await UserModel.update({ ...userDb, code: code })

        const info = await transporter.sendMail({
            from: '"Palpitefc" <palpitefc.com@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "[Palpitefc] Solicitação de reset de senha", // Subject line
            text: `Foi solicitada uma alteração de senha do seu acesso! seu código para alteração de senha é ${code}`, // plain text body
            html: (`
                <p>
                    Foi solicitada uma alteração de senha do seu acesso!<br> 
                    Seu código para alteração de senha é <b> ${code} </b>
                </p>
            `), // html body
        });

        return res.status(200).json(`código foi enviado para o email ${email}`)
        
    } catch(error) {

        console.error(error)
        return res.status(500).json({ message: error })
        
    }
    
}