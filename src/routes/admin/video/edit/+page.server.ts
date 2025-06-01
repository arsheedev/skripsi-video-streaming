import EditVideoSchema from '$lib/schemas/edit-video'
import db from '$lib/server/db'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import fs from 'fs'
import sharp from 'sharp'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	const id = Number(url.searchParams.get('id'))
	const video = await db.videoAsset.findUnique({ where: { id } })

	if (!video) {
		redirect(303, '/not-found')
	}

	return { form: await superValidate(zod(EditVideoSchema)), video }
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(EditVideoSchema))

		if (!form.valid) {
			return fail(400, {
				form,
				message: ''
			})
		}

		const id = Number(event.url.searchParams.get('id'))
		const videoExist = await db.videoAsset.findUnique({ where: { id } })

		if (!videoExist) {
			return fail(404, {
				form,
				message: 'Data not found!'
			})
		}

		const { name, description, thumbnail } = form.data

		if (thumbnail) {
			if (!(thumbnail instanceof File)) {
				return fail(400, { form, message: 'Invalid image format!' })
			}

			if (thumbnail?.size === 0) {
				return fail(400, { form, message: 'Please input image!' })
			}

			if (!thumbnail.type.startsWith('image')) {
				return fail(400, { form, message: 'Inavalid image format!' })
			}

			const thumbnailData = await thumbnail.arrayBuffer()

			fs.rm(videoExist.thumbnail, async (err) => {
				if (err)
					return fail(400, {
						form,
						message: 'Failed to upload image!'
					})

				await sharp(thumbnailData).webp().toFile(videoExist.thumbnail)
			})
		}

		await db.videoAsset.update({ where: { id: videoExist.id }, data: { name, description } })
	}
}
