<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { LayoutData } from './$types'
	import { User, LayoutDashboard, Video, LogOut } from 'lucide-svelte'
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'

	let { data, children }: { data: LayoutData; children: Snippet } = $props()

	// Sample admin username (replace with dynamic data as needed)
	const username = 'Admin User'
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
		rel="stylesheet"
	/>
	<script src="https://cdn.tailwindcss.com"></script>
</svelte:head>

<div class="relative flex min-h-screen overflow-hidden bg-black">
	<!-- Background Glow Effect -->
	<div class="absolute inset-0 z-0 bg-black">
		<div class="glow-effect"></div>
	</div>

	<!-- Sidebar -->
	<aside class="z-10 flex w-64 flex-col bg-white/10 p-6 shadow-2xl backdrop-blur-lg">
		<!-- Profile Section -->
		<div class="mb-8 flex flex-col items-center">
			<div
				class="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-800"
			>
				<User size={40} class="text-white" />
			</div>
			<h2 class="text-lg font-semibold text-gray-100">{username}</h2>
		</div>

		<!-- Navigation -->
		<nav class="flex-1">
			<ul class="space-y-2">
				<li>
					<a
						href="/admin"
						class="flex items-center rounded-lg px-4 py-3 text-gray-200 transition-all duration-300 hover:bg-red-600/20 hover:text-white {$page
							.url.pathname === '/admin'
							? 'bg-red-600/30 text-white'
							: ''}"
					>
						<LayoutDashboard size={20} class="mr-3" />
						Dashboard
					</a>
				</li>
				<li>
					<a
						href="/admin/upload"
						class="flex items-center rounded-lg px-4 py-3 text-gray-200 transition-all duration-300 hover:bg-red-600/20 hover:text-white {$page
							.url.pathname === '/admin/upload'
							? 'bg-red-600/30 text-white'
							: ''}"
					>
						<Video size={20} class="mr-3" />
						Upload Video
					</a>
				</li>
			</ul>
		</nav>

		<!-- Logout Button -->
		<div class="mt-auto pt-4">
			<a
				href="/auth/logout"
				class="flex w-full items-center justify-center rounded-lg bg-red-600/30 px-4 py-3 text-white transition-all duration-300 hover:bg-red-600/50"
			>
				<LogOut size={20} class="mr-3" />
				Logout
			</a>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="z-10 flex-1 p-8">
		{@render children()}
	</main>
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
