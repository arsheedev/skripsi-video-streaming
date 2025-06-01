import { z } from 'zod'

const ForgetPasswordSchema = z.object({
	email: z.string().email().min(1, 'Email is required!')
})

export default ForgetPasswordSchema
