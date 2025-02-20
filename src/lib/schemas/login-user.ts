import { z } from 'zod'

const LoginUserSchema = z.object({
	username: z.string().min(1, 'Username needed!'),
	password: z.string().min(1, 'Password needed!')
})

export default LoginUserSchema
