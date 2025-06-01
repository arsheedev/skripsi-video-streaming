<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import * as Form from '$lib/components/ui/form'
	import CommentSchema from '$lib/schemas/comment'
	import { onMount } from 'svelte'
	import { toast } from 'svelte-sonner'
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'

	interface Props {
		data: {
			form: SuperValidated<Infer<typeof CommentSchema>>
		}
		videoAssetId: number
	}

	let { data, videoAssetId }: Props = $props()
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
				toast.success(result.data?.message || 'Comment saved!')
				invalidateAll()
			}
		},
		onError() {
			loading = false
			return toast.error('Internal error!')
		}
	})

	const { form: formData, enhance } = form
</script>

<div class="add-comment">
	<form method="POST" action="?/createComment&id={videoAssetId}" use:enhance class="form-container">
		<div class="input-container">
			<Form.Field {form} name="comment">
				<Form.Control>
					{#snippet children({ props })}
						<input
							{...props}
							disabled={loading}
							bind:value={$formData.comment}
							placeholder="Tambah komentar..."
							class="comment-input"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="field-errors" />
			</Form.Field>

			<Form.Button disabled={loading} class="post-btn">
				{#if loading}
					<span class="spinner">↻</span>
					Kirim...
				{:else}
					Kirim
				{/if}
			</Form.Button>
		</div>
	</form>
</div>

<style>
	.add-comment {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		margin-top: 24px;
	}

	.user-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
	}

	.form-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.input-container {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.comment-input {
		flex: 1;
		background: #000000; /* Changed to solid black */
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 20px;
		padding: 10px 16px;
		color: #ffffff !important; /* Ensure text is white for visibility */
		font-size: 0.9rem;
		outline: none;
	}

	.comment-input::placeholder {
		color: #aaaaaa;
	}

	.post-btn {
		background: #065fd4;
		color: white;
		border: none;
		border-radius: 20px;
		padding: 10px 16px;
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
	}

	.post-btn:hover {
		background: #0554b9;
	}

	.post-btn:disabled {
		background: #043f8c;
		cursor: not-allowed;
	}

	.spinner {
		display: inline-block;
		animation: spin 1s linear infinite;
		margin-right: 8px;
	}

	.field-errors {
		color: #ff5555;
		font-size: 0.8rem;
		margin-top: 4px;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 768px) {
		.comment-input {
			padding: 8px 14px;
		}

		.post-btn {
			padding: 8px 14px;
		}
	}
</style>
