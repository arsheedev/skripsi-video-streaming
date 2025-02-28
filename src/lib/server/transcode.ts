import { Transcoder } from 'simple-hls'

export async function transcode(inputPath: string, outputPath: string) {
	const transcode = new Transcoder(inputPath, outputPath, {
		renditions: customRenditions('videos'),
		showLogs: false
	})
	try {
		await transcode.transcode()
		return { success: true }
	} catch {
		return { success: false }
	}
}

function customRenditions(name: string) {
	return [
		{
			width: 426,
			height: 240,
			profile: 'main',
			hlsTime: '2',
			bv: '500k',
			maxrate: '535k',
			bufsize: '800k',
			ba: '64k',
			ts_title: `${name}_240p`,
			master_title: `${name}_240p`
		},
		{
			width: 640,
			height: 480,
			profile: 'main',
			hlsTime: '2',
			bv: '1400k',
			maxrate: '1498k',
			bufsize: '2100k',
			ba: '128k',
			ts_title: `${name}_480p`,
			master_title: `${name}_480p`
		},
		{
			width: 1280,
			height: 720,
			profile: 'main',
			hlsTime: '2',
			bv: '2800k',
			maxrate: '2996k',
			bufsize: '4200k',
			ba: '128k',
			ts_title: `${name}_720p`,
			master_title: `${name}_720p`
		}
	]
}
