<script lang="ts">
	import type { Snippet } from 'svelte';
	import { reveal } from '#lib/actions/reveal.ts';

	/** Eyebrow (number + label), headline and lead shared by feature sections. */
	let {
		index,
		eyebrow,
		title,
		lead
	}: { index?: string; eyebrow?: string; title: Snippet; lead?: Snippet } = $props();
</script>

<header class="head" data-reveal use:reveal>
	{#if index || eyebrow}
		<p class="eyebrow">
			{#if index}<span class="index">{index}</span><span class="rule"></span>{/if}
			{eyebrow}
		</p>
	{/if}
	<h2>{@render title()}</h2>
	{#if lead}<p class="lead">{@render lead()}</p>{/if}
</header>

<style>
	.eyebrow {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 22px;
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.14em;
		color: var(--text-muted);
	}

	.index {
		color: var(--primary);
	}

	.rule {
		width: 28px;
		height: 1px;
		background: var(--border-strong);
	}

	h2 {
		font-size: clamp(32px, 3.6vw, 48px);
		font-weight: 600;
		line-height: 1.05;
		letter-spacing: -0.025em;
		text-wrap: balance;
	}


	.lead {
		max-width: 34em;
		margin-top: 22px;
		font-size: 17px;
		line-height: 1.6;
		color: var(--text-muted);
		text-wrap: pretty;
	}

	.lead :global(a) {
		color: var(--primary);
		text-decoration: underline;
		text-decoration-color: rgb(var(--primary-rgb) / 0.4);
		text-underline-offset: 4px;
		transition:
			color var(--transition-hover),
			text-decoration-color var(--transition-hover);
	}

	.lead :global(a:hover) {
		text-decoration-color: var(--primary);
	}
</style>
