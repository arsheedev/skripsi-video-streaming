<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Search } from 'lucide-svelte'
	import { Toaster } from 'svelte-sonner'
	import '../../app.css'

	let { children } = $props()
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="font-poppins min-h-screen bg-black text-white">
	<nav
		class="sticky top-0 z-50 border-b border-gray-700/50 bg-gray-800/80 px-8 py-4 shadow-lg backdrop-blur-md"
	>
		<div class="container mx-auto flex items-center justify-between">
			<h1 class="text-3xl font-bold text-[#E50914]">ZAPPLE PLAY</h1>

			<div class="absolute left-1/2 w-1/3 min-w-[300px] -translate-x-1/2 transform">
				<div class="relative">
					<input
						type="text"
						placeholder="Search videos..."
						class="w-full rounded-full bg-gray-700/70 px-4 py-2 pl-10 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#E50914]"
					/>
					<Search class="absolute left-3 top-2.5 text-gray-400" size={20} />
				</div>
			</div>

			<Button
				href="/auth/login"
				class="rounded-md bg-[#E50914] px-6 py-2 font-medium text-white transition hover:bg-[#f6121d]"
			>
				Login
			</Button>
		</div>
	</nav>

	<main class="container mx-auto px-8 py-8">
		{@render children()}
	</main>
</div>

<Toaster position="top-right" richColors={true} closeButton={true} />

<style>
	:global(:root) {
		font-family: 'Poppins', sans-serif;
	}
	:global(body) {
		background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
		margin: 0;
		padding: 0;
		min-height: 100vh;
	}
	nav {
		padding: 1rem 2rem;
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		background-color: rgba(0, 0, 0, 0.7);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}
	main {
		padding: 2rem;
	}
	h1 {
		font-size: 1.8rem;
		color: #e50914;
		font-weight: 700;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}
	input {
		background-color: rgba(55, 65, 81, 0.5);
		color: white;
	}
	input::placeholder {
		color: rgba(209, 213, 219, 0.7);
	}
</style>
