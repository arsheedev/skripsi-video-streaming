import db from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	const id = Number(url.searchParams.get('id'))
	const video = await db.videoAsset.findUnique({
		where: { id },
		include: { qualities: true }
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

	return { video, otherVideos }
}
