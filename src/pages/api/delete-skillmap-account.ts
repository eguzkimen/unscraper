import { deleteAccount } from '@/scrape/skillmap/delete-account'
import { LeadSchema } from '@/types/models'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(400).json({message: 'Please use POST!!'})
  }

  const parseResult = LeadSchema.safeParse(req.body.lead)

  if (!parseResult.success) {
    return res.status(400).json({error: parseResult.error})
  }

  deleteAccount(parseResult.data).then((result) => {
    res.status(200).json(result)
  })
}