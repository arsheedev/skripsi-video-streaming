<script lang="ts">
	import * as Form from '$lib/components/ui/form'
	import { Input } from '$lib/components/ui/input'
	import ResetPasswordSchema from '$lib/schemas/reset-password'
	import { onMount } from 'svelte'
	import { toast } from 'svelte-sonner'
	import { fade } from 'svelte/transition'
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'

	let { data }: { data: { form: SuperValidated<Infer<typeof ResetPasswordSchema>> } } = $props()
	let loading = $state(false)
	let animated = $state(false)

	onMount(() => {
		setTimeout(() => {
			animated = true
		}, 300)
	})

	const form = superForm(data.form, {
		validators: zodClient(ResetPasswordSchema),
		onSubmit() {
			loading = true
		},
		onResult({ result }) {
			loading = false

			if (result.type === 'failure') {
				return toast.error(result.data?.message || 'Something went wrong!')
			}

			if (result.type === 'success') {
				return toast.success(result.data?.message || 'Check you email for reset password link!')
			}
		},
		onError() {
			loading = false
			return toast.error('Internal error!')
		}
	})

	const { form: formData, enhance } = form
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-black p-4">
	<div class="absolute inset-0 z-0 bg-gradient-to-br from-black via-gray-900 to-gray-800">
		<div class="glow-effect"></div>
	</div>
	<div
		class="z-10 w-full max-w-md rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-lg transition-all duration-500 {animated
			? 'scale-100 opacity-100'
			: 'scale-95 opacity-0'}"
		in:fade={{ duration: 300 }}
	>
		<div class="mb-8 text-center">
			<h1 class="animate-gradient mb-3 text-4xl font-bold text-red-600">Zapple Play</h1>
			<p class="text-sm text-gray-200/80">Input your new password</p>
		</div>

		<form method="POST" use:enhance class="space-y-6">
			<Form.Field {form} name="resetToken">
				<Form.Control>
					{#snippet children({ props })}
						<Input {...props} type="hidden" bind:value={$formData.resetToken} />
					{/snippet}
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="mb-2 block text-sm font-medium text-gray-100">Password</Form.Label>
						<Input
							{...props}
							type="password"
							disabled={loading}
							bind:value={$formData.password}
							class="w-full rounded-lg border border-gray-500/50 bg-gray-800/50 px-4 py-3 text-white transition-all duration-300 placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/50"
							placeholder="Enter your password"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="mt-1 text-xs text-red-400" />
			</Form.Field>

			<Form.Field {form} name="confirmPassword">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="mb-2 block text-sm font-medium text-gray-100"
							>Repeat Password</Form.Label
						>
						<Input
							{...props}
							type="password"
							disabled={loading}
							bind:value={$formData.confirmPassword}
							class="w-full rounded-lg border border-gray-500/50 bg-gray-800/50 px-4 py-3 text-white transition-all duration-300 placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/50"
							placeholder="Repeat your password"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="mt-1 text-xs text-red-400" />
			</Form.Field>

			<div class="pt-4">
				<Form.Button
					disabled={loading}
					class="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-red-600 to-red-800 py-3 font-semibold text-white transition-all duration-300 hover:from-red-700 hover:to-red-900 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#if loading}
						<svg class="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24">
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						Submitting...
					{:else}
						Submit
					{/if}
				</Form.Button>
			</div>
		</form>
	</div>
</div>

<style>
	:global(body) {
		font-family: 'Inter', sans-serif;
	}

	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	.animate-gradient {
		background-size: 200% 200%;
		animation: gradient 3s ease infinite;
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
