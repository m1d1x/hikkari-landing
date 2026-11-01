<script lang="ts">
	import { legal, links } from '#lib/site.ts';
	import BrandIcon from '#lib/ui/BrandIcon.svelte';
	import Logo from '#lib/ui/Logo.svelte';
</script>

<footer class="divider-top">
	<div class="container row">
		<div class="brand">
			<Logo wordmark />
			<span class="tagline">© 2026 hikkari</span>
		</div>
		<nav aria-label="документы">
			{#each legal as item (item.label)}
				<a href={item.href}>{item.label}</a>
			{/each}
			<a href={links.changelog}>история версий</a>
		</nav>
		<a
			class="gh"
			href={links.github}
			target={links.github.startsWith('http') ? '_blank' : undefined}
			rel={links.github.startsWith('http') ? 'noopener noreferrer' : undefined}
			aria-label="hikkari на github"
		>
			<BrandIcon name="github" size={22} />
		</a>
	</div>
</footer>

<style>
	footer {
		position: relative;
		padding: 36px 0;
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	.tagline {
		padding-left: 20px;
		border-left: 1px solid var(--border-strong);
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--text-muted);
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		gap: 12px 28px;
	}

	nav a,
	.gh {
		font-family: var(--font-mono);
		font-size: 13px;
		color: var(--text-muted);
		transition: color var(--transition-hover);
	}

	nav a:hover,
	.gh:hover {
		color: var(--primary);
	}
</style>
