<script lang="ts">
	import type { Snippet } from 'svelte';

	/** Desktop window chrome around a replica of the client's interface. */
	let { title = 'hikkari', children }: { title?: string; children: Snippet } = $props();
</script>

<div class="window">
	<div class="bar">
		<span class="lights" aria-hidden="true"><i></i><i></i><i></i></span>
		<span class="title">{title}</span>
	</div>
	<div class="body">{@render children()}</div>
</div>

<style>
	.window {
		background: var(--bg);
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-lg);
		box-shadow:
			0 40px 80px -24px rgb(0 0 0 / 0.7),
			0 0 0 1px rgb(0 0 0 / 0.4);
		overflow: hidden;
	}

	.bar {
		position: relative;
		display: flex;
		align-items: center;
		height: 38px;
		padding: 0 14px;
		border-bottom: 1px solid var(--border);
	}

	.lights {
		display: flex;
		gap: 8px;
	}

	/* Neutral window controls: the colour stays reserved for the accent. */
	.lights i {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: rgb(255 255 255 / 0.14);
	}

	.title {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 500;
		color: var(--text-muted);
		pointer-events: none;
	}
</style>
