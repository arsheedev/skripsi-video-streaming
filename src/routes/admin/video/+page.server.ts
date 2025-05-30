import db from '$lib/server/db'
import type { Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const videos = await db.videoAsset.findMany()

	return { videos }
}

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData()
		const id = Number(formData.get('id'))

		await db.videoAsset.delete({ where: { id } })

		return { message: 'Video deleted successfully!' }
	}
}
