<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<span class="chip">{@render children()}</span>

<style>
	.chip {
		display: inline-flex;
		align-items: center;
		height: 30px;
		padding: 0 12px;
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 500;
		line-height: 1;
		color: var(--text-secondary);
		background: var(--bg);
		border: 1px solid var(--border-strong);
		border-radius: 10px;
		white-space: nowrap;
	}
</style>
