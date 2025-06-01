import db from '$lib/server/db'
import type { Actions } from '@sveltejs/kit'
import fs from 'fs'
import path from 'path'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const videos = await db.videoAsset.findMany()

	return { videos }
}

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData()
		const id = Number(formData.get('id'))

		const video = await db.videoAsset.delete({ where: { id } })

		fs.rm(
			path.join(process.cwd(), video.url.replace(/\/index\.m3u8$/, '')),
			{ recursive: true, force: true },
			() => {
				return
			}
		)

		return { message: 'Video deleted successfully!' }
	}
}
