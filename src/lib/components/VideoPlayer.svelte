<script lang="ts">
	import 'fluid-player/src/css/fluidplayer.css'
	import { onDestroy, onMount } from 'svelte'

	interface QualityInterface {
		id: number
		url: string
		resolution: string
		bitrate: number
		videoAssetId: number | null
	}

	interface VideoInterface {
		id: number
		name: string
		description: string | null
		url: string
		format: string
		thumbnail: string
		views: number
		qualities: QualityInterface[]
	}

	let { video }: { video: VideoInterface } = $props()

	let videoEl: HTMLVideoElement
	let fluidInstance: any

	onMount(async () => {
		const module = await import('fluid-player')
		const fluidPlayer = module.default

		// Ensure any prior instance is cleared before initializing
		fluidInstance = fluidPlayer(videoEl.id, {
			hls: {
				overrideNative: true
			},
			layoutControls: {
				fillToContainer: true
			},
			modules: {
				configureHls: (options) => ({
					maxMaxBufferLength: 30,
					...options
				})
			}
		})
	})

	onDestroy(() => {
		if (videoEl) {
			// Stop video playback and reset src
			videoEl.pause()
			videoEl.removeAttribute('src')
			videoEl.load()
		}

		// Fluid Player does not have a public destroy() API,
		// but HLS.js inside it keeps running, so safest is to remove the element
		const existingEl = document.getElementById('player')
		if (existingEl) {
			existingEl.innerHTML = '' // clears child sources, etc.
		}
	})
</script>

<div>
	<!-- svelte-ignore a11y_media_has_caption -->
	<video id="player" bind:this={videoEl} preload="metadata" poster={video.thumbnail}>
		<source src={video.url} type="application/x-mpegURL" />
	</video>
</div>

<style>
	#player {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
</style>
