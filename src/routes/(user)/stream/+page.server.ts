import CommentSchema from '$lib/schemas/comment'
import db from '$lib/server/db'
import { hash } from '@node-rs/argon2'
import type { User } from '@prisma/client'
import { fail, type Actions } from '@sveltejs/kit'
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
		take: 4 // Limit to 4 videos
	})

	if (!video) {
		return { video: null, otherVideos }
	}

	db.videoAsset.update({ where: { id: video?.id }, data: { views: video.views++ } })

	return { video, otherVideos, form: await superValidate(zod(CommentSchema)) }
}

export const actions: Actions = {
	createComment: async (event) => {
		const form = await superValidate(event, zod(CommentSchema))

		if (!form.valid) {
			return fail(400, {
				form,
				message: ''
			})
		}

		const { name, username, imageUrl, comment, videoAssetId } = form.data
		let userExist: User | null = { id: 0, name, password: '', role: 'USER', username, imageUrl }

		userExist = await db.user.findUnique({ where: { username } })

		if (!userExist) {
			const hashedPassword = await hash('asdfasdf', {
				// recommended minimum parameters
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			})

			userExist = await db.user.create({
				data: { name, username, imageUrl, password: hashedPassword }
			})
		}

		await db.comment.create({ data: { comment, videoAssetId, userId: userExist.id } })
	}
}
