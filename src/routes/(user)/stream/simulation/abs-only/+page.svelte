<script lang="ts">
	import { browser } from '$app/environment'
	import { page } from '$app/state'
	import Hls from 'hls.js'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	let hls: Hls
	let count = $state(0)
	let qualityChanged = $state(0)
	let bufferStalled = $state(0)
	let totalBufferDuration = $state(0)
	let bufferingStart: number | null = $state(null)
	const downloadSpeed = page.url.searchParams.get('speed')?.split(',') || [5000]

	function videoPlayer(node: HTMLVideoElement) {
		if (!data.video?.url) return

		hls = new Hls({ maxBufferLength: 5, maxMaxBufferLength: 10 })

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

		const interval = setInterval(() => {
			if (Number(downloadSpeed[count]) > 341) {
				hls.nextLevel = 2
				count++
			} else if (Number(downloadSpeed[count]) > 170) {
				hls.nextLevel = 1
				count++
			} else {
				hls.nextLevel = 0
				count++
			}

			if (count === downloadSpeed.length) count = 0
		}, 2000)
	}
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
		<!-- <button onclick={() => (hls.nextLevel = -1)}>auto</button>
		<button onclick={() => (hls.nextLevel = 0)}>240p</button>
		<button onclick={() => (hls.nextLevel = 1)}>480p</button>
		<button onclick={() => (hls.nextLevel = 2)}>720p</button> -->

		{#if Number(downloadSpeed[count]) > 341}
			<p>quality: 720p</p>
		{:else if Number(downloadSpeed[count]) > 170}
			<p>quality: 480p</p>
		{:else}
			<p>quality: 240p</p>
		{/if}
		<p>speed: {downloadSpeed[count]}</p>
		<p>Quality changed counts: {qualityChanged}</p>
		<p>Buffering counts: {bufferStalled}</p>
		<p>Total buffering time: {totalBufferDuration} ms</p>
	{/if}
{/if}
