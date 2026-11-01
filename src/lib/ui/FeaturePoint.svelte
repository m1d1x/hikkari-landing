<script lang="ts">
	import Icon from './Icon.svelte';
	import type { IconName } from './icons';

	let { icon, title, text }: { icon: IconName; title: string; text?: string } = $props();
</script>

<div class="point" class:solo={!text}>
	<span class="badge"><Icon name={icon} size={18} /></span>
	<div>
		<p class="title">{title}</p>
		{#if text}<p class="text">{text}</p>{/if}
	</div>
</div>

<style>
	.point {
		display: flex;
		gap: 16px;
		align-items: flex-start;
	}

	.badge {
		flex: none;
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border-radius: 12px;
		background: var(--surface);
		border: 1px solid var(--border-strong);
		color: var(--text-secondary);
	}

	.solo {
		align-items: center;
	}

	.solo .title {
		font-size: 16px;
	}

	.title {
		font-family: var(--font-mono);
		font-size: 14px;
		font-weight: 600;
		color: var(--text);
		line-height: 1.4;
	}

	.text {
		margin-top: 4px;
		font-size: 14px;
		line-height: 1.55;
		color: var(--text-muted);
	}
</style>
