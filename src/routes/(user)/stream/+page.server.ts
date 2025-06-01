import CommentSchema from '$lib/schemas/comment'
import db from '$lib/server/db'
import { hash } from '@node-rs/argon2'
import type { User } from '@prisma/client'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	const id = Number(url.searchParams.get('id'))
	const video = await db.videoAsset.findUnique({
		where: { id },
		include: { qualities: true, comments: { include: { User: true } } }
	})

	// Fetch other videos (excluding the current one)
	const otherVideos = await db.videoAsset.findMany({
		where: { id: { not: id } },
		select: {
			id: true,
			name: true,
			thumbnail: true,
			views: true
		},
		take: 4
	})

	if (!video) {
		redirect(303, '/not-found')
	}

	await db.videoAsset.update({
		where: { id: video.id },
		data: { views: video.views + 1 }
	})

	return {
		video,
		otherVideos,
		form: await superValidate(zod(CommentSchema))
	}
}

export const actions: Actions = {
	createComment: async (event) => {
		const form = await superValidate(event, zod(CommentSchema))

		if (!form.valid) {
			return fail(400, {
				form,
				message: 'Write your comment first!'
			})
		}

		const id = Number(event.url.searchParams.get('id'))
		const videoExist = await db.videoAsset.findUnique({
			where: { id }
		})

		if (!videoExist) {
			return fail(404, {
				form,
				message: 'Video not found!'
			})
		}

		const { comment } = form.data
		const userData = JSON.parse(String(event.cookies.get('userData')))
		let userExist: User | null = {
			id: 0,
			name: userData?.name || '',
			password: '',
			role: 'USER',
			username: userData?.username || '',
			imageUrl: userData?.imageUrl || '',
			email: ''
		}

		userExist = await db.user.findUnique({ where: { username: userData?.username } })

		if (!userExist && userData) {
			const hashedPassword = await hash('asdfasdf', {
				// recommended minimum parameters
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			})

			userExist = await db.user.create({
				data: {
					name: userData.name,
					username: userData.username,
					imageUrl: userData.imageUrl,
					password: hashedPassword
				}
			})
		}

		await db.comment.create({
			data: { comment, videoAssetId: videoExist.id, userId: userExist?.id || 0 }
		})

		return { form }
	}
}
