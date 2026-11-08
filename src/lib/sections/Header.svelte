<script lang="ts">
	import { nav } from '#lib/site.ts';
	import Icon from '#lib/ui/Icon.svelte';
	import Button from '#lib/ui/Button.svelte';
	import Logo from '#lib/ui/Logo.svelte';

	let scrolled = $state(false);
</script>

<svelte:window onscroll={() => (scrolled = window.scrollY > 8)} />

<header class:scrolled>
	<div class="container row">
		<a href="/#top" class="brand" aria-label="hikkari - наверх"><Logo wordmark /></a>
		<nav aria-label="разделы">
			{#each nav as item (item.href)}
				<a href={item.href}>{item.label}</a>
			{/each}
		</nav>
		<div class="actions">
			<Button href="/subscriptions" variant="ghost" size="compact">подписка</Button>
			<Button href="/#download" size="compact">скачать <Icon name="download" size={16} /></Button>
		</div>
	</div>
</header>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 50;
		height: var(--header-h);
		border-bottom: 1px solid transparent;
		transition:
			background var(--d-normal) var(--ease),
			border-color var(--d-normal) var(--ease);
	}

	header.scrolled {
		background: rgb(14 14 16 / 0.78);
		border-color: var(--border);
		backdrop-filter: blur(14px) saturate(140%);
		-webkit-backdrop-filter: blur(14px) saturate(140%);
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		height: 100%;
	}

	nav {
		display: flex;
		gap: 32px;
	}

	nav a {
		font-family: var(--font-mono);
		font-size: 13px;
		font-weight: 500;
		color: var(--text-muted);
		transition: color var(--transition-hover);
	}

	nav a:hover {
		color: var(--primary);
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	@media (max-width: 860px) {
		nav {
			display: none;
		}
	}
</style>
