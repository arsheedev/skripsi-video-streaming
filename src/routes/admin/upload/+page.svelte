<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Progress } from '$lib/components/ui/progress'
	import { Textarea } from '$lib/components/ui/textarea'
	import axios from 'axios'
	import { toast } from 'svelte-sonner'
	import type { ActionData } from './$types'

	export let form: ActionData

	let loading = false
	let speed = 0
	let uploadedBytes = 0
	let totalSize = 0
	let percent = 0

	function formatBytes(bytes: number) {
		if (bytes === 0) return '0 B'
		const k = 1024
		const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}

	async function uploadVideo(event: { currentTarget: EventTarget & HTMLFormElement }) {
		loading = true

		const formData = new FormData(event.currentTarget)
		const { data: response } = await axios({
			method: 'POST',
			data: formData,
			url: '/admin/upload',
			onUploadProgress(progressEvent) {
				const { loaded, total } = progressEvent

				speed = loaded - uploadedBytes
				percent = Math.floor((loaded * 100) / Number(total))
				uploadedBytes = loaded
				totalSize = Number(total)
			}
		})
		const data = JSON.parse(response.data)

		loading = false

		if (data[0].success) toast.success(data[1])
		if (data[0].error) toast.error(data[1])
	}
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
		rel="stylesheet"
	/>
	<script src="https://cdn.tailwindcss.com"></script>
</svelte:head>

<div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
	<!-- Background Glow Effect -->
	<div class="absolute inset-0 z-0 bg-black">
		<div class="glow-effect"></div>
	</div>

	<!-- Upload Form -->
	<div class="z-10 flex h-screen w-full items-center justify-center p-6">
		{#if loading}
			<div class="flex w-full flex-col items-center">
				<div class="mb-2 flex w-full max-w-2xl justify-between text-gray-200">
					<span class="mx-1">{formatBytes(uploadedBytes)} / {formatBytes(totalSize)}</span>
					<span class="mx-1">{formatBytes(speed)}/s</span>
				</div>
				<Progress class="w-full max-w-2xl" value={percent} />
				<span class="mt-2 text-gray-200">{percent}%</span>
			</div>
		{:else}
			<form
				class="flex h-full w-full flex-col justify-center gap-4"
				method="POST"
				enctype="multipart/form-data"
				on:submit|preventDefault={uploadVideo}
			>
				<!-- Video and Thumbnail Upload Areas -->
				<div class="flex w-full justify-between gap-6">
					<!-- Video Upload Area (Left) -->
					<div class="w-1/2">
						<label for="file" class="mb-2 block text-gray-200">Video</label>
						<Input
							type="file"
							id="file"
							name="file"
							aria-label="Upload Video"
							accept="video/mp4"
							class="hidden"
						/>
						<label
							for="file"
							class="flex h-48 w-full cursor-pointer items-center justify-center rounded-lg border-4 border-purple-500/50 bg-white text-center text-3xl font-bold text-black transition-all duration-300 hover:bg-gray-100"
						>
							UPLOAD
						</label>
					</div>

					<!-- Thumbnail Upload Area (Right) -->
					<div class="w-1/2">
						<label for="thumbnail" class="mb-2 block text-gray-200">Thumbnail</label>
						<Input
							type="file"
							id="thumbnail"
							name="thumbnail"
							aria-label="Upload Thumbnail"
							accept="image/*"
							class="hidden"
						/>
						<label
							for="thumbnail"
							class="flex h-48 w-full cursor-pointer items-center justify-center rounded-lg border border-gray-500/50 bg-gray-800/50 text-gray-200 transition-all duration-300 hover:bg-gray-700"
						>
							upload thumbnail
						</label>
					</div>
				</div>

				<!-- Title and Description Inputs -->
				<div class="w-full">
					<div class="mb-4">
						<label for="name" class="mb-2 block text-gray-200">Judul</label>
						<Input
							type="text"
							id="name"
							name="name"
							class="h-10 w-full rounded-lg border-gray-500/50 bg-gray-800/50 p-2 text-gray-200"
						/>
					</div>
					<div>
						<label for="description" class="mb-2 block text-gray-200">Deskripsi</label>
						<Textarea
							id="description"
							name="description"
							class="h-32 w-full rounded-lg border-gray-500/50 bg-gray-800/50 p-2 text-gray-200"
						/>
					</div>
				</div>

				{#if form?.error}
					<p class="text-red-400">{form.error}</p>
				{/if}

				<div class="flex w-full max-w-2xl gap-4">
					<a
						href="/admin"
						class="inline-flex w-1/2 items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
					>
						Back
					</a>
					<button
						type="submit"
						class="inline-flex w-1/2 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
					>
						Upload
					</button>
				</div>
			</form>
		{/if}
	</div>
</div>

<style>
	:global(body) {
		font-family: 'Inter', sans-serif;
	}

	.glow-effect {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(circle 150px at 10% 10%, rgba(255, 255, 255, 0.15) 0%, transparent 100%),
			radial-gradient(circle 150px at 90% 20%, rgba(255, 255, 255, 0.12) 0%, transparent 100%),
			radial-gradient(circle 150px at 30% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 100%),
			radial-gradient(circle 150px at 70% 60%, rgba(255, 255, 255, 0.08) 0%, transparent 100%);
		animation: slow-glow 20s ease-in-out infinite;
		pointer-events: none;
	}

	@keyframes slow-glow {
		0% {
			transform: translate(0%, 0%) scale(1);
			opacity: 0.9;
		}
		25% {
			transform: translate(10%, 5%) scale(1.1);
			opacity: 0.95;
		}
		50% {
			transform: translate(5%, 10%) scale(1);
			opacity: 0.9;
		}
		75% {
			transform: translate(-5%, -5%) scale(1.05);
			opacity: 0.95;
		}
		100% {
			transform: translate(0%, 0%) scale(1);
			opacity: 0.9;
		}
	}
</style>
