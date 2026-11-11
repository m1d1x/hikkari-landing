<script lang="ts">
	import type { Snippet } from 'svelte';
	import Footer from '#lib/sections/Footer.svelte';
	import Header from '#lib/sections/Header.svelte';

	/** Frame of the checkout pages: one narrow card under the site header; `after` goes under the card. */
	let {
		title,
		back = { href: '/#pricing', label: '← к тарифам' },
		children,
		after
	}: {
		title: string;
		back?: { href: string; label: string };
		children: Snippet;
		after?: Snippet;
	} = $props();
</script>

<svelte:head>
	<title>{title.includes('hikkari') ? title : `${title} · hikkari`}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="shell">
	<Header />

	<main class="pay-page" id="top">
		<div class="container">
			<a class="back rise" href={back.href}>{back.label}</a>
		</div>
		<div class="container content">
			<h1 class="rise" style="--rise-delay: 60ms">{title}</h1>
			<div class="card rise" style="--rise-delay: 120ms">
				{@render children()}
			</div>
			{#if after}
				<div class="after rise" style="--rise-delay: 180ms">{@render after()}</div>
			{/if}
		</div>
	</main>

	<Footer />
</div>

<style>
	/* The footer sits at the bottom of the window even when the card is short. */
	.shell {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		min-height: 100dvh;
	}

	.pay-page {
		flex: 1;
		padding: 24px 0 96px;
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
		margin-top: 16px;
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

	/*
	 * The same rise as [data-reveal] in app.css, but on load: the form is the
	 * whole page, so it never waits for an IntersectionObserver.
	 */
	.rise {
		animation: rise 700ms var(--ease) var(--rise-delay, 0ms) both;
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.rise {
			animation: none;
		}
	}

	.after {
		display: flex;
		justify-content: center;
		margin-top: 24px;
	}

	@media (max-width: 560px) {
		.card {
			padding: 24px 20px;
		}
	}
</style>
