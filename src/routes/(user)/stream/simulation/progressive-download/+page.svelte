<script lang="ts">
	import { clearVideo, loadVideo } from '$lib/utils'
	import { onDestroy } from 'svelte'

	const loadedVideo = loadVideo()

	onDestroy(() => {
		clearVideo(loadedVideo)
	})
</script>

<!-- svelte-ignore a11y_media_has_caption -->
<video src="/test-video.mp4" controls></video>
