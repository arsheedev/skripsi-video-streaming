<script lang="ts">
	import type { PageData } from './$types'
	import ForgetPasswordForm from './ForgetPasswordForm.svelte'

	let { data }: { data: PageData } = $props()
</script>

<ForgetPasswordForm {data} />
