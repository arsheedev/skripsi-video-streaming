import db from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	const id = Number(url.searchParams.get('id'))
	const video = await db.videoAsset.findUnique({ where: { id }, include: { qualities: true } })

	return { video }
}
