import { z } from 'zod'

const ResetPasswordSchema = z
	.object({
		resetToken: z.string().min(1, 'Reset Token is required!'),
		password: z.string().min(8, 'Password must be at least 8 character!'),
		confirmPassword: z.string().min(8, 'Password must be at least 8 character!')
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ['confirmPassword'],
		message: "Password doesn't match!"
	})

export default ResetPasswordSchema
