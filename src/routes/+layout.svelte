<script lang="ts">
	import type { Snippet } from 'svelte'
	import { Toaster } from 'svelte-sonner'
	import '../app.css'

	let { children }: { children: Snippet } = $props()
</script>

{@render children()}
<Toaster position="bottom-right" richColors={true} closeButton={true} />
