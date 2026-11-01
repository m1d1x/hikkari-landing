<script lang="ts">
	import { reveal } from '#lib/actions/reveal.ts';
	import { downloads, release } from '#lib/site.ts';
	import { trackDownload } from '#lib/telemetry.ts';
	import BrandIcon from '#lib/ui/BrandIcon.svelte';
	import Button from '#lib/ui/Button.svelte';
	import Icon from '#lib/ui/Icon.svelte';
</script>

<section class="section" id="download">
	<div class="container">
		<div class="intro" data-reveal use:reveal>
			<h2>скачать hikkari</h2>
			<p>клиент бесплатный. подписка нужна только для премиум серверов hikkari, свои подключайте как есть.</p>
		</div>

		<div class="cards">
			{#each downloads as d, i (d.id)}
				<article class="card" data-reveal use:reveal={80 * (i + 1)}>
					<div class="title">
						<span class="os"><BrandIcon name={d.id === 'macos' ? 'apple' : 'windows'} size={24} /></span>
						<h3>{d.name}</h3>
					</div>
					<ul class="specs">
						{#each d.specs as spec (spec)}<li>{spec}</li>{/each}
					</ul>

					<div class="bottom">
						<Button href={d.url} onclick={() => trackDownload(d.id, d.file)}>скачать {d.file} <Icon name="download" size={18} /></Button>
						<p class="version">версия {release.version}</p>
					</div>
				</article>
			{/each}
		</div>

	</div>
</section>

<style>
	.intro {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	h2 {
		font-size: clamp(36px, 4.4vw, 56px);
		font-weight: 600;
		line-height: 1.05;
		letter-spacing: -0.03em;
	}

	.intro p {
		max-width: 30em;
		margin-top: 18px;
		font-size: 17px;
		line-height: 1.6;
		color: var(--text-muted);
		text-wrap: balance;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 380px));
		justify-content: center;
		gap: 16px;
		margin-top: 56px;
	}

	.card {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 32px 28px 28px;
		text-align: center;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		transition: border-color var(--transition-hover);
	}

	.card:hover {
		border-color: var(--border-strong);
	}

	.title {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.os {
		display: grid;
		place-items: center;
		width: 48px;
		height: 48px;
		border-radius: 14px;
		color: var(--text);
		background: var(--surface-2);
		border: 1px solid var(--border-strong);
	}

	h3 {
		font-size: 26px;
		font-weight: 600;
		letter-spacing: -0.02em;
	}

	.specs {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
		margin: 18px 0 0;
		padding: 0;
		list-style: none;
	}

	.specs li {
		padding: 4px 10px;
		border-radius: 8px;
		background: var(--surface-2);
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--text-secondary);
	}

	/* Pinned to the card's bottom so both cards line up whatever the specs. */
	.bottom {
		align-self: stretch;
		margin-top: auto;
		padding-top: 28px;
	}

	.bottom :global(.btn) {
		width: 100%;
	}

	.version {
		margin-top: 12px;
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--text-faint);
	}

	@media (max-width: 720px) {
		.cards {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
