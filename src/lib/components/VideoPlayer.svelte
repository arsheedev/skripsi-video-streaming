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
			}
		})
	})
</script>

<div class="h-[400px]">
	<!-- svelte-ignore a11y_media_has_caption -->
	<video id="player" width="600" preload="metadata" poster={video.thumbnail}>
		<source src={video.url} type="application/x-mpegURL" />
	</video>
</div>
