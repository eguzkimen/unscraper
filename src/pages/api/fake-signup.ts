import { LeadSchema } from '@/types/models'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(400).json({message: 'Please use POST!!'})
  }
  
  const parseResult = LeadSchema.safeParse(req.body.lead)

  const randomlyFailed = Math.floor(Math.random() * 2) === 0

  if (randomlyFailed) {
    return res.status(200).json({success: false, message: 'FAKE: Unable to sign up' })
  }

  if (!parseResult.success) {
    return res.status(200).json({success: false, message: parseResult.error})
  }

  res.status(200).json({ success: true, message: 'FAKE: Sign up successful'})
}