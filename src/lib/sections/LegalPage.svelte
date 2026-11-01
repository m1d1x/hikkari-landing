<script lang="ts">
	import Footer from '#lib/sections/Footer.svelte';
	import Header from '#lib/sections/Header.svelte';

	export interface LegalSection {
		heading: string;
		paragraphs: string[];
	}

	let {
		title,
		updated = 'редакция от 01.11.2026 · черновик (рыба)',
		sections
	}: {
		title: string;
		updated?: string;
		sections: LegalSection[];
	} = $props();
</script>

<svelte:head>
	<title>{title} - hikkari</title>
</svelte:head>

<Header />

<main class="legal-page" id="top">
	<div class="container content">
		<a class="back" href="/">← на главную</a>
		<h1>{title}</h1>
		<p class="meta">{updated}</p>

		<div class="doc">
			{#each sections as section, i (section.heading)}
				<section class="block">
					<h2><span class="num">{i + 1}.</span> {section.heading}</h2>
					{#each section.paragraphs as p, j (j)}
						<p>{p}</p>
					{/each}
				</section>
			{/each}
		</div>
	</div>
</main>

<Footer />

<style>
	.legal-page {
		padding: 56px 0 112px;
	}

	.content {
		max-width: 760px;
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
		font-size: clamp(32px, 4vw, 48px);
		font-weight: 600;
		line-height: 1.08;
		letter-spacing: -0.03em;
	}

	.meta {
		margin-top: 12px;
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--text-faint);
	}

	.doc {
		display: grid;
		gap: 36px;
		margin-top: 48px;
		padding-top: 36px;
		border-top: 1px solid var(--border-strong);
	}

	.block {
		display: grid;
		gap: 12px;
	}

	h2 {
		font-family: var(--font-mono);
		font-size: 16px;
		font-weight: 600;
		color: var(--text);
	}

	.num {
		color: var(--primary);
		margin-right: 6px;
	}

	.block p {
		font-size: 15px;
		line-height: 1.7;
		color: var(--text-secondary);
	}
</style>
