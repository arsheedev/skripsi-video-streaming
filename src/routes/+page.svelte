<script lang="ts">
	import { onMount } from 'svelte'

	onMount(async () => {
		function formatSpeed(bytesPerSecond: number) {
			if (bytesPerSecond < 1024) {
				return `${bytesPerSecond.toFixed(2)} B/s`
			} else if (bytesPerSecond < 1024 * 1024) {
				return `${(bytesPerSecond / 1024).toFixed(2)} KB/s`
			} else {
				return `${(bytesPerSecond / (1024 * 1024)).toFixed(2)} MB/s`
			}
		}

		function testSpeed() {
			const startTime = performance.now()
			fetch('/texas.jpg?startTime=' + startTime)
				.then((response) => response.blob())
				.then((blob) => {
					const endTime = performance.now()
					const duration = endTime - startTime
					const speed = (blob.size / duration) * 1000 // in bytes/second
					const formattedSpeed = formatSpeed(speed)
					console.log(`Speed: ${formattedSpeed}`)
				})
		}

		testSpeed()

		setInterval(testSpeed, 10000)
	})
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<a href="/auth/login">login</a>
