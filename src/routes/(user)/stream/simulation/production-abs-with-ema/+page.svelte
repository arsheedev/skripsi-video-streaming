<script lang="ts">
	import { browser } from '$app/environment'
	import Hls from 'hls.js'
	import { onDestroy } from 'svelte'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	let hls: Hls
	let speed = $state(0)
	let interval: NodeJS.Timeout

	function videoPlayer(node: HTMLVideoElement) {
		if (!data.video?.url) return

		hls = new Hls({ maxBufferLength: 5, maxMaxBufferLength: 10 })

		hls.loadSource(data.video.url)
		hls.attachMedia(node)

		interval = setInterval(async () => {
			speed = hls.bandwidthEstimate / 8 / 1000
		}, 5000)
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
	{/if}
{/if}
