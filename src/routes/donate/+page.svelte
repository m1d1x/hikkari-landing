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
		'серверы и трафик для работы приложения',
		'обновления движка и поддержка протоколов',
		'время на клиент: проект делает один человек'
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
	<div class="intro">
		<div class="badge" aria-hidden="true"><Icon name="heart" size={24} /></div>
		<p class="lead">
			клиент бесплатный и останется таким. если hikkari вам полезен, вы можете поддержать проект
			без подписок и обязательств
		</p>
	</div>

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
				<li class="icon-text">
					<span class="mark"><Icon name="check" size={16} /></span>
					<span class="item-text">{item}</span>
				</li>
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
	.intro {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.badge {
		flex: none;
		display: grid;
		place-items: center;
		width: 48px;
		height: 48px;
		color: var(--primary);
		background: var(--selected-bg);
		border: 1px solid var(--selected-border);
		border-radius: var(--radius);
	}

	.lead {
		color: var(--text);
		font-size: 14.5px;
		font-weight: 500;
		line-height: 1.45;
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
		letter-spacing: 0.02em;
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
		font-family: var(--font-sans);
		font-size: 15px;
		font-weight: 500;
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
		font-family: var(--font-sans);
		font-size: 15px;
		font-weight: 600;
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
		align-items: center;
		gap: 10px;
		font-size: 14px;
		font-weight: 500;
		line-height: 1.4;
		color: var(--text);
		white-space: nowrap;
	}

	.mark {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		color: var(--primary);
	}

	.item-text {
		overflow: hidden;
		text-overflow: ellipsis;
	}

	@media (max-width: 520px) {
		li {
			font-size: 12.5px;
			gap: 8px;
		}
	}

	@media (max-width: 400px) {
		li {
			font-size: 11px;
			gap: 6px;
		}
	}

	.spend ~ :global(.btn) {
		width: 100%;
		font-size: 15px;
		font-weight: 600;
	}

	.note {
		align-self: center;
		text-align: center;
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 500;
		color: var(--text-muted);
	}
</style>
