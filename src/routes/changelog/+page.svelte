<script lang="ts">
	import { releases, type Release } from '#lib/changelog.ts';
	import Footer from '#lib/sections/Footer.svelte';
	import Header from '#lib/sections/Header.svelte';

	function tagLabel(type: string): string {
		switch (type) {
			case 'feat':
				return 'новое';
			case 'fix':
				return 'исправление';
			case 'ui':
				return 'интерфейс';
			case 'perf':
				return 'скорость';
			default:
				return type;
		}
	}
</script>

<svelte:head>
	<title>история версий - hikkari</title>
	<meta name="description" content="История версий и изменений клиента hikkari" />
</svelte:head>

<Header />

<main class="changelog-page" id="top">
	<div class="container content">
		<a class="back" href="/">← на главную</a>

		<div class="header">
			<h1>история версий</h1>
			<p class="lead">
				хронология обновлений клиента hikkari: новые функции, улучшения сетевого стека и исправления.
			</p>
		</div>

		<div class="timeline">
			{#each releases as rel (rel.version)}
				<article class="release-card" class:latest={rel.latest}>
					<header class="card-header">
						<div class="version-row">
							<span class="version-tag">v{rel.version}</span>
							{#if rel.latest}
								<span class="badge-latest">актуальная</span>
							{/if}
						</div>
						<time class="date">{rel.date}</time>
					</header>

					<h2 class="title">{rel.title}</h2>

					<ul class="items">
						{#each rel.items as item, idx (idx)}
							<li class="item">
								<span class="type-tag type-{item.type}">{tagLabel(item.type)}</span>
								<span class="item-text">{item.text}</span>
							</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>
	</div>
</main>

<Footer />

<style>
	.changelog-page {
		padding: 56px 0 112px;
	}

	.content {
		max-width: 720px;
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

	.header {
		margin-top: 24px;
		margin-bottom: 36px;
	}

	h1 {
		font-size: clamp(28px, 4vw, 36px);
		font-weight: 600;
		line-height: 1.15;
		letter-spacing: -0.03em;
		color: var(--text);
	}

	.lead {
		margin-top: 12px;
		font-size: 15px;
		line-height: 1.6;
		color: var(--text-muted);
	}

	.timeline {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.release-card {
		display: flex;
		flex-direction: column;
		padding: 24px 28px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		transition: border-color var(--transition-hover);
	}

	.release-card.latest {
		border-color: var(--selected-border);
		background: linear-gradient(180deg, var(--selected-bg) 0%, var(--surface) 100%);
	}

	.card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 12px;
	}

	.version-row {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.version-tag {
		font-family: var(--font-mono);
		font-size: 17px;
		font-weight: 600;
		color: var(--text);
		letter-spacing: -0.01em;
	}

	.badge-latest {
		display: inline-flex;
		align-items: center;
		padding: 2px 8px;
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 500;
		color: var(--primary);
		background: rgb(var(--primary-rgb) / 0.12);
		border: 1px solid rgb(var(--primary-rgb) / 0.28);
	}

	.date {
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--text-faint);
	}

	.title {
		font-size: 16px;
		font-weight: 600;
		color: var(--text);
		margin-bottom: 14px;
		line-height: 1.4;
	}

	.items {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.item {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		font-size: 14px;
		line-height: 1.55;
		color: var(--text-secondary);
	}

	.type-tag {
		flex-shrink: 0;
		margin-top: 2px;
		display: inline-flex;
		align-items: center;
		padding: 1px 6px;
		border-radius: 4px;
		font-family: var(--font-mono);
		font-size: 10.5px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.type-feat {
		color: var(--primary);
		background: rgb(var(--primary-rgb) / 0.1);
	}

	.type-fix {
		color: var(--ok);
		background: rgba(52, 199, 89, 0.12);
	}

	.type-ui {
		color: var(--text-muted);
		background: var(--surface-2);
		border: 1px solid var(--border-strong);
	}

	.type-perf {
		color: var(--warn);
		background: rgba(255, 159, 10, 0.12);
	}

	.item-text {
		flex: 1;
	}

	@media (max-width: 560px) {
		.release-card {
			padding: 20px 16px;
		}

		.card-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 6px;
		}

		.item {
			font-size: 13.5px;
		}
	}
</style>
