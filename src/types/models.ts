import { z } from 'zod'

export const LeadSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
})

export type Lead = z.infer<typeof LeadSchema>

export type SignupResult = {
  success: boolean,
  message?: string
}