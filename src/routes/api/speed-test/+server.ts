import db from '$lib/server/db'
import { createId } from '@paralleldrive/cuid2'
import { json, type RequestHandler } from '@sveltejs/kit'

interface JsonData {
	userId: string
	userIp: string
	downloadSpeed: string
	uploadSpeed: string
	latency: number
}

export const POST: RequestHandler = async ({ request }) => {
	const { userIp, downloadSpeed, uploadSpeed, latency }: JsonData = await request.json()
	const userId = createId()

	await db.userSpeed.create({ data: { userId, userIp, downloadSpeed, uploadSpeed, latency } })

	return json({ message: 'success' })
}
