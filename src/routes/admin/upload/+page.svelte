<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Progress } from '$lib/components/ui/progress'
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

{#if loading}
	<div class="flex flex-col items-center">
		<div class="mb-1 flex w-96 justify-between">
			<span class="mx-1">{formatBytes(uploadedBytes)} / {formatBytes(totalSize)}</span>
			<span class="mx-1">{formatBytes(speed)}/s</span>
		</div>
		<Progress class="w-96" value={percent} />
		<span>{percent}%</span>
	</div>
{:else}
	<div class="flex justify-center">
		<form
			class="flex w-[200px] flex-col gap-4"
			method="POST"
			enctype="multipart/form-data"
			on:submit|preventDefault={uploadVideo}
		>
			<label for="name">Name</label>
			<Input type="text" id="name" name="name" />
			<label for="description">Description</label>
			<Input type="text" id="description" name="description" />
			<label for="thumbnail">Thumbnail</label>
			<Input
				type="file"
				id="thumbnail"
				name="thumbnail"
				aria-label="Upload thumbnail"
				accept="image/*"
			/>
			<label for="file">Video</label>
			<Input type="file" id="file" name="file" aria-label="Upload File" accept="video/mp4" />
			{#if form?.error}
				<p class="ml-2 text-red-400">{form.error}</p>
			{/if}
			<div class="flex gap-4">
				<a href="/admin" class={buttonVariants({ variant: 'secondary', class: 'w-full' })}>
					Back
				</a>
				<Button class="w-full" type="submit">Upload</Button>
			</div>
		</form>
	</div>
{/if}
