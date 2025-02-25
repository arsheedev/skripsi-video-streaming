import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async () => {
	return json({ message: 'PING!' })
}

export const POST: RequestHandler = async () => {
	return json({ message: 'Upload received!' })
}
