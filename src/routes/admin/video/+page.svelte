<script lang="ts">
	import { enhance } from '$app/forms'
	import { Pencil, Play, Trash2, Video } from 'lucide-svelte'
	import { toast } from 'svelte-sonner'
	import { fade, scale } from 'svelte/transition'
	import type { ActionData, PageData } from './$types'

	let { data, form }: { data: PageData; form: ActionData } = $props()

	if (form?.message) {
		toast.info(form.message)
	}

	function formatNumber(num: number): string {
		if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
		if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
		return num.toString()
	}
</script>

<svelte:head>
	<title>List Video | Zapple Play</title>
</svelte:head>

<div class="container mx-auto min-h-screen p-4 text-gray-100 sm:p-6 lg:p-8">
	<div class="mb-8">
		<h1 class="mb-4 flex animate-pulse items-center text-4xl font-extrabold text-gray-100">
			<Video class="mr-3 h-9 w-9 text-red-500" />
			Video List
		</h1>
	</div>

	<div>
		{#if data.videos.length === 0}
			<p in:fade class="text-center text-lg text-gray-400">No videos available</p>
		{:else}
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.videos as video, i}
					<div
						in:scale={{ delay: i * 100, duration: 300 }}
						class="relative overflow-hidden rounded-xl border border-red-500/30 bg-gray-800/50 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-red-500/20"
					>
						<div class="relative">
							<img
								src={video.thumbnail}
								alt={video.name}
								class="h-48 w-full object-cover brightness-75"
							/>
							<a href="/admin/preview?id={video.id}">
								<div
									class="absolute right-3 top-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 p-2 transition-transform duration-200 hover:scale-110"
								>
									<Play class="h-6 w-6 text-gray-900" />
								</div>
							</a>
						</div>
						<div class="p-5">
							<h3 class="truncate text-xl font-semibold text-gray-100">{video.name}</h3>
							<p class="mt-1 line-clamp-2 text-sm text-gray-400">
								{Intl.DateTimeFormat('en-EN', { dateStyle: 'long', timeStyle: 'short' }).format(
									video.createdAt
								)}
							</p>
							<div class="mt-3 flex items-center justify-between">
								<span class="text-sm text-gray-400">{formatNumber(video.views)} views</span>
								<div class="flex items-center space-x-3">
									<a
										href="/admin/preview?id={video.id}"
										rel="noopener noreferrer"
										class="inline-flex items-center rounded-full bg-gradient-to-r from-red-500 to-red-600 px-3 py-1 text-sm font-medium text-white transition-transform duration-200 hover:scale-105"
									>
										<Play class="mr-1 h-4 w-4" />
										Watch Now
									</a>
									<a
										href={`/admin/video/edit?id=${video.id}`}
										class="text-red-500 transition-transform duration-200 hover:scale-110 hover:text-red-400"
										aria-label={`Edit ${video.name}`}
									>
										<Pencil class="h-5 w-5" />
									</a>
									<form method="POST" use:enhance>
										<input type="hidden" name="id" value={video.id} />
										<button
											type="submit"
											class="text-red-500 transition-transform duration-200 hover:scale-110 hover:text-red-400"
											aria-label={`Delete ${video.name}`}
										>
											<Trash2 class="h-5 w-5" />
										</button>
									</form>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.8;
		}
	}
</style>
