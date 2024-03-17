// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "../../db/prisma"
import jwt from 'jsonwebtoken';
import UserModel from "../../models/UserModel"
import bcrypt from 'bcrypt'

export default async function handler(req: NextApiRequest,res: NextApiResponse) {
    
    const {name, email, password, role, document, team, info, number, birthday } = req.body;
    const { method } = req;
    
    if(method !== 'POST') return res.status(405).json({ message: 'method Not allowed' })

    if(!name || !email || !password) return res.status(406).json({ message: 'missing parameters' })
    
    try {
        
        const response = await prisma.users.findUnique({
            where: { email: email }
        })

        if(response) return res.status(409).json({ message: 'this email is already in use' })

        const hashedPassword = await bcrypt.hash(password, 2) 

        const userDb = await UserModel.create( {name: name, email: email, password: hashedPassword, role: role ? Number(role) : 300, document: document, team: team, info: info, number: number, birthday: birthday} )

        const userLogin = {
            id:userDb.id, 
            name:userDb.name, 
            email:userDb.email,
            role: userDb.role,
            points: userDb.points,
            birthday:userDb.birthday,
            document:userDb.document,
            info:userDb.info,
            number:userDb.number,
            team:userDb.team
        };

        const accessToken = jwt.sign(userLogin, `${process.env.ACCESS_TOKEN}` as string);
        
        return res.status(201).json({ accessToken: accessToken, user: userLogin });

    } catch(error) {

        console.error(error)
        return res.status(500).end(error)
        
    }
}