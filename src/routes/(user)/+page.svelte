<!-- <script lang="ts">
	import { onMount } from 'svelte'

	let downloadSpeed = $state('')
	let uploadSpeed = $state('')
	let latency = $state(0)
	let userId: string | null = $state('')
	let userIp: string | null = $state('')

	onMount(async () => {
		fetch('https://api.ipify.org?format=json')
			.then((response) => response.json())
			.then((data) => {
				userIp = data.ip
			})
			.catch((error) => {
				console.error('Error fetching IP:', error)
			})

		function formatSpeed(bytesPerSecond: number) {
			// if (bytesPerSecond < 1024) {
			// 	return `${bytesPerSecond.toFixed(2)} B/s`
			// } else if (bytesPerSecond < 1024 * 1024) {
			// 	return `${(bytesPerSecond / 1024).toFixed(2)} KB/s`
			// } else {
			// 	return `${(bytesPerSecond / (1024 * 1024)).toFixed(2)} MB/s`
			// }

			return (bytesPerSecond / 1024).toFixed(2)
		}

		function testDownloadSpeed() {
			const startTime = performance.now()
			fetch(`/texas.jpg?startTime=${startTime}`)
				.then((response) => response.blob())
				.then((blob) => {
					const endTime = performance.now()
					const duration = endTime - startTime
					const speed = (blob.size / duration) * 1000 // in bytes/second
					downloadSpeed = formatSpeed(speed)

					console.log(`Download Speed: ${downloadSpeed}`)
				})
		}

		function testUploadSpeed() {
			const startTime = performance.now()
			const fileSize = 1 * 1024 * 1024 // 1 MB
			const data = new Blob([new ArrayBuffer(fileSize)], { type: 'application/octet-stream' })

			fetch('/api/test', {
				method: 'POST',
				body: data,
				headers: { 'Content-Type': 'application/octet-stream' }
			}).then(() => {
				const endTime = performance.now()
				const duration = endTime - startTime
				const speed = (fileSize / duration) * 1000 // in bytes/second
				uploadSpeed = formatSpeed(speed)

				console.log(`Upload Speed: ${uploadSpeed}`)
			})
		}

		function testLatency() {
			const startTime = performance.now()
			fetch('/api/test').then(() => {
				const endTime = performance.now()
				latency = endTime - startTime

				console.log(`Latency: ${latency.toFixed(2)} ms`)
			})
		}

		setInterval(async () => {
			testDownloadSpeed()
			testUploadSpeed()
			testLatency()

			await fetch('/api/speed-test', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userIp,
					downloadSpeed,
					uploadSpeed,
					latency
				})
			})
		}, 1000 * 10)
	})
</script> -->
<script lang="ts">
	import type { PageData } from './$types'
	export let data: PageData
</script>

<svelte:head>
	<title>Zapple Play</title>
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
