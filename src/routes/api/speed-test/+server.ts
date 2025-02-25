import db from '$lib/server/db'
import { json, type RequestHandler } from '@sveltejs/kit'

interface JsonData {
	userId: string
	userIp: string
	downloadSpeed: string
	uploadSpeed: string
	latency: number
}

export const POST: RequestHandler = async ({ request }) => {
	const { userId, userIp, downloadSpeed, uploadSpeed, latency }: JsonData = await request.json()

	await db.userSpeed.create({ data: { userId, userIp, downloadSpeed, uploadSpeed, latency } })

	return json({ message: 'success' })
}
