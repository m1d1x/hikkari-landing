<script lang="ts">
	import { onMount } from 'svelte';
	import { expoOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
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
	let busy = $state(false);
	let error = $state<OrderError | null>(null);
	/** The token of the subscription being extended; '' for a new one. */
	let renew = $state('');
	/** The period came from the pricing section: show it as a line, the switch only on «изменить». */
	let picking = $state(true);

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
			picking = !shop.plans.some((p) => p.id === wanted);
			planId =
				shop.plans.find((p) => p.id === wanted)?.id ??
				shop.plans.find((p) => Math.round(p.days / 30) === 1)?.id ??
				shop.plans[0]?.id ??
				'';
		} catch {
			loadFailed = true;
		}
	});

	/** What is wrong with the typed email, shown under the field instead of the browser's bubble. */
	let emailProblem = $state('');
	const emailBad = $derived(emailProblem !== '');

	function checkEmail(value: string, input: HTMLInputElement | undefined): string {
		if (!value) return 'введите email: на него придут чек и ссылка';
		if (!value.includes('@')) return 'в адресе нет @, пример: you@example.com';
		if (value.split('@').length > 2) return 'в адресе должна быть одна @';
		if (!value.split('@')[1]) return 'после @ нужен домен, пример: you@example.com';
		if (input && !input.checkValidity()) return 'неверный формат email, пример: you@example.com';
		return '';
	}
	let emailInput = $state<HTMLInputElement>();

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		if (!plan || busy) return;
		email = email.trim();
		emailProblem = checkEmail(email, emailInput);
		if (emailProblem) {
			emailInput?.focus();
			return;
		}
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
		<form class="form" novalidate onsubmit={submit}>
			{#if renew}
				<p class="lead">срок добавится к текущему, ссылка подписки останется прежней</p>
			{/if}

			{#if picking}
				<!-- --d-expand on the --ease curve (expoOut is its JS twin). -->
				<div transition:slide={{ duration: 260, easing: expoOut }}>
					<Segmented
						label="период подписки"
						segments={shop.plans.map((p) => ({
							value: p.id,
							label: formatPeriodLabel(Math.max(1, Math.round(p.days / 30)), p.title)
						}))}
						bind:selected={planId}
					/>
				</div>
			{/if}

			{#if plan}
				<div class="summary">
					<div class="summary-what">
						<p class="summary-period">
							{formatPeriodLabel(months, plan.title)}
							{#if !picking}<button type="button" class="change" onclick={() => (picking = true)}>изменить</button>{/if}
						</p>
						{#if months > 1}
							<p class="summary-note">{rub(Math.round(plan.price_cents / months / 100) * 100)}&nbsp;₽ / мес</p>
						{/if}
					</div>
					<p class="amount">{rub(plan.price_cents)}&nbsp;₽</p>
				</div>
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
					aria-invalid={emailBad}
					aria-describedby={emailBad ? 'email-error' : undefined}
					bind:this={emailInput}
					bind:value={email}
					oninput={() => (emailProblem = '')}
				/>
				{#if emailBad}
					<span class="field-error" id="email-error" role="alert">{emailProblem}</span>
				{/if}
			</label>

			{#if error}<p class="error" role="alert">{messages[error]}</p>{/if}

			<Button type="submit" disabled={busy || !plan}>
				{busy ? 'открываем оплату…' : `оплатить ${plan ? rub(plan.price_cents) : ''} ₽`}
				<Icon name="arrowForward" size={18} />
			</Button>
			<!-- Paying accepts the offer (ГК ст. 438); the email serves the contract, so no separate consent box. -->
			<p class="terms">
				нажимая «оплатить», вы&nbsp;принимаете <a href="/offer" target="_blank">публичную оферту</a> и&nbsp;<a
					href="/privacy"
					target="_blank">политику конфиденциальности</a
				>
			</p>
		</form>
	{/if}

	{#snippet after()}
		<a class="restore" href="/restore">уже оплачивали и потеряли ссылку?</a>
	{/snippet}
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

	/* What is being bought, as one line: period on the left, the sum on the right. */
	.summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding-bottom: 24px;
		border-bottom: 1px solid var(--border);
	}

	.summary-period {
		display: flex;
		align-items: baseline;
		gap: 12px;
		font-family: var(--font-mono);
		font-size: 16px;
		font-weight: 600;
		color: var(--text);
	}

	.change {
		font-family: var(--font-mono);
		font-size: 13px;
		font-weight: 500;
		color: var(--text-muted);
		transition: color var(--transition-hover);
	}

	.change:hover {
		color: var(--primary);
	}

	/* Tall enough for period + per-month line, so switching periods doesn't move the form. */
	.summary-what {
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-height: 50px;
	}

	.summary-note {
		margin-top: 6px;
		line-height: 20px;
		font-family: var(--font-mono);
		font-size: 13px;
		color: var(--text-muted);
	}

	.amount {
		font-size: 40px;
		font-weight: 600;
		line-height: 1;
		letter-spacing: -0.03em;
		white-space: nowrap;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.label {
		font-family: var(--font-mono);
		font-size: 13px;
		font-weight: 500;
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

	.field input[aria-invalid='true'] {
		border-color: rgb(255 69 58 / 0.55);
	}

	.field-error {
		font-family: var(--font-mono);
		font-size: 13px;
		font-weight: 500;
		color: var(--bad);
	}

	/* Right under the button: what pressing it means. */
	.terms {
		margin-top: -8px;
		font-size: 13px;
		font-weight: 500;
		line-height: 1.5;
		text-align: center;
		color: var(--text-muted);
		text-wrap: balance;
	}

	.terms a {
		color: var(--text-secondary);
		text-decoration: underline;
		text-decoration-color: var(--border-strong);
		text-underline-offset: 3px;
		transition:
			color var(--transition-hover),
			text-decoration-color var(--transition-hover);
	}

	.terms a:hover {
		color: var(--primary);
		text-decoration-color: rgb(var(--primary-rgb) / 0.4);
	}

	.error {
		color: var(--bad);
		font-size: 14px;
	}

	.form :global(.btn) {
		width: 100%;
	}

	.restore {
		font-family: var(--font-mono);
		font-size: 13px;
		color: var(--text-muted);
		transition: color var(--transition-hover);
	}

	.restore:hover {
		color: var(--primary);
	}
</style>
