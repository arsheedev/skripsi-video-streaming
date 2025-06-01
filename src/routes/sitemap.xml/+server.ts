import db from '$lib/server/db'
import type { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ setHeaders }) => {
	setHeaders({
		'Content-Type': 'application/xml'
	})

	const SITE = 'https://zappleplay.site'
	const videos = await db.videoAsset.findMany()

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${videos
	.map(
		(video) => `
<url>
    <loc>${SITE}/stream?id=${video.id}</loc>
    <lastmod>${video.updatedAt.toDateString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${SITE}${video.thumbnail}</image:loc>
      <image:caption>${video.name}</image:caption>
    </image:image>
  </url>
`
	)
	.join('')}
</urlset>`

	return new Response(sitemap)
}
