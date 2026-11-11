<script lang="ts">
	import Button from '#lib/ui/Button.svelte';
	import Icon from '#lib/ui/Icon.svelte';
</script>

<svelte:head><title>кнопки · hikkari</title><meta name="robots" content="noindex" /></svelte:head>

<main class="container">
	<p class="eyebrow">hikkari / компонент кнопки</p>
	<h1>Контур в движении.<br />Текст с заливкой.</h1>
	<p class="hint">Наведи курсор или выбери кнопку клавишей Tab.</p>
	<section aria-label="Варианты кнопки">
		<div class="sample"><span class="caption">основная</span><Button href="/#download">скачать <Icon name="download" size={18} /></Button></div>
		<div class="sample"><span class="caption">вторичная</span><Button href="/#pricing" variant="ghost">подписка hikkari <Icon name="arrowForward" size={16} /></Button></div>
		<div class="sample"><span class="caption">длинный текст</span><Button href="/#pricing">подключить за 890 ₽ <Icon name="arrowForward" size={16} /></Button></div>
		<div class="sample"><span class="caption">недоступная</span><Button type="button" disabled>скоро</Button></div>
	</section>
	<a class="back" href="/">посмотреть на лендинге ↗</a>
</main>

<style>
	main { padding-top: clamp(64px, 12vh, 140px); padding-bottom: 64px; max-width: 1000px; }
	.eyebrow, .caption, .back { font-family: var(--font-mono); font-size: 12px; }
	.eyebrow { color: var(--primary); margin-bottom: 28px; }
	h1 { font-size: clamp(32px, 5vw, 56px); line-height: 1.15; letter-spacing: -0.03em; }
	.hint { color: var(--text-muted); margin-top: 24px; }
	section { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); margin: 48px 0 32px; border: 1px solid var(--border-strong); border-radius: var(--radius-lg); overflow: hidden; }
	.sample { display: flex; flex-direction: column; align-items: flex-start; gap: 28px; padding: 32px; min-width: 0; }
	.sample:nth-child(-n+2) { border-bottom: 1px solid var(--border-strong); }
	.sample:nth-child(odd) { border-right: 1px solid var(--border-strong); }
	.caption { color: var(--text-muted); }
	.back { color: var(--text-secondary); }
	.back:hover { color: var(--primary); }
	@media (max-width: 600px) {
		section { grid-template-columns: 1fr; }
		.sample:nth-child(n) { border-right: 0; border-bottom: 1px solid var(--border-strong); padding: 24px; }
		.sample:last-child { border-bottom: 0; }
	}
</style>
