<script lang="ts">
	import { donation } from '#lib/site.ts';
	import PayShell from '#lib/sections/PayShell.svelte';
	import Button from '#lib/ui/Button.svelte';
	import Icon from '#lib/ui/Icon.svelte';
	import Segmented from '#lib/ui/Segmented.svelte';

	const custom = 'custom';
	const segments = [
		...donation.amounts.map((a) => ({ value: String(a), label: `${a} ₽` })),
		{ value: custom, label: 'своя' }
	];

	const spend = [
		'серверы и трафик для ноды, на которой живёт приложение',
		'обновления движка и правки под новые блокировки',
		'время на клиент: его делает один человек'
	];

	let picked = $state(String(donation.amounts[1]));
	let typed = $state('');

	const amount = $derived(picked === custom ? Math.floor(Number(typed)) : Number(picked));
	const valid = $derived(
		Number.isFinite(amount) && amount >= donation.min && amount <= donation.max
	);
	const href = $derived(
		donation.url && valid ? donation.url.replace('{amount}', String(amount)) : null
	);
</script>

<PayShell title="поддержать проект" back={{ href: '/', label: '← на главную' }}>
	<div class="badge" aria-hidden="true"><Icon name="heart" size={26} /></div>

	<p class="lead">
		клиент бесплатный и таким останется. если hikkari вам полезен, можно закинуть на развитие,
		без подписки и обязательств
	</p>

	<div class="amount-block">
		<span class="label">сумма</span>
		<Segmented label="сумма доната" {segments} bind:selected={picked} />

		{#if picked === custom}
			<label class="field">
				<input
					type="number"
					inputmode="numeric"
					min={donation.min}
					max={donation.max}
					step="1"
					placeholder={`от ${donation.min} ₽`}
					bind:value={typed}
				/>
				<span class="suffix">₽</span>
			</label>
		{/if}
	</div>

	<div class="spend dashed">
		<span class="label">куда уходят деньги</span>
		<ul>
			{#each spend as item (item)}
				<li><span class="mark"><Icon name="check" size={16} /></span>{item}</li>
			{/each}
		</ul>
	</div>

	<Button {href}>
		{#if donation.url}
			{valid ? `поддержать на ${amount} ₽` : 'выберите сумму'}
			<Icon name="heart" size={18} />
		{:else}
			приём донатов скоро
		{/if}
	</Button>

	<p class="note">донат добровольный, ничего не открывает и не даёт доступ к серверам</p>
</PayShell>

<style>
	.badge {
		display: grid;
		place-items: center;
		width: 56px;
		height: 56px;
		color: var(--primary);
		background: var(--selected-bg);
		border: 1px solid var(--selected-border);
		border-radius: var(--radius);
	}

	.lead {
		color: var(--text-secondary);
		line-height: 1.5;
	}

	.amount-block {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.label {
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 600;
		color: var(--text-muted);
	}

	.field {
		position: relative;
		display: block;
	}

	.field input {
		width: 100%;
		height: 48px;
		padding: 0 44px 0 16px;
		background: var(--bg);
		border: 1px solid var(--border-strong);
		border-radius: var(--radius);
		color: var(--text);
		font-family: var(--font-mono);
		transition: border-color var(--transition-hover);
		appearance: textfield;
		-moz-appearance: textfield;
	}

	.field input::-webkit-outer-spin-button,
	.field input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	.field input:focus {
		outline: none;
		border-color: rgb(var(--primary-rgb) / 0.55);
	}

	.suffix {
		position: absolute;
		top: 50%;
		right: 16px;
		transform: translateY(-50%);
		font-family: var(--font-mono);
		color: var(--text-muted);
		pointer-events: none;
	}

	.spend {
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 20px;
		border-radius: var(--radius-lg);
	}

	ul {
		display: grid;
		gap: 10px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		display: flex;
		gap: 10px;
		font-size: 14px;
		line-height: 1.45;
		color: var(--text-secondary);
	}

	.mark {
		flex: none;
		color: var(--primary);
		margin-top: 1px;
	}

	.spend ~ :global(.btn) {
		width: 100%;
	}

	.note {
		align-self: center;
		text-align: center;
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--text-faint);
	}
</style>
