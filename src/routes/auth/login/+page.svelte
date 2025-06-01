<script lang="ts">
	import { page } from '$app/state'
	import { toast } from 'svelte-sonner'
	import type { PageData } from './$types'
	import LoginForm from './LoginForm.svelte'

	let { data }: { data: PageData } = $props()

	if (page.url.searchParams.get('reset') === 'success') {
		toast.success('Password resetted successfully!')
	}
</script>

<svelte:head>
	<title>Login | Zapple Play</title>
</svelte:head>

<LoginForm {data} />
