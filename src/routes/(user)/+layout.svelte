<script lang="ts">
	import { enhance } from '$app/forms'
	import { Search } from 'lucide-svelte'

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
		class="sticky top-0 z-50 border-b border-gray-700/50 bg-gray-800/80 px-4 py-3 shadow-lg backdrop-blur-md sm:px-6 md:px-8"
	>
		<div
			class="container mx-auto flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-0"
		>
			<a href="/" class="text-center sm:text-left">
				<h1 class="text-2xl font-bold text-[#E50914] sm:text-3xl">ZAPPLE PLAY</h1>
			</a>

			<div
				class="w-full max-w-[500px] sm:absolute sm:left-1/2 sm:w-1/2 sm:-translate-x-1/2 md:w-1/3"
			>
				<div class="relative">
					<form method="POST" action="/search" use:enhance>
						<input
							type="text"
							placeholder="Search videos..."
							class="w-full rounded-full bg-gray-700/70 px-4 py-2 pl-10 text-sm text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#E50914] sm:text-base"
							name="search"
							autocomplete="off"
						/>
						<button>
							<Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
						</button>
					</form>
				</div>
			</div>
		</div>
	</nav>

	<main class="container mx-auto px-4 py-6 sm:px-6 md:px-8 md:py-8">
		{@render children()}
	</main>
</div>

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
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		background-color: rgba(0, 0, 0, 0.7);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}
	main {
		padding: 1.5rem 1rem;
	}
	h1 {
		font-size: clamp(1.5rem, 5vw, 1.8rem);
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

	@media (max-width: 640px) {
		nav {
			padding: 0.75rem 1rem;
		}
		main {
			padding: 1rem;
		}
		.container {
			padding-left: 0.5rem;
			padding-right: 0.5rem;
		}
	}
</style>
