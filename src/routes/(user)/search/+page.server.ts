import db from '$lib/server/db'
import { redirect, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	const search = String(url.searchParams.get('q'))

	const videos = await db.videoAsset.findMany({ where: { name: { contains: search } } })

	return { videos }
}

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData()
		const search = formData.get('search')

		redirect(303, `/search?q=${search}`)
	}
}
