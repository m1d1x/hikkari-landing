<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { BillingError, importLink, orderStatus, recallOrder, rememberOrder, type Order } from '#lib/billing.ts';
	import PayShell from '#lib/sections/PayShell.svelte';
	import Button from '#lib/ui/Button.svelte';
	import Icon from '#lib/ui/Icon.svelte';
	import CopyLink from '#lib/ui/CopyLink.svelte';

	let order = $state<Order | null>(null);
	/** No order this browser can prove (lost link, other browser). */
	let lost = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	onMount(() => {
		const id = new URLSearchParams(location.search).get('order') ?? '';
		// The payment page returns with the secret in the fragment; it is kept
		// in this browser and taken out of the address bar.
		const key = new URLSearchParams(location.hash.slice(1)).get('key');
		if (key) {
			rememberOrder(id, key);
			history.replaceState(null, '', location.pathname + location.search);
		}
		const secret = key ?? recallOrder(id);
		if (!id || !secret) {
			lost = true;
			return;
		}
		const started = Date.now();
		const poll = async () => {
			try {
				order = await orderStatus(id, secret);
			} catch (err) {
				if (err instanceof BillingError && err.code !== 'network') {
					lost = true;
					return;
				}
			}
			if (!order || order.status === 'pending') {
				// The provider usually confirms within seconds; after two
				// minutes the hub's own checks take over, so ask less often.
				timer = setTimeout(poll, Date.now() - started < 120_000 ? 2_000 : 10_000);
			}
		};
		poll();
	});

	onDestroy(() => clearTimeout(timer));

	const title = $derived(
		order?.status === 'paid'
			? order.renewal
				? 'подписка продлена'
				: 'подписка готова'
			: order?.status === 'canceled' || order?.status === 'expired'
				? 'оплата не прошла'
				: 'проверяем оплату'
	);
</script>

<PayShell {title}>
	{#if lost}
		<p class="lead">
			не нашли заказ в этом браузере. если оплата прошла, ссылка уже в письме на email, указанный при оплате
		</p>
		<Button href="/restore" variant="ghost">прислать ссылку ещё раз</Button>
	{:else if !order || order.status === 'pending'}
		<p class="lead muted">ждём подтверждение от платёжной системы. обычно это несколько секунд, страницу можно не обновлять</p>
	{:else if order.status === 'paid'}
		{#if order.renewal}
			<p class="lead">
				{order.plan.title || `${order.plan.days} дн.`} добавлены к подписке. в hikkari ничего менять не нужно: срок
				обновится сам в течение пяти минут
			</p>
		{:else if order.url}
			<p class="lead">
				это ваша ссылка подписки. откройте её в hikkari одной кнопкой или вставьте вручную: «профили → добавить»
			</p>
			<CopyLink value={order.url} />
			<p class="note">ссылка и есть доступ: не публикуйте её. копия уже отправлена на email</p>
			<div class="actions">
				<Button href={importLink(order.url)}>открыть в hikkari <Icon name="arrowForward" size={18} /></Button>
				<Button href="/#download" variant="ghost">скачать клиент <Icon name="download" size={18} /></Button>
			</div>
		{/if}
	{:else}
		<p class="lead">платёж отменён или не завершён, деньги не списаны. можно попробовать ещё раз</p>
		<Button href={`/pay?plan=${order.plan.id}`}>оплатить снова <Icon name="refresh" size={18} /></Button>
	{/if}
</PayShell>

<style>
	.lead {
		color: var(--text-secondary);
		line-height: 1.5;
	}

	.muted {
		color: var(--text-muted);
	}

	.note {
		font-size: 13px;
		color: var(--text-muted);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 12px;
	}
</style>
