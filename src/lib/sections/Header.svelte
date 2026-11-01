<script lang="ts">
	import { nav } from '#lib/site.ts';
	import Icon from '#lib/ui/Icon.svelte';
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
			<a class="sub" href="/subscriptions">подписка</a>
			<a class="cta" href="/#download">скачать <Icon name="download" size={16} /></a>
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

	.sub,
	.cta {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 40px;
		padding: 0 16px;
		border-radius: var(--radius);
		font-family: var(--font-mono);
		font-size: 13px;
		font-weight: 600;
	}

	.sub {
		color: var(--text);
		border: 1px solid transparent;
		transition:
			background var(--transition-hover),
			border-color var(--transition-hover),
			color var(--transition-hover);
	}

	.sub:hover {
		color: var(--primary);
		background: var(--surface-2);
		border-color: rgb(var(--primary-rgb) / 0.55);
	}

	.cta {
		background: var(--primary);
		color: var(--on-primary);
		transition:
			background var(--transition-hover),
			box-shadow var(--transition-hover);
	}

	.cta:hover {
		background: #ff94c6;
		box-shadow: 0 8px 28px -8px rgb(var(--primary-rgb) / 0.55);
	}

	@media (max-width: 860px) {
		nav {
			display: none;
		}
	}
</style>
