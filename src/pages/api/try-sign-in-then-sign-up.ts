import { signin } from '@/scrape/skillmap/signin'
import { signup } from '@/scrape/skillmap/signup'
import { LeadSchema, SignupResult } from '@/types/models'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
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

  let signInResult: SignupResult | null = null

  for (let tries = 0; tries < 0; tries ++) {
    signInResult = await signin(parseResult.data, req.body.headless)
      
    if (signInResult.success) return res.status(200).json(signInResult)
  }
  
  let signUpResult: SignupResult | null = null

  // Signin failed, try signup, twice
  for (let tries = 0; tries < 2; tries ++) {
    signUpResult = await signup(parseResult.data, req.body.headless)
    
    if (signUpResult.success) return res.status(200).json(signUpResult)
  }

  res.status(200).json(signUpResult ?? { success: false, message: 'NOOP: Didnt try to sing up'})
}