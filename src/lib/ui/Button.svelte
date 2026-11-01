<script lang="ts">
	import type { Snippet } from 'svelte';

	/**
	 * Landing call-to-action. `primary` is the filled accent button; `ghost`
	 * mirrors the app's outlined action (hairline border, accent on hover).
	 * Without `href` it renders disabled — used while a link doesn't exist.
	 * With `type` it is a form button instead of a link.
	 */
	let {
		href,
		type,
		disabled = false,
		onclick,
		variant = 'primary',
		external = false,
		children
	}: {
		href?: string | null;
		type?: 'submit' | 'button';
		disabled?: boolean;
		onclick?: () => void;
		variant?: 'primary' | 'ghost';
		external?: boolean;
		children: Snippet;
	} = $props();
</script>

{#if type}
	<button class="btn {variant}" class:disabled {type} {disabled} {onclick}>{@render children()}</button>
{:else if href}
	<a
		class="btn {variant}"
		{href}
		{onclick}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener noreferrer' : undefined}
	>
		{@render children()}
	</a>
{:else}
	<span class="btn {variant} disabled" aria-disabled="true">{@render children()}</span>
{/if}

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		height: 48px;
		padding: 0 22px;
		border-radius: var(--radius);
		font-family: var(--font-mono);
		font-size: 14px;
		font-weight: 600;
		line-height: 1;
		white-space: nowrap;
		transition:
			background var(--transition-hover),
			border-color var(--transition-hover),
			color var(--transition-hover),
			box-shadow var(--transition-hover);
	}

	.primary {
		background: var(--primary);
		color: var(--on-primary);
		box-shadow: 0 0 0 0 rgb(var(--primary-rgb) / 0);
	}

	.primary:hover {
		background: #ff94c6;
		box-shadow: 0 8px 32px -8px rgb(var(--primary-rgb) / 0.55);
	}

	.ghost {
		color: var(--text);
		border: 1px solid transparent;
	}

	.ghost:hover {
		color: var(--primary);
		background: var(--surface-2);
		border-color: rgb(var(--primary-rgb) / 0.55);
	}

	button {
		cursor: pointer;
	}

	.disabled,
	.disabled:hover {
		cursor: default;
		background: var(--surface-2);
		color: var(--text-faint);
		border: 1px solid var(--border);
		box-shadow: none;
	}
</style>
