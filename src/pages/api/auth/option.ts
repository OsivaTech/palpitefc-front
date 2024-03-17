import type { NextApiRequest, NextApiResponse } from 'next'
import OptionModel from 'src/models/OptionModel';
import VoteModel from 'src/models/VoteModel';
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

        if(method === 'POST') {

            const { id, title, voteId } = req.body

            if(title && !voteId) return res.status(406).json({ message: 'missing voteId params' })
            if(!title && voteId) return res.status(406).json({ message: 'missing voteId params' })
            if(title && voteId) return res.status(201).json( await OptionModel.create(title, Number(voteId)) )

            if(!id) return res.status(406).json({ message: 'missing params' })

            const option = await OptionModel.getOptionById(Number(id))

            if(!option) return res.status(404).json({ message: 'option not found' })

            await OptionModel.addVote(Number(id), Number(option.count + 1))

            return res.status(200).json( await VoteModel.get(option.voteId) )

        }

        if(method === 'DELETE') {

            const { id } = req.query

            if(!id) return res.status(406).json({ message: 'missing name param' })

            const optionDb :VoteType = await OptionModel.delete(Number(id))

            if(!optionDb) return res.status(500).json({ message: 'option not deleted' })

            return res.status(200).json(optionDb)

        }

        return res.status(405).json({ message: 'method Not allowed' })
        
    } catch(error) {

        console.error(error)
        return res.status(500).json({ message: error })
        
    }
    
}