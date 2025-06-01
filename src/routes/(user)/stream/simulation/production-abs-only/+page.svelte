<script lang="ts">
	import { browser } from '$app/environment'
	import Hls from 'hls.js'
	import { onDestroy } from 'svelte'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	let hls: Hls
	let speed = $state(0)
	let qualityChanged = $state(0)
	let bufferStalled = $state(0)
	let totalBufferDuration = $state(0)
	let bufferingStart: number | null = $state(null)
	let interval: NodeJS.Timeout

	function videoPlayer(node: HTMLVideoElement) {
		if (!data.video?.url) return

		hls = new Hls({ maxMaxBufferLength: 30 })

		hls.loadSource(data.video.url)
		hls.attachMedia(node)

		hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
			qualityChanged++
		})

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

		interval = setInterval(async () => {
			speed = Math.round(await measureDownloadSpeed())
			if (speed > 341) {
				hls.nextLevel = 2
			} else if (speed > 170) {
				hls.nextLevel = 1
			} else {
				hls.nextLevel = 0
			}
		}, 10000)

		node.addEventListener('ended', () => {
			console.log('Video playback finished')
			clearInterval(interval)
		})
	}

	async function measureDownloadSpeed(): Promise<number> {
		const startTime = performance.now()
		const fileSizeInBytes = 1_000_000

		try {
			const response = await fetch('/test-file.bin', { cache: 'no-store' })
			await response.blob()

			const endTime = performance.now()
			const durationInSeconds = (endTime - startTime) / 1000

			// Speed in KBps
			const speedKbps = fileSizeInBytes / 1000 / durationInSeconds
			return speedKbps
		} catch (err) {
			console.error('Speed test failed', err)
			return 0
		}
	}

	onDestroy(() => clearInterval(interval))
</script>

{#if !data.video}
	<pre>{JSON.stringify(data, null, 2)}</pre>
{:else}
	<!-- svelte-ignore a11y_media_has_caption -->
	<video
		id="player"
		width="600"
		preload="metadata"
		poster={data.video.thumbnail}
		controls
		use:videoPlayer
	>
		<source type="application/x-mpegURL" />
	</video>
	{#if browser}
		{#if speed > 341}
			<p>quality: 720p</p>
		{:else if speed > 170}
			<p>quality: 480p</p>
		{:else}
			<p>quality: 240p</p>
		{/if}
		<p>speed: {speed}</p>
		<p>Quality changed counts: {qualityChanged}</p>
		<p>Buffering counts: {bufferStalled}</p>
		<p>Total buffering time: {totalBufferDuration} ms</p>
	{/if}
{/if}
