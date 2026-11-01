<script lang="ts">
	import Footer from '#lib/sections/Footer.svelte';
	import Header from '#lib/sections/Header.svelte';
	import BrandIcon from '#lib/ui/BrandIcon.svelte';
	import Button from '#lib/ui/Button.svelte';
</script>

<svelte:head>
	<title>github - hikkari</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<Header />

<main class="gh-page" id="top">
	<div class="container content">
		<a class="back" href="/">← на главную</a>
		<div class="card">
			<span class="badge"><BrandIcon name="github" size={24} /></span>
			<h1>скоро будет</h1>
			<p class="lead">
				готовим репозиторий клиента к публикации: приводим в порядок исходники и документацию по сборке. откроем
				доступ в ближайшее время.
			</p>
			<div class="actions">
				<Button href="/" variant="ghost">на главную</Button>
			</div>
		</div>
	</div>
</main>

<Footer />

<style>
	.gh-page {
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

	.card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 18px;
		margin-top: 24px;
		padding: 32px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
	}

	.badge {
		display: grid;
		place-items: center;
		width: 48px;
		height: 48px;
		border-radius: 14px;
		color: var(--text);
		background: var(--surface-2);
		border: 1px solid var(--border-strong);
	}

	h1 {
		font-size: clamp(26px, 3.6vw, 34px);
		font-weight: 600;
		line-height: 1.1;
		letter-spacing: -0.03em;
	}

	.lead {
		font-size: 15px;
		line-height: 1.65;
		color: var(--text-muted);
	}

	.actions {
		margin-top: 6px;
	}

	@media (max-width: 560px) {
		.card {
			padding: 24px 20px;
		}
	}
</style>
