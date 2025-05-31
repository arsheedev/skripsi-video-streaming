import { SECRET_RESEND_TOKEN } from '$env/static/private'
import { PUBLIC_BASE_URL } from '$env/static/public'
import ForgetPasswordSchema from '$lib/schemas/forget-password'
import db from '$lib/server/db'
import { fail, type Actions } from '@sveltejs/kit'
import crypto from 'crypto'
import { Resend } from 'resend'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	return { form: await superValidate(zod(ForgetPasswordSchema)) }
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(ForgetPasswordSchema))

		if (!form.valid) {
			return fail(400, {
				form,
				message: ''
			})
		}

		const { email } = form.data

		const user = await db.user.findFirst({ where: { email } })

		if (!user) return { form, message: 'Check you email for password reset link!' }

		const resend = new Resend(SECRET_RESEND_TOKEN)
		const token = crypto.randomBytes(32).toString('hex')
		const expiresAt = new Date(Date.now() + 1000 * 60 * 60)

		await db.passwordResetToken.create({
			data: {
				token,
				userId: user.id,
				expiresAt
			}
		})

		const resetUrl = `${PUBLIC_BASE_URL}/auth/reset-password?token=${token}`

		await resend.emails.send({
			from: 'Zapple Play <no-reply@zappleplay.site>',
			to: String(user.email),
			subject: 'Reset your password',
			html: `
				<p>Hi ${user.name || user.username},</p>
				<p>You requested to reset your password. Click the link below:</p>
				<p><a href="${resetUrl}">Reset Password</a></p>
				<p>This link will expire in 1 hour.</p>
			`
		})

		return { form, message: 'Check you email for reset password link!' }
	}
}
