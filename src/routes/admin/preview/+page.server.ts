import db from '$lib/server/db'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	const id = Number(url.searchParams.get('id'))
	const video = await db.videoAsset.findUnique({ where: { id }, include: { comments: true } })

	if (!video) {
		redirect(303, '/not-found')
	}

	return { video }
}
