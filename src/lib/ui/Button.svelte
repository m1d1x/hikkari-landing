<script lang="ts">
	import type { Snippet } from 'svelte';

	/**
	 * Landing call-to-action. `primary` is the filled accent button; `ghost`
	 * uses a transparent background and changes colour on hover / keyboard focus.
	 * Only primary buttons animate a dashed contour and centre-out text fill.
	 * Without `href` it renders disabled — used while a link doesn't exist.
	 * With `type` it is a form button instead of a link.
	 */
	let {
		href,
		type,
		disabled = false,
		onclick,
		variant = 'primary',
		size = 'regular',
		external = false,
		children
	}: {
		href?: string | null;
		type?: 'submit' | 'button';
		disabled?: boolean;
		onclick?: () => void;
		variant?: 'primary' | 'ghost';
		size?: 'regular' | 'compact';
		external?: boolean;
		children: Snippet;
	} = $props();

	// Fit a whole number of dash/gap pairs to the closed path. This keeps
	// the first and last dash continuous at every button width and phase.
	function fitContour(node: SVGRectElement) {
		const update = () => {
			const pairs = Math.max(1, Math.round(node.getTotalLength() / 14));
			node.setAttribute('pathLength', String(pairs * 14));
		};
		const observer = new ResizeObserver(update);
		observer.observe(node);
		update();
		return { destroy: () => observer.disconnect() };
	}
</script>

{#snippet content()}
	{#if variant === 'primary'}
		<svg class="contour" aria-hidden="true" focusable="false">
			<rect use:fitContour x="1" y="1" rx="13" />
		</svg>
	{/if}
	<span class="label icon-text">{@render children()}</span>
{/snippet}

{#if type}
	<button class="btn {variant} {size}" class:disabled {type} {disabled} {onclick}>{@render content()}</button>
{:else if href}
	<a
		class="btn {variant} {size}"
		{href}
		{onclick}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener noreferrer' : undefined}
	>
		{@render content()}
	</a>
{:else}
	<span class="btn {variant} disabled" aria-disabled="true">{@render content()}</span>
{/if}

<style>
	.btn {
		--label-color: var(--on-primary);
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 48px;
		padding: 0 22px;
		border: 0;
		border-radius: var(--radius);
		font-family: var(--font-mono);
		font-size: 14px;
		font-weight: 600;
		line-height: 1;
		white-space: nowrap;
		color: var(--label-color);
		transition: background var(--transition-hover);
	}

	.compact { height: 40px; padding: 0 16px; font-size: 13px; }
	.compact .label { gap: 8px; }

	.primary { background: var(--primary); }
	.ghost {
		--label-color: var(--text);
		background: transparent;
	}

	.label {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		color: transparent;
		background-image:
			linear-gradient(var(--primary), var(--primary)),
			linear-gradient(var(--label-color), var(--label-color));
		background-size: 0% 100%, 100% 100%;
		background-position: center;
		background-repeat: no-repeat;
		background-clip: text;
		-webkit-background-clip: text;
		transition: background-size 480ms var(--ease);
	}

	.ghost .label {
		color: var(--label-color);
		background: none;
		transition: color var(--transition-hover);
	}

	.ghost:not(.disabled):focus-visible { --label-color: var(--primary); }

	@media (hover: hover) and (pointer: fine) {
		.ghost:not(.disabled):hover { --label-color: var(--primary); }
	}

	.label :global(svg) {
		color: var(--label-color);
		transition: color 300ms ease;
	}

	.contour {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
		pointer-events: none;
		fill: none;
		stroke: var(--primary);
		stroke-width: 2;
		stroke-dasharray: 8 6;
		opacity: 0;
		transition: opacity var(--transition-hover);
	}

	.contour rect {
		width: calc(100% - 2px);
		height: calc(100% - 2px);
		animation: contour-travel 800ms linear infinite paused;
	}

	/* Hover is limited to mouse/trackpad so touch does not retain it. */
	@media (hover: hover) and (pointer: fine) {
		.primary:not(.disabled):hover { background: transparent; }
		.primary:not(.disabled):hover .contour { opacity: 1; }
		.primary:not(.disabled):hover .contour rect { animation-play-state: running; }
		.primary:not(.disabled):hover .label { background-size: 100% 100%, 100% 100%; }
		.primary:not(.disabled):hover .label :global(svg) { color: var(--primary); }
	}

	.primary:not(.disabled):focus-visible { background: transparent; }
	.primary:not(.disabled):focus-visible .contour { opacity: 1; }
	.primary:not(.disabled):focus-visible .contour rect { animation-play-state: running; }
	.primary:not(.disabled):focus-visible .label { background-size: 100% 100%, 100% 100%; }
	.primary:not(.disabled):focus-visible .label :global(svg) { color: var(--primary); }

	@keyframes contour-travel {
		to { stroke-dashoffset: -28; }
	}

	.disabled {
		--label-color: var(--text-faint);
		cursor: default;
		background: var(--surface-2);
		border: 1px solid var(--border);
	}

	@media (prefers-reduced-motion: reduce) {
		.btn, .label, .contour, .label :global(svg) { transition: none; }
		.contour rect { animation: none; }
	}
</style>
