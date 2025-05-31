<script lang="ts">
	import type { PageData } from './$types'
	import LoginForm from './LoginForm.svelte'

	let { data }: { data: PageData } = $props()
</script>

<svelte:head>
	<title>Login | Zapple Play</title>
</svelte:head>

<LoginForm {data} />
