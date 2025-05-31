<script lang="ts">
	import { page } from '$app/state'
	import type { PageData } from './$types'
	import ResetPasswordForm from './ResetPasswordForm.svelte'

	let { data }: { data: PageData } = $props()

	data.form.data.resetToken = String(page.url.searchParams.get('token'))
</script>

<ResetPasswordForm {data} />
