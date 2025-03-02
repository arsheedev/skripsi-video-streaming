import { error } from '@sveltejs/kit'
import fs from 'fs'
import path from 'path'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ params }) => {
	const dirname = process.cwd()
	const file = fs.readFileSync(path.join(dirname, 'files', 'videos', params.file as string))
	console.log(params.file)

	try {
		return new Response(file, {
			status: 200,
			headers: {
				'Content-Type': 'image/webp',
				'Content-Length': file.length.toString()
			}
		})
	} catch (err) {
		if (err instanceof Error) {
			throw error(400, err.message)
		}

		throw error(400, 'Unknown error occured while uploading file')
	}
}
