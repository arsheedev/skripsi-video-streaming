<script lang="ts">
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
</script>

<svelte:head>
	<title>{data.video.name} Preview | Zapple Play</title>
</svelte:head>

<pre>{JSON.stringify(data.video, null, 2)}</pre>
