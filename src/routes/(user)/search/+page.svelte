<script lang="ts">
	import { page } from '$app/state'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
</script>

<svelte:head>
	<title>{page.url.searchParams.get('q')} | Zapple Play</title>
</svelte:head>

<div class="mb-6 mt-8 flex items-center space-x-3">
	<div class="h-6 w-1 rounded-full bg-red-500"></div>
	<h2 class="text-lg font-semibold text-gray-100">List Videos</h2>
</div>
<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
	{#each data.videos as video}
		<a
			href="/stream?id={video.id}"
			class="group block overflow-hidden transition-transform duration-200 hover:scale-[1.03]"
		>
			<div class="relative mb-3 aspect-video w-full">
				<img src={video.thumbnail} alt={video.name} class="h-full w-full rounded-xl object-cover" />
				<div
					class="absolute inset-0 bg-black bg-opacity-0 transition group-hover:bg-opacity-10"
				></div>
			</div>

			<h3 class="line-clamp-2 px-1 text-base font-medium text-gray-100">
				{video.name}
			</h3>
		</a>
	{/each}
</div>
