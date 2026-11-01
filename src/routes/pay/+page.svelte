<script lang="ts">
	import { onMount } from 'svelte';
	import {
		BillingError,
		catalog,
		placeOrder,
		rememberOrder,
		rub,
		type Catalog,
		type OrderError
	} from '#lib/billing.ts';
	import { formatPeriodLabel } from '#lib/periods.svelte.ts';
	import PayShell from '#lib/sections/PayShell.svelte';
	import Button from '#lib/ui/Button.svelte';
	import Icon from '#lib/ui/Icon.svelte';
	import Segmented from '#lib/ui/Segmented.svelte';

	const messages: Record<OrderError, string> = {
		closed: 'оплата откроется совсем скоро',
		email: 'проверьте email: на него придут чек и ссылка',
		plan: 'этот тариф больше не продаётся, выберите другой',
		renew: 'подписка для продления не найдена, оформите новую',
		rate: 'слишком много попыток, попробуйте через час',
		provider: 'платёжная система не ответила, попробуйте ещё раз',
		network: 'нет связи с сервером, попробуйте ещё раз'
	};

	let shop = $state<Catalog | null>(null);
	let loadFailed = $state(false);
	let planId = $state('');
	let email = $state('');
	let agreed = $state(false);
	let busy = $state(false);
	let error = $state<OrderError | null>(null);
	/** The token of the subscription being extended; '' for a new one. */
	let renew = $state('');

	const plan = $derived(shop?.plans.find((p) => p.id === planId));
	const months = $derived(plan ? Math.max(1, Math.round(plan.days / 30)) : 1);

	onMount(async () => {
		const wanted = new URLSearchParams(location.search).get('plan');
		// The client opens /pay#renew=<token>: the token stays out of every
		// server's logs, and out of the address bar once read.
		const hash = new URLSearchParams(location.hash.slice(1));
		renew = hash.get('renew') ?? '';
		if (renew) history.replaceState(null, '', location.pathname + location.search);
		try {
			shop = await catalog();
			planId =
				shop.plans.find((p) => p.id === wanted)?.id ??
				shop.plans.find((p) => Math.round(p.days / 30) === 1)?.id ??
				shop.plans[0]?.id ??
				'';
		} catch {
			loadFailed = true;
		}
	});

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		if (!plan || busy) return;
		busy = true;
		error = null;
		try {
			const placed = await placeOrder(plan.id, email.trim(), renew || undefined);
			rememberOrder(placed.id, placed.secret);
			location.href = placed.pay_url;
		} catch (err) {
			error = err instanceof BillingError ? err.code : 'network';
			busy = false;
		}
	}
</script>

<PayShell title={renew ? 'продление подписки' : 'подписка hikkari'}>
	{#if loadFailed}
		<p class="lead">не удалось загрузить тарифы. обновите страницу через минуту</p>
	{:else if !shop}
		<p class="lead muted">загружаем тарифы…</p>
	{:else if !shop.open || shop.plans.length === 0}
		<p class="lead">{messages.closed}. а пока клиент можно скачать и пользоваться им со своими серверами</p>
		<Button href="/#download" variant="ghost">скачать клиент <Icon name="download" size={18} /></Button>
	{:else}
		<form class="form" onsubmit={submit}>
			{#if renew}
				<p class="lead">срок добавится к текущему, ссылка подписки останется прежней</p>
			{/if}

			<Segmented
				label="период подписки"
				segments={shop.plans.map((p) => ({
					value: p.id,
					label: formatPeriodLabel(Math.max(1, Math.round(p.days / 30)), p.title)
				}))}
				bind:selected={planId}
			/>

			{#if plan}
				<p class="price">
					<span class="amount">{rub(plan.price_cents)}&nbsp;₽</span>
					{#if months > 1}<span class="unit">≈ {rub(Math.round(plan.price_cents / months / 100) * 100)}&nbsp;₽ / мес</span>{/if}
				</p>
			{/if}

			<label class="field">
				<span class="label">email для чека и ссылки</span>
				<input
					type="email"
					autocomplete="email"
					inputmode="email"
					required
					maxlength="254"
					placeholder="you@example.com"
					bind:value={email}
				/>
			</label>

			<label class="agree">
				<input type="checkbox" required bind:checked={agreed} />
				<span>принимаю <a href="/offer" target="_blank">публичную оферту</a> и <a href="/privacy" target="_blank">политику конфиденциальности</a></span>
			</label>

			{#if error}<p class="error" role="alert">{messages[error]}</p>{/if}

			<Button type="submit" disabled={busy || !agreed || !plan}>
				{busy ? 'открываем оплату…' : `оплатить ${plan ? rub(plan.price_cents) : ''} ₽`}
				<Icon name="arrowForward" size={18} />
			</Button>
			<a class="restore" href="/restore">уже оплачивали и потеряли ссылку?</a>
		</form>
	{/if}
</PayShell>

<style>
	.form {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.lead {
		color: var(--text-secondary);
		line-height: 1.5;
	}

	.muted {
		color: var(--text-muted);
	}

	.price {
		display: flex;
		align-items: baseline;
		gap: 12px;
	}

	.amount {
		font-size: 40px;
		font-weight: 600;
		letter-spacing: -0.03em;
	}

	.unit {
		font-family: var(--font-mono);
		font-size: 13px;
		color: var(--text-muted);
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.label {
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 600;
		color: var(--text-muted);
	}

	.field input {
		height: 48px;
		padding: 0 16px;
		background: var(--bg);
		border: 1px solid var(--border-strong);
		border-radius: var(--radius);
		color: var(--text);
		font: inherit;
		transition: border-color var(--transition-hover);
	}

	.field input:focus {
		outline: none;
		border-color: rgb(var(--primary-rgb) / 0.55);
	}

	.agree {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		font-size: 14px;
		line-height: 1.5;
		color: var(--text-secondary);
		cursor: pointer;
	}

	.agree input {
		flex: none;
		width: 18px;
		height: 18px;
		margin-top: 2px;
		accent-color: var(--primary);
	}

	.agree a {
		color: var(--primary);
	}

	.error {
		color: var(--bad);
		font-size: 14px;
	}

	.form :global(.btn) {
		width: 100%;
	}

	.restore {
		align-self: center;
		font-family: var(--font-mono);
		font-size: 13px;
		color: var(--text-muted);
		transition: color var(--transition-hover);
	}

	.restore:hover {
		color: var(--primary);
	}
</style>
