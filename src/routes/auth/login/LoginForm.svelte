<script lang="ts">
	import * as Form from '$lib/components/ui/form'
	import { Input } from '$lib/components/ui/input'
	import LoginUserSchema from '$lib/schemas/login-user'
	import { toast } from 'svelte-sonner'
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { fade } from 'svelte/transition'
	import { onMount } from 'svelte'

	let { data }: { data: { form: SuperValidated<Infer<typeof LoginUserSchema>> } } = $props()
	let loading = $state(false)
	let animated = $state(false)

	onMount(() => {
		setTimeout(() => {
			animated = true
		}, 300)
	})

	const form = superForm(data.form, {
		validators: zodClient(LoginUserSchema),
		onSubmit() {
			loading = true
		},
		onResult({ result }) {
			loading = false

			if (result.type === 'failure') {
				return toast.error(result.data?.message || 'Something went wrong!')
			}

			if (result.type === 'redirect') {
				return toast.success('Successfully logged in!')
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
		href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="font-poppins flex min-h-96 items-center justify-center p-4">
	<div
		class="w-full max-w-md rounded-xl bg-white/10 p-8 backdrop-blur-md transition-all duration-500 {animated
			? 'scale-100 opacity-100'
			: 'scale-95 opacity-0'}"
		in:fade={{ duration: 300 }}
	>
		<div class="mb-8 text-center">
			<h1
				class="mb-2 bg-red-600 bg-clip-text text-4xl font-bold text-transparent"
				class:animate-pulse={animated}
			>
				Zapple Play
			</h1>
			<p class="text-white/80">Welcome back! Please login to your account</p>
		</div>

		<form method="POST" use:enhance class="space-y-6">
			<Form.Field {form} name="username">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="mb-1 block text-sm font-medium text-white/90">Username</Form.Label>
						<Input
							{...props}
							disabled={loading}
							bind:value={$formData.username}
							class="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white transition placeholder:text-white/50 focus:border-transparent focus:ring-2 focus:ring-purple-300"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="mt-1 text-xs text-red-300" />
			</Form.Field>

			<Form.Field {form} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="mb-1 block text-sm font-medium text-white/90">Password</Form.Label>
						<Input
							{...props}
							disabled={loading}
							type="password"
							bind:value={$formData.password}
							class="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white transition placeholder:text-white/50 focus:border-transparent focus:ring-2 focus:ring-purple-300"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="mt-1 text-xs text-red-300" />
			</Form.Field>

			<div class="pt-2">
				<Form.Button
					disabled={loading}
					class="w-full rounded-lg bg-red-700 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
				>
					{#if loading}
						<span class="mr-2 inline-block animate-spin">↻</span>
						Logging in...
					{:else}
						Login
					{/if}
				</Form.Button>
			</div>

			<div class="mt-6 text-center text-sm text-white/70">
				<p class="mb-4">
					By registering, you agree to the Terms, Conditions and Policies of Boroslie & Privacy
					Policy
				</p>
			</div>
		</form>
	</div>
</div>

<style global>
	:root {
		font-family: 'Poppins', sans-serif;
	}
	@keyframes gradient-pulse {
		0%,
		100% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
	}
</style>
