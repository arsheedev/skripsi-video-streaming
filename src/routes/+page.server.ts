import db from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const videos = await db.videoAsset.findMany()

	return { videos }
}
