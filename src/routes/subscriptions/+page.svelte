<script lang="ts">
	import { onMount } from 'svelte';
	import { reveal } from '#lib/actions/reveal.ts';
	import { checkoutUrl, periods as defaultPeriods } from '#lib/site.ts';
	import { getPeriodsState } from '#lib/periods.svelte.ts';
	import Button from '#lib/ui/Button.svelte';
	import Icon from '#lib/ui/Icon.svelte';
	import SectionHead from '#lib/ui/SectionHead.svelte';
	import Segmented from '#lib/ui/Segmented.svelte';
	import Header from '#lib/sections/Header.svelte';
	import Footer from '#lib/sections/Footer.svelte';

	import type { IconName } from '#lib/ui/icons.ts';

	const periodsState = getPeriodsState();
	let periodId = $state('1m');

	const periods = $derived(periodsState.list);
	const period = $derived(
		periods.find((p) => p.id === periodId) ??
		periods.find((p) => p.months === 1) ??
		periods[0] ??
		defaultPeriods[0]
	);
	const base = $derived(
		periods.find((p) => p.months === 1) ??
		periods[0] ??
		defaultPeriods[0]
	);
	const monthly = $derived(Math.round(period.price / Math.max(1, period.months)));

	const rub = (n: number) => n.toLocaleString('ru-RU').replace(/\s/g, ' ');

	$effect(() => {
		if (periods.length > 0 && !periods.some((p) => p.id === periodId)) {
			periodId = periods.find((p) => p.months === 1)?.id ?? periods[0]!.id;
		}
	});

	onMount(() => {
		periodsState.load();
	});

	const advantages: { icon: IconName; title: string; text: string }[] = [
		{
			icon: 'swap',
			title: 'движок протоколов',
			text: 'VLESS Reality, XHTTP и Hysteria2. Если на одном из транспортов падает стабильность, Hikkari бесшовно переводит сессию на резервный.'
		},
		{
			icon: 'route',
			title: 'сайты РФ без VPN',
			text: 'Банки, Госуслуги, Авито и Кинопоиск идут напрямую. Не нужно выключать VPN, чтобы оплатить заказ или проверить счёт.'
		},
		{
			icon: 'speed',
			title: 'скорость и низкий пинг',
			text: 'Гигабитные ноды в Нидерландах, Финляндии и Германии. YouTube в 4K без буферизации, игры без лишней задержки.'
		},
		{
			icon: 'verified',
			title: 'без логов и ограничений',
			text: 'Мы не храним историю посещений и DNS-запросы. Подключайте все свои устройства: Mac, Windows и смартфон.'
		}
	];

	const faqs = [
		{
			q: 'Как активировать подписку после оплаты?',
			a: 'Сразу после оплаты на странице появится кнопка «Открыть в Hikkari». Клик по ней мгновенно добавляет подписку в приложение. Также ссылка на подписку придёт вам на email.'
		},
		{
			q: 'Сколько устройств можно подключить?',
			a: 'Подписка рассчитана на личное использование: вы можете импортировать ссылку во все свои персональные устройства (Mac, Windows, iOS, Android).'
		},
		{
			q: 'Что делать, если сервер перестанет отвечать?',
			a: 'Вам ничего делать не нужно. Движок протоколов Hikkari непрерывно тестирует доступность каналов и сам переключает транспорт при обнаружении сетевых помех.'
		},
		{
			q: 'Как продлить подписку?',
			a: 'В настройках профиля в Hikkari есть кнопка «продлить», либо просто оплатите нужный период на сайте с тем же email, и срок автоматически приплюсуется.'
		}
	];
</script>

<svelte:head>
	<title>подписка hikkari - готовые серверы и стабильное соединение</title>
	<meta
		name="description"
		content="Официальная подписка Hikkari: скоростные серверы в Европе, отказоустойчивые протоколы и автопереключение каналов."
	/>
</svelte:head>

<Header />

