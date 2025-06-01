<script lang="ts">
	import { clearVideo, loadVideo } from '$lib/utils'
	import { onDestroy } from 'svelte'

	let bufferStalled = $state(0)
	let totalBufferDuration = $state(0)
	let bufferingStart: number | null = $state(null)

	const loadedVideo = loadVideo()

	function videoPlayer(node: HTMLVideoElement) {
		node.addEventListener('waiting', () => {
			bufferingStart = Date.now()
			bufferStalled++
			console.log('Buffering started')
		})

		node.addEventListener('playing', () => {
			if (bufferingStart) {
				const duration = Date.now() - bufferingStart
				totalBufferDuration += duration
				console.log('Buffering ended. Duration:', duration, 'ms')
				bufferingStart = null
			}
		})

		node.addEventListener('ended', () => {
			console.log('Video playback finished')
			clearVideo(loadedVideo)
		})
	}

	onDestroy(() => {
		clearVideo(loadedVideo)
	})
</script>

<!-- svelte-ignore a11y_media_has_caption -->
<video src="/test-video.mp4" controls use:videoPlayer></video>

<p>Buffering counts: {bufferStalled}</p>
<p>Total buffering time: {totalBufferDuration} ms</p>
