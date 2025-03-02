<script lang="ts">
	import { onMount } from 'svelte'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()

	onMount(() => {
		const video = document.getElementById('video') as HTMLVideoElement

		if (video.canPlayType('application/vnd.apple.mpegurl')) {
			video.src = String(data.video?.url)
			// @ts-ignore
		} else if (Hls.isSupported()) {
			// @ts-ignore
			var hls = new Hls()
			hls.loadSource(String(data.video?.url))
			hls.attachMedia(video)
		}
	})
</script>

<!-- svelte-ignore a11y_media_has_caption -->
<video id="video" controls preload="none"></video>
