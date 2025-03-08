<script lang="ts">
	import VideoPlayer from '$lib/components/VideoPlayer.svelte'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
</script>

{#if !data.video}
	<pre>{JSON.stringify(data, null, 2)}</pre>
{:else}
	<VideoPlayer video={data.video} />
{/if}
