<script lang="ts">
	import { BillingError, recoverLinks } from '#lib/billing.ts';
	import PayShell from '#lib/sections/PayShell.svelte';
	import Button from '#lib/ui/Button.svelte';
	import Icon from '#lib/ui/Icon.svelte';

	// No accounts to log into: a lost link comes back by mail, to the
	// address it was bought with.
	let email = $state('');
	let busy = $state(false);
	let sent = $state(false);
	let error = $state('');

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		if (busy) return;
		busy = true;
		error = '';
		try {
			await recoverLinks(email.trim());
			sent = true;
		} catch (err) {
			const code = err instanceof BillingError ? err.code : 'network';
			error =
				code === 'email'
					? 'проверьте email'
					: code === 'rate'
						? 'слишком много попыток, попробуйте через час'
						: 'нет связи с сервером, попробуйте ещё раз';
		} finally {
			busy = false;
		}
	}
</script>

<PayShell title="восстановить ссылку">
	{#if sent}
		<p class="lead">
			если на {email.trim()} оформляли подписку hikkari, письмо со ссылкой придёт в течение пары минут. проверьте папку
			«спам»
		</p>
	{:else}
		<form class="form" onsubmit={submit}>
			<p class="lead">укажите email, на который оформляли подписку: пришлём на него все ссылки</p>
			<label class="field">
				<span class="label">email</span>
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
			{#if error}<p class="error" role="alert">{error}</p>{/if}
			<Button type="submit" disabled={busy}>
				{busy ? 'отправляем…' : 'прислать ссылку'}
				<Icon name="arrowForward" size={18} />
			</Button>
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

	.error {
		color: var(--bad);
		font-size: 14px;
	}

	.form :global(.btn) {
		width: 100%;
	}
</style>
