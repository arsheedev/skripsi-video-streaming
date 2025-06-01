import ResetPasswordSchema from '$lib/schemas/reset-password'
import db from '$lib/server/db'
import { hash } from '@node-rs/argon2'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	return { form: await superValidate(zod(ResetPasswordSchema)) }
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(ResetPasswordSchema))

		if (!form.valid) {
			return fail(400, {
				form,
				message: ''
			})
		}

		const { resetToken, password } = form.data

		const tokenExist = await db.passwordResetToken.findUnique({ where: { token: resetToken } })

		if (!tokenExist) {
			return fail(400, { form, message: 'Token is invalid or has expired.' })
		}

		if (tokenExist.expiresAt < new Date()) {
			return fail(400, { form, message: 'Token is invalid or has expired.' })
		}

		const hashedPassword = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		})

		await db.user.update({
			where: { id: tokenExist.userId },
			data: { password: hashedPassword }
		})

		await db.passwordResetToken.delete({ where: { id: tokenExist.id } })

		redirect(303, '/auth/login?reset=success')
	}
}
