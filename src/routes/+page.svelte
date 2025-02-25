<script lang="ts">
	import { createId } from '@paralleldrive/cuid2'
	import { onMount } from 'svelte'

	let downloadSpeed = $state('')
	let uploadSpeed = $state('')
	let latency = $state(0)
	let userId: string | null = $state('')
	let userIp: string | null = $state('')

	onMount(async () => {
		userId = localStorage.getItem('userId')

		if (!userId) {
			userId = createId()
		}

		fetch('https://api.ipify.org?format=json')
			.then((response) => response.json())
			.then((data) => {
				userIp = data.ip
			})
			.catch((error) => {
				console.error('Error fetching IP:', error)
			})

		function formatSpeed(bytesPerSecond: number) {
			if (bytesPerSecond < 1024) {
				return `${bytesPerSecond.toFixed(2)} B/s`
			} else if (bytesPerSecond < 1024 * 1024) {
				return `${(bytesPerSecond / 1024).toFixed(2)} KB/s`
			} else {
				return `${(bytesPerSecond / (1024 * 1024)).toFixed(2)} MB/s`
			}
		}

		function testDownloadSpeed() {
			const startTime = performance.now()
			fetch(`/images/texas.jpg?startTime=${startTime}`)
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

		testDownloadSpeed()
		testUploadSpeed()
		testLatency()

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
					userId,
					userIp,
					downloadSpeed,
					uploadSpeed,
					latency
				})
			})
		}, 1000 * 60)
	})
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<a href="/auth/login">login</a>
