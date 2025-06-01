import db from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const popularVideos = await db.videoAsset.findMany({ take: 6, orderBy: { views: 'desc' } })
	const totalVideos = (await db.videoAsset.findMany()).length
	const totalViews = await db.videoAsset.aggregate({ _sum: { views: true } })

	return { totalVideos, popularVideos, totalViews }
}
