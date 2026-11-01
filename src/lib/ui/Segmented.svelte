<script lang="ts" generics="T extends string">
	/** NekkoSegmented: dark track with equal pills; the active one on surface2. */
	let {
		segments,
		selected = $bindable(),
		label
	}: { segments: { value: T; label: string }[]; selected: T; label: string } = $props();
</script>

<div class="track" role="tablist" aria-label={label}>
	{#each segments as segment (segment.value)}
		<button
			class="pill"
			class:active={selected === segment.value}
			role="tab"
			aria-selected={selected === segment.value}
			onclick={() => (selected = segment.value)}
		>
			{segment.label}
		</button>
	{/each}
</div>

<style>
	.track {
		display: flex;
		gap: 4px;
		height: 40px;
		padding: 4px;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: var(--radius);
	}

	.pill {
		flex: 1 1 0;
		min-width: 0;
		border-radius: 10px;
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 500;
		line-height: 1;
		color: var(--text-muted);
		transition:
			background var(--transition-hover),
			color var(--transition-hover);
	}

	.pill:hover:not(.active) {
		background: rgb(31 31 35 / 0.4);
		color: var(--text);
	}

	.pill.active {
		background: var(--surface-2);
		color: var(--text);
	}
</style>
