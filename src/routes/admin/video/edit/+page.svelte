<script lang="ts">
	import type { PageData } from './$types'
	import { superForm } from 'sveltekit-superforms/client'
	import { Video, Save, ArrowLeft } from 'lucide-svelte'
	import { fade } from 'svelte/transition'
	import { toast } from 'svelte-sonner'

	export let data: PageData
	const { form, errors, message, enhance } = superForm(data.form, {
		onResult({ result }) {
			if (result.type === 'success') {
				toast.success('Video updated successfully!')
			} else if (result.type === 'failure' && result.data?.message) {
				toast.error(result.data.message)
			}
		}
	})
</script>

<div class="min-h-screenp-4 container mx-auto text-gray-100 sm:p-6 lg:p-8">
	<div class="mx-auto max-w-lg">
		<h1 class="mb-6 flex animate-pulse items-center text-3xl font-extrabold text-gray-100">
			<Video class="mr-3 h-8 w-8 text-red-500" />
			Edit Video
		</h1>

		<div
			in:fade={{ duration: 300 }}
			class="rounded-xl border border-red-500/30 bg-gray-800/50 p-6 shadow-lg"
		>
			<form method="POST" use:enhance enctype="multipart/form-data">
				<div class="mb-4">
					<label for="name" class="block text-sm font-medium text-gray-300">Video Name</label>
					<input
						type="text"
						id="name"
						name="name"
						bind:value={$form.name}
						class="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-gray-100 transition-colors duration-200 focus:border-red-500 focus:ring focus:ring-red-500/50 focus:ring-opacity-50"
						placeholder="Enter video name"
					/>
					{#if $errors.name}
						<p class="mt-1 text-sm text-red-400">{$errors.name}</p>
					{/if}
				</div>

				<div class="mb-4">
					<label for="description" class="block text-sm font-medium text-gray-300"
						>Description</label
					>
					<textarea
						id="description"
						name="description"
						bind:value={$form.description}
						rows="4"
						class="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-gray-100 transition-colors duration-200 focus:border-red-500 focus:ring focus:ring-red-500/50 focus:ring-opacity-50"
						placeholder="Enter video description"
					></textarea>
					{#if $errors.description}
						<p class="mt-1 text-sm text-red-400">{$errors.description}</p>
					{/if}
				</div>

				<div class="mb-6">
					<label for="thumbnail" class="block text-sm font-medium text-gray-300">Thumbnail</label>
					<input
						type="file"
						id="thumbnail"
						name="thumbnail"
						accept="image/*"
						class="mt-1 block w-full text-gray-100 file:mr-4 file:rounded-full file:border-0 file:bg-red-500 file:px-4 file:py-2 file:font-medium file:text-white file:transition-colors file:duration-200 file:hover:bg-red-400"
					/>
					{#if $errors.thumbnail}
						<p class="mt-1 text-sm text-red-400">{$errors.thumbnail}</p>
					{/if}
					<p class="mt-1 text-xs text-gray-400">Upload an image (optional)</p>
				</div>

				<div class="flex items-center justify-between">
					<a
						href="/admin/video"
						class="inline-flex items-center rounded-full bg-gray-700 px-4 py-2 text-sm font-medium text-gray-100 transition-colors duration-200 hover:bg-gray-600"
					>
						<ArrowLeft class="mr-2 h-4 w-4" />
						Back
					</a>
					<button
						type="submit"
						class="inline-flex items-center rounded-full bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-sm font-medium text-white transition-transform duration-200 hover:scale-105"
					>
						<Save class="mr-2 h-4 w-4" />
						Save Changes
					</button>
				</div>
			</form>
		</div>

		{#if $message}
			<p class="mt-4 text-center text-sm text-gray-400">{$message}</p>
		{/if}
	</div>
</div>

<style>
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
