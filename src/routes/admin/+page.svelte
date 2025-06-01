<script lang="ts">
	import type { PageData } from './$types'
	import { Video, Eye, Play } from 'lucide-svelte'


	export let data: PageData
	const { popularVideos, totalVideos, totalViews } = data

	function formatNumber(num: number): string {
		if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
		if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
		return num.toString()
	}
</script>

<svelte:head>
	<title>Admin | Zapple Play</title>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>


<div class="container mx-auto min-h-screen p-4 text-gray-100 sm:p-6 lg:p-8">
	<div class="mb-8">
		<h1 class="mb-4 text-3xl font-bold text-gray-100">Video Dashboard</h1>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<div
				class="flex items-center rounded-lg bg-gray-800 p-6 shadow-md transition-shadow duration-300 hover:shadow-xl"
			>
				<Video class="mr-4 h-10 w-10 text-red-500" />
				<div>
					<h2 class="text-lg font-semibold text-gray-300">Total Videos</h2>
					<p class="text-2xl font-bold text-red-500">{totalVideos}</p>
				</div>
			</div>
			<div
				class="flex items-center rounded-lg bg-gray-800 p-6 shadow-md transition-shadow duration-300 hover:shadow-xl"
			>
				<Eye class="mr-4 h-10 w-10 text-red-500" />
				<div>
					<h2 class="text-lg font-semibold text-gray-300">Total Views</h2>
					<p class="text-2xl font-bold text-red-500">{formatNumber(totalViews._sum.views || 0)}</p>
				</div>
			</div>
		</div>

<div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
	<!-- Background Glow Effect -->
	<div class="absolute inset-0 z-0 bg-black">
		<div class="glow-effect"></div>
	</div>

	<div>
		<h2 class="mb-4 text-2xl font-bold text-gray-100">Popular Videos</h2>
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each popularVideos as video}
				<div
					class="overflow-hidden rounded-lg bg-gray-800 shadow-md transition-shadow duration-300 hover:shadow-xl"
				>
					<div class="relative">
						<img src={video.thumbnail} alt={video.name} class="h-48 w-full object-cover" />
						<div
							class="absolute right-2 top-2 rounded-full bg-red-500 p-2 transition-colors duration-200 hover:bg-red-400"
						>
							<Play class="h-6 w-6 text-gray-900" />
						</div>
					</div>
					<div class="p-4">
						<h3 class="truncate text-lg font-semibold text-gray-100">{video.name}</h3>
						<p class="line-clamp-2 text-sm text-gray-400">
							{video.description || 'No description available'}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
