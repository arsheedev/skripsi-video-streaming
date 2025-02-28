import db from '$lib/server/db'
import { transcode } from '$lib/server/transcode'
import { createId } from '@paralleldrive/cuid2'
import { fail, type Actions } from '@sveltejs/kit'
import fs from 'fs'
import path from 'path'
import util from 'util'

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData()
		const file = formData.get('file') as File | undefined

		if (!(file instanceof File)) {
			return fail(400, { error: 'Invalid image format!' })
		}

		if (file?.size === 0) {
			return fail(400, { error: 'Please input video!' })
		}

		if (!['video/mp4'].includes(file?.type as string)) {
			return fail(400, { error: 'Inavalid video format!' })
		}

		const dirname = process.cwd()
		const cuid = createId()
		const fileFormat = file.name.split('.').pop()
		const fileName = `temp.${fileFormat}`
		const uploadData = await file.arrayBuffer()
		const isFolderExist = await checkFolderExist(path.join(dirname, 'files', 'videos', cuid))

		if (!isFolderExist.success) return { error: 'Failed to upload, try again!' }

		fs.mkdirSync(path.join(dirname, 'files', 'videos', cuid))
		fs.writeFileSync(
			path.join(dirname, 'files', 'videos', cuid, fileName),
			new Uint8Array(uploadData)
		)
		await transcode(
			path.join(dirname, 'files', 'videos', cuid, fileName),
			path.join(dirname, 'files', 'videos', cuid)
		)
		fs.rmSync(path.join(dirname, 'files', 'videos', cuid, fileName))

		await db.videoAsset.create({
			data: {
				name: fileName,
				url: `/files/videos/${fileName}`,
				format: fileFormat || '',
				views: 0
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
