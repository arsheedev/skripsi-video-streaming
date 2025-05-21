<script lang="ts">
	import * as Form from '$lib/components/ui/form'
	import { Input } from '$lib/components/ui/input'
	import CommentSchema from '$lib/schemas/comment'
	import { onMount } from 'svelte'
	import { toast } from 'svelte-sonner'
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'

	let {
		data,
		user
	}: {
		data: {
			form: SuperValidated<Infer<typeof CommentSchema>>
		}
		user: { name: string; username: string; imageUrl: string }
		videoAssetId: number
	} = $props()
	let loading = $state(false)
	let animated = $state(false)

	onMount(() => {
		setTimeout(() => {
			animated = true
		}, 300)
	})

	const form = superForm(data.form, {
		validators: zodClient(CommentSchema),
		onSubmit() {
			loading = true
		},
		onResult({ result }) {
			loading = false

			if (result.type === 'failure') {
				return toast.error(result.data?.message || 'Something went wrong!')
			}

			if (result.type === 'success') {
				return toast.success(result.data?.message || 'Comment saved!')
			}
		},
		onError() {
			loading = false
			return toast.error('Internal error!')
		}
	})

	const { form: formData, enhance } = form
</script>

<form method="POST" action="?/createComment" use:enhance class="space-y-6">
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Input {...props} type="hidden" bind:value={$formData.name} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="mt-1 text-xs text-red-300" />
	</Form.Field>

	<Form.Field {form} name="username">
		<Form.Control>
			{#snippet children({ props })}
				<Input {...props} type="hidden" bind:value={$formData.username} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="mt-1 text-xs text-red-300" />
	</Form.Field>

	<Form.Field {form} name="videoAssetId">
		<Form.Control>
			{#snippet children({ props })}
				<Input {...props} type="hidden" bind:value={$formData.videoAssetId} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="mt-1 text-xs text-red-300" />
	</Form.Field>

	<Form.Field {form} name="imageUrl">
		<Form.Control>
			{#snippet children({ props })}
				<Input {...props} type="hidden" bind:value={$formData.imageUrl} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="mt-1 text-xs text-red-300" />
	</Form.Field>

	<Form.Field {form} name="comment">
		<Form.Control>
			{#snippet children({ props })}
				<Input
					{...props}
					disabled={loading}
					bind:value={$formData.comment}
					placeholder="Type your comment here..."
					class="comment-input"
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
				Submiting...
			{:else}
				Login
			{/if}
		</Form.Button>
	</div>
</form>