<main class="page">
	<section class="hero">
		<div class="container">
			<div class="badge-row">
				<span class="badge">официальная подписка</span>
			</div>
			<h1>VPN, о&nbsp;котором забываешь</h1>
			<p class="lead">
				Готовые серверы в&nbsp;Европе, высокая скорость и&nbsp;умный движок протоколов.
				Оплатили, открыли Hikkari в&nbsp;один клик, и&nbsp;всё работает стабильно.
			</p>
		</div>
	</section>

	<section class="pricing-wrap">
		<div class="container">
			<div class="period-selector">
				<Segmented
					label="период подписки"
					segments={periods.map((p) => ({ value: p.id, label: p.label }))}
					bind:selected={periodId}
				/>
			</div>

			<div class="plans-grid">
				<div class="plan-card featured">
					<div class="plan-header">
						<div class="plan-tag">полный доступ</div>
						<h2 class="plan-title">hikkari pass</h2>
					</div>

					<div class="price-block">
						<div class="price-val">
							<span class="val">{rub(monthly)}&nbsp;₽</span>
							<span class="unit">/ мес</span>
						</div>
						<div class="price-sub">
							{#if period.months > 1}
								{rub(period.price)}&nbsp;₽ за&nbsp;{period.label}
								{#if base.price * period.months > period.price}
									<s>{rub(base.price * period.months)}&nbsp;₽</s>
								{/if}
							{:else}
								оплата помесячно
							{/if}
						</div>
					</div>

					<ul class="features">
						<li><Icon name="check" size={16} /> Готовые серверы 1–10 Гбит/с в Европе</li>
						<li><Icon name="check" size={16} /> Движок авто-смены протоколов (VLESS / XHTTP / Hysteria2)</li>
						<li><Icon name="check" size={16} /> Российские сайты и сервисы напрямую мимо VPN</li>
						<li><Icon name="check" size={16} /> YouTube 4K, Discord голосовые и чаты без задержек</li>
						<li><Icon name="check" size={16} /> Мгновенный импорт в приложение по ссылке или QR-коду</li>
						<li><Icon name="check" size={16} /> Подключение всех ваших домашних устройств</li>
					</ul>

					<div class="cta-box">
						<Button href={checkoutUrl(period.id)} variant="primary">
							подключить за {rub(period.price)}&nbsp;₽ <Icon name="arrowForward" size={18} />
						</Button>
						<p class="safe-note">Мгновенная активация • Оплата российскими картами и СБП</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="advantages">
		<div class="container">
			<div class="adv-grid">
				{#each advantages as adv}
					<div class="adv-card">
						<div class="adv-icon">
							<Icon name={adv.icon} size={22} />
						</div>
						<h3>{adv.title}</h3>
						<p>{adv.text}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="faq">
		<div class="container">
			<SectionHead index="faq" eyebrow="частые вопросы">
				{#snippet title()}всё, что нужно знать перед покупкой{/snippet}
			</SectionHead>

			<div class="faq-list">
				{#each faqs as item}
					<div class="faq-item">
						<h4>{item.q}</h4>
						<p>{item.a}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>
</main>

<Footer />

<style>
	.page {
		padding-bottom: 96px;
	}

	.hero {
		padding: 72px 0 40px;
		text-align: center;
	}

	.badge-row {
		display: flex;
		justify-content: center;
		margin-bottom: 20px;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		padding: 4px 12px;
		border-radius: 999px;
		background: rgb(255 126 185 / 0.12);
		border: 1px solid rgb(255 126 185 / 0.3);
		color: var(--primary);
		font-family: var(--font-mono);
		font-size: 12px;
		letter-spacing: 0.04em;
	}

	h1 {
		font-size: clamp(32px, 5vw, 54px);
		line-height: 1.1;
		font-weight: 700;
		letter-spacing: -0.03em;
		margin: 0 0 16px;
	}

	.lead {
		max-width: 600px;
		margin: 0 auto;
		color: var(--text-2);
		font-size: 17px;
		line-height: 1.5;
	}

	.pricing-wrap {
		padding: 24px 0 64px;
	}

	.period-selector {
		display: flex;
		justify-content: center;
		margin-bottom: 36px;
	}

	.plans-grid {
		max-width: 580px;
		margin: 0 auto;
	}

	.plan-card {
		padding: 36px;
		border-radius: 24px;
		background: linear-gradient(180deg, #181216 0%, #120e11 100%);
		border: 1px solid rgb(255 126 185 / 0.35);
		box-shadow: 0 20px 48px -12px rgb(0 0 0 / 0.6), 0 0 32px rgb(255 126 185 / 0.08);
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	.plan-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.plan-tag {
		font-family: var(--font-mono);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--primary);
		background: rgb(255 126 185 / 0.12);
		padding: 3px 8px;
		border-radius: 6px;
	}

	.plan-title {
		font-size: 20px;
		font-weight: 700;
		margin: 0;
	}

	.price-block {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.price-val {
		display: flex;
		align-items: baseline;
		gap: 6px;
	}

	.price-val .val {
		font-family: var(--font-mono);
		font-size: 44px;
		font-weight: 700;
		color: var(--text-1);
		letter-spacing: -0.02em;
	}

	.price-val .unit {
		font-size: 16px;
		color: var(--text-2);
	}

	.price-sub {
		font-size: 14px;
		color: var(--text-2);
	}

	.price-sub s {
		margin-left: 8px;
		color: var(--text-3);
	}

	.features {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.features li {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 14.5px;
		color: var(--text-2);
		line-height: 1.4;
	}

	.features li :global(svg) {
		color: var(--primary);
		flex-shrink: 0;
	}

	.cta-box {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 8px;
	}

	.safe-note {
		text-align: center;
		font-size: 12px;
		color: var(--text-3);
		margin: 0;
	}

	.advantages {
		padding: 64px 0;
		border-top: 1px solid var(--border);
	}

	.adv-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 24px;
	}

	.adv-card {
		padding: 24px;
		border-radius: 18px;
		background: var(--surface-1);
		border: 1px solid var(--border);
	}

	.adv-icon {
		width: 44px;
		height: 44px;
		border-radius: 12px;
		background: rgb(255 126 185 / 0.1);
		color: var(--primary);
		display: grid;
		place-items: center;
		margin-bottom: 16px;
	}

	.adv-card h3 {
		font-size: 17px;
		margin: 0 0 8px;
		font-weight: 600;
	}

	.adv-card p {
		margin: 0;
		font-size: 14px;
		color: var(--text-2);
		line-height: 1.5;
	}

	.faq {
		padding: 64px 0 32px;
	}

	.faq-list {
		margin-top: 36px;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 20px;
	}

	.faq-item {
		padding: 24px;
		border-radius: 16px;
		background: var(--surface-1);
		border: 1px solid var(--border);
	}

	.faq-item h4 {
		margin: 0 0 10px;
		font-size: 16px;
		font-weight: 600;
	}

	.faq-item p {
		margin: 0;
		font-size: 14px;
		color: var(--text-2);
		line-height: 1.5;
	}
</style>
