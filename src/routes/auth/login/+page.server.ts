import { SECRET_JWT_TOKEN } from '$env/static/private'
import LoginUserSchema from '$lib/schemas/login-user'
import db from '$lib/server/db'
import { verify } from '@node-rs/argon2'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import jwt from 'jsonwebtoken'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.session) {
		redirect(302, '/admin')
	}

	return { form: await superValidate(zod(LoginUserSchema)) }
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(LoginUserSchema))

		if (!form.valid) {
			return fail(400, {
				form,
				message: ''
			})
		}

		const { username, password } = form.data
		const callback = event.url.searchParams.get('callback')

		const userExist = await db.user.findUnique({ where: { username } })

		if (!userExist) {
			return fail(400, {
				form,
				message: 'Username atau password salah!'
			})
		}

		const isPasswordRight = await verify(userExist.password, password)

		if (!isPasswordRight) {
			return fail(400, {
				form,
				message: 'Username atau password salah!'
			})
		}

		const authToken = await jwt.sign(
			{ id: userExist.id, username: userExist.username },
			SECRET_JWT_TOKEN,
			{ expiresIn: '24h' }
		)

		await db.session.create({
			data: {
				expiresAt: new Date(Date.now()),
				ipAddress: event.getClientAddress(),
				userId: userExist.id
			}
		})

		event.cookies.set('authToken', authToken, {
			path: '/',
			httpOnly: true,
			sameSite: true,
			maxAge: 60 * 60 * 24
		})

		if (callback) {
			redirect(303, callback)
		}

		redirect(303, '/admin')
	}
}
