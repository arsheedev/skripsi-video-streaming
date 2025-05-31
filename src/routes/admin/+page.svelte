<script lang="ts">
	import { goto } from '$app/navigation'
	import { Upload } from 'lucide-svelte'

	// Function to handle navigation on button click
	const handleUpload = () => {
		goto('/admin/upload')
	}
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
	<!-- Background Glow Effect -->
	<div class="absolute inset-0 z-0 bg-black">
		<div class="glow-effect"></div>
	</div>

	<!-- Upload Button -->
	<div class="z-10">
		<button
			on:click={handleUpload}
			class="flex h-[200px] w-[400px] items-center justify-center rounded-xl border border-red-600/50 bg-white/10 text-lg font-semibold text-gray-200 backdrop-blur-lg transition-all duration-300 hover:bg-red-600/20"
		>
			<Upload size={28} class="mr-3" />
			Upload
		</button>
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
