import db from '$lib/server/db'
import { transcode } from '$lib/server/transcode'
import { createId } from '@paralleldrive/cuid2'
import { fail, type Actions } from '@sveltejs/kit'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import util from 'util'

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData()
		const file = formData.get('file') as File | undefined
		const thumbnail = formData.get('thumbnail') as File | undefined
		const description = String(formData.get('description'))
		let name = String(formData.get('name'))

		if (!(file instanceof File)) {
			return fail(400, { error: 'Invalid image format!' })
		}

		if (file?.size === 0) {
			return fail(400, { error: 'Please input video!' })
		}

		if (!['video/mp4'].includes(file?.type as string)) {
			return fail(400, { error: 'Inavalid video format!' })
		}

		if (!(thumbnail instanceof File)) {
			return fail(400, { error: 'Invalid image format!' })
		}

		if (thumbnail?.size === 0) {
			return fail(400, { error: 'Please input image!' })
		}

		if (!thumbnail.type.startsWith('image')) {
			return fail(400, { error: 'Inavalid image format!' })
		}

		const dirname = process.cwd()
		const cuid = createId()
		const fileFormat = file.name.split('.').pop()
		const fileName = `temp.${fileFormat}`
		const uploadData = await file.arrayBuffer()
		const thumbnailData = await thumbnail.arrayBuffer()
		const isFolderExist = await checkFolderExist(path.join(dirname, 'files', 'videos', cuid))

		if (!isFolderExist.success) return { error: 'Failed to upload, try again!' }
		if (!name) {
			name = file.name
		}

		fs.mkdirSync(path.join(dirname, 'files', 'videos', cuid))
		fs.writeFileSync(
			path.join(dirname, 'files', 'videos', cuid, fileName),
			new Uint8Array(uploadData)
		)

		await sharp(thumbnailData)
			.webp()
			.toFile(path.join(dirname, 'files', 'videos', cuid, 'thumbnail.webp'))

		await transcode(
			path.join(dirname, 'files', 'videos', cuid, fileName),
			path.join(dirname, 'files', 'videos', cuid)
		)
		fs.rmSync(path.join(dirname, 'files', 'videos', cuid, fileName))

		await db.videoAsset.create({
			data: {
				name: name,
				url: `/files/videos/${cuid}/index.m3u8`,
				format: fileFormat || '',
				views: 0,
				description,
				thumbnail: `/files/videos/${cuid}/thumbnail.webp`,
				qualities: {
					createMany: {
						data: [
							{
								resolution: '426x240',
								bitrate: 500,
								url: `/files/videos/${cuid}/240p.m3u8`
							},

							{
								resolution: '640x480',
								bitrate: 1400,
								url: `/files/videos/${cuid}/480p.m3u8`
							},
							{
								resolution: '1280x720',
								bitrate: 2800,
								url: `/files/videos/${cuid}/720p.m3u8`
							}
						]
					}
				}
			}
		})

		return { success: 'Video uploded successfully!' }
	}
}

async function checkFolderExist(path: string) {
	const access = util.promisify(fs.access)

	try {
		await access(path, fs.constants.F_OK)

		return { success: false }
	} catch {
		return { success: true }
	}
}
