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

		fluidInstance = fluidPlayer(videoEl.id, {
			hls: {
				overrideNative: true
			},
			layoutControls: {
				fillToContainer: true,
				autoPlay: true
			},
			modules: {
				configureHls: (options) => ({
					maxMaxBufferLength: 30,
					startLevel: 0,
					...options
				})
			}
		})
	})

	onDestroy(() => {
		if (videoEl) {
			videoEl.pause()
			videoEl.removeAttribute('src')
			videoEl.load()
		}

		try {
			const wrapper = document.getElementById('fluid_video_wrapper_player')
			if (wrapper && wrapper.parentNode) {
				wrapper.parentNode.removeChild(wrapper)
			}
		} catch (error) {
			return
		}
	})
</script>

<!-- svelte-ignore a11y_media_has_caption -->
<video id="player" bind:this={videoEl} preload="metadata" poster={video.thumbnail}>
	<source src={video.url} type="application/x-mpegURL" />
</video>
