import db from '$lib/server/db'
import { redirect, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	const id = Number(url.searchParams.get('id'))
	const video = await db.videoAsset.findUnique({
		where: { id },
		include: { qualities: true, comments: { include: { User: true } } }
	})

	if (!video) {
		redirect(303, '/not-found')
	}

	return { video }
}

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData()
		const id = Number(formData.get('id'))

		await db.comment.delete({ where: { id } })

		return { message: 'Comment deleted!' }
	}
}
