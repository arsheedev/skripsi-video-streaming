<script lang="ts">
	import * as Form from '$lib/components/ui/form'
	import { Input } from '$lib/components/ui/input'
	import LoginUserSchema from '$lib/schemas/login-user'
	import { toast } from 'svelte-sonner'
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'

	let { data }: { data: { form: SuperValidated<Infer<typeof LoginUserSchema>> } } = $props()
	let loading = $state(false)

	const form = superForm(data.form, {
		validators: zodClient(LoginUserSchema),
		onSubmit() {
			loading = true
		},
		onResult({ result }) {
			loading = false

			if (result.type === 'failure') {
				return toast.error(result.data?.message || 'Semething went wrong!')
			}

			if (result.type === 'redirect') {
				return toast.success('Succesffully login!')
			}
		},
		onError() {
			loading = false

			return toast.error('Internal error!')
		}
	})

	const { form: formData, enhance } = form
</script>

<form method="POST" use:enhance>
	<Form.Field {form} name="username">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Username</Form.Label>
				<Input {...props} disabled={loading} bind:value={$formData.username} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>password</Form.Label>
				<Input {...props} disabled={loading} type="password" bind:value={$formData.password} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button disabled={loading}>Submit</Form.Button>
</form>
