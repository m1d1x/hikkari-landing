<script lang="ts">
	import { onMount } from 'svelte';
	import { reveal } from '#lib/actions/reveal.ts';
	import { checkoutUrl, launchPricing, periods as defaultPeriods } from '#lib/site.ts';
	import { getPeriodsState } from '#lib/periods.svelte.ts';
	import Button from '#lib/ui/Button.svelte';
	import Icon from '#lib/ui/Icon.svelte';
	import SectionHead from '#lib/ui/SectionHead.svelte';
	import Segmented from '#lib/ui/Segmented.svelte';

	// What each source gets. The protocol engine needs servers that run the
	// whole protocol set, which only the hikkari fleet does.
	const features = [
		{ name: 'серверы hikkari', ours: true, other: false },
		{ name: 'движок протоколов', ours: true, other: false },
		{ name: 'маршрутизация и готовые группы', ours: true, other: true },
		{ name: 'автовыбор сервера по пингу и скорости', ours: true, other: true },
		{ name: 'срок, трафик и автообновление подписки', ours: true, other: true }
	];

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
</script>

<section class="section" id="pricing">
	<div class="container">
		<div class="head">
			<SectionHead index="05" eyebrow="подписка">
				{#snippet title()}всё готово с&nbsp;первого запуска{/snippet}
				{#snippet lead()}серверы, движок протоколов и&nbsp;настройки уже внутри. оплатили, открыли hikkari и&nbsp;забыли{/snippet}
			</SectionHead>
		</div>

		<div class="period" data-reveal use:reveal={60}>
			<Segmented
				label="период подписки"
				segments={periods.map((p) => ({ value: p.id, label: p.label }))}
				bind:selected={periodId}
			/>
		</div>

		<div class="cards">
			<article class="card ours" data-reveal use:reveal={100}>
				<div class="card-top">
					<h3>подписка hikkari</h3>
					{#if launchPricing}<span class="badge">цена на запуске</span>{/if}
				</div>

				<p class="price">
					<span class="amount">{rub(monthly)}&nbsp;₽</span>
					<span class="unit">/ мес</span>
				</p>
				<p class="total">
					{#if period.months > 1}
						{rub(period.price)}&nbsp;₽ за&nbsp;{period.label}
						{#if base.price * period.months > period.price}
							<s>{rub(base.price * period.months)}&nbsp;₽</s>
						{/if}
					{:else}
						оплата помесячно
					{/if}
				</p>

				<ul class="list">
					{#each features as f (f.name)}
						<li class="icon-text"><span class="mark"><Icon name="check" size={18} /></span>{f.name}</li>
					{/each}
				</ul>

				<div class="cta">
					<Button href={checkoutUrl(period.id)}>
						подключить за&nbsp;{rub(period.price)}&nbsp;₽ <Icon name="bolt" size={18} />
					</Button>
				</div>
			</article>

			<article class="card" data-reveal use:reveal={160}>
				<div class="card-top">
					<h3>свой сервер или чужая подписка</h3>
				</div>

				<p class="price">
					<span class="amount">0&nbsp;₽</span>
					<span class="unit">навсегда</span>
				</p>
				<p class="total">клиент бесплатный, донат по&nbsp;желанию</p>

				<ul class="list">
					{#each features as f (f.name)}
						<li class="icon-text" class:off={!f.other}>
							<span class="mark">
								{#if f.other}<Icon name="check" size={18} />{:else}-{/if}
							</span>{f.name}
						</li>
					{/each}
				</ul>

				<div class="cta">
					<Button href="/#download" variant="ghost">
						скачать клиент <Icon name="download" size={18} />
					</Button>
				</div>
			</article>
		</div>

		<p class="note" data-reveal use:reveal>
			движку нужны серверы, на которых поднят весь набор протоколов. у серверов hikkari он есть, а у
			стороннего сервера обычно один протокол, и переключаться не на что.
		</p>
	</div>
</section>

<style>
	.head {
		display: flex;
		justify-content: center;
		text-align: center;
	}

	.head :global(.eyebrow) {
		justify-content: center;
	}

	.head :global(.lead) {
		margin-inline: auto;
	}

	.period {
		width: min(420px, 100%);
		margin: 48px auto 0;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 440px));
		justify-content: center;
		gap: 16px;
		margin-top: 32px;
	}

	.card {
		display: flex;
		flex-direction: column;
		padding: 32px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		transition: border-color var(--transition-hover);
	}

	.card:hover {
		border-color: var(--border-strong);
	}

	.card.ours,
	.card.ours:hover {
		background: var(--selected-bg);
		border-color: var(--selected-border);
	}

	.card-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		min-height: 28px;
	}

	h3 {
		font-family: var(--font-mono);
		font-size: 14px;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.ours h3 {
		color: var(--primary);
	}

	.badge {
		display: inline-flex;
		align-items: center;
		height: 28px;
		padding: 0 10px;
		border-radius: 999px;
		background: rgb(var(--primary-rgb) / 0.14);
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 600;
		color: var(--primary);
	}

	.price {
		display: flex;
		align-items: baseline;
		gap: 10px;
		margin-top: 28px;
	}

	.amount {
		font-size: clamp(40px, 4.4vw, 56px);
		font-weight: 600;
		line-height: 1;
		letter-spacing: -0.03em;
		font-variant-numeric: tabular-nums;
	}

	.unit {
		font-family: var(--font-mono);
		font-size: 14px;
		color: var(--text-muted);
	}

	.total {
		min-height: 1.5em;
		margin-top: 12px;
		font-family: var(--font-mono);
		font-size: 13px;
		color: var(--text-muted);
	}

	.total s {
		margin-left: 6px;
		color: var(--text-faint);
	}

	.list {
		display: grid;
		gap: 14px;
		margin: 28px 0 0;
		padding: 28px 0 0;
		border-top: 1px solid var(--border);
		list-style: none;
		font-family: var(--font-mono);
		font-size: 14px;
		color: var(--text-secondary);
	}

	.list li {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.mark {
		flex: none;
		display: grid;
		place-items: center;
		width: 18px;
		color: var(--text-muted);
	}

	.ours .mark {
		color: var(--primary);
	}

	.list li.off {
		color: var(--text-faint);
	}

	.list li.off .mark {
		color: var(--text-faint);
	}

	/* Pinned to the bottom so both buttons line up. */
	.cta {
		margin-top: auto;
		padding-top: 32px;
	}

	.cta :global(.btn) {
		width: 100%;
	}

	.note {
		max-width: 44em;
		margin: 32px auto 0;
		font-size: 13px;
		line-height: 1.6;
		text-align: center;
		color: var(--text-faint);
		text-wrap: balance;
	}

	@media (max-width: 860px) {
		.cards {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	@media (max-width: 640px) {
		.card {
			padding: 24px;
		}
	}
</style>
