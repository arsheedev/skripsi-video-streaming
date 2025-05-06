<script lang="ts">
	import 'fluid-player/src/css/fluidplayer.css'
	import { onMount } from 'svelte'

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

	onMount(async () => {
		const module = await import('fluid-player')
		const fluidPlayer = module.default
		fluidPlayer('player', {
			hls: {
				overrideNative: true
			},
			layoutControls: {
				fillToContainer: true
			}
		})
	})
</script>

<div class="video-container">
	<!-- svelte-ignore a11y_media_has_caption -->
	<video id="player" preload="metadata" poster={video.thumbnail}>
		<source src={video.url} type="application/x-mpegURL" />
	</video>
</div>

<style>
	.video-container {
		width: 100%;
		height: 60vh;
		min-height: 500px;
		max-height: 800px;
		background: #000;
	}

	#player {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	@media (max-width: 1024px) {
		.video-container {
			height: 60vh;
			min-height: 400px;
			max-height: 700px;
		}
	}

	@media (max-width: 768px) {
		.video-container {
			height: 50vh;
			min-height: 300px;
			max-height: 500px;
		}
	}

	@media (max-width: 480px) {
		.video-container {
			height: 40vh;
			min-height: 250px;
			max-height: 400px;
		}
	}
</style>
