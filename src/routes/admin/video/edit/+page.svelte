<script lang="ts">
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
</script>

<svelte:head>
	<title>{data.video.name} Edit | Zapple Play</title>
</svelte:head>
