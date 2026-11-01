<script lang="ts">
	import type { Snippet } from 'svelte';
	import Footer from '#lib/sections/Footer.svelte';
	import Header from '#lib/sections/Header.svelte';

	/** Frame of the checkout pages: one narrow card under the site header. */
	let {
		title,
		back = { href: '/#pricing', label: '← к тарифам' },
		children
	}: { title: string; back?: { href: string; label: string }; children: Snippet } = $props();
</script>

<svelte:head>
	<title>{title} - hikkari</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<Header />

<main class="pay-page" id="top">
	<div class="container content">
		<a class="back" href={back.href}>{back.label}</a>
		<h1>{title}</h1>
		<div class="card">
			{@render children()}
		</div>
	</div>
</main>

<Footer />

<style>
	.pay-page {
		padding: 56px 0 112px;
	}

	.content {
		max-width: 520px;
	}

	.back {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: 13px;
		color: var(--text-muted);
		transition: color var(--transition-hover);
	}

	.back:hover {
		color: var(--primary);
	}

	h1 {
		margin-top: 24px;
		font-size: clamp(28px, 4vw, 40px);
		font-weight: 600;
		line-height: 1.1;
		letter-spacing: -0.03em;
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 24px;
		margin-top: 32px;
		padding: 32px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
	}

	@media (max-width: 560px) {
		.card {
			padding: 24px 20px;
		}
	}
</style>
