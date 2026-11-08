<script lang="ts">
	import { onMount } from 'svelte';
	import { importLink } from '#lib/billing.ts';
	import PayShell from '#lib/sections/PayShell.svelte';
	import Button from '#lib/ui/Button.svelte';
	import CopyLink from '#lib/ui/CopyLink.svelte';
	import Icon from '#lib/ui/Icon.svelte';

	const subOrigin = new URL(import.meta.env.VITE_SUB_URL ?? 'https://sub.hikkari.net').origin;
	let url = $state('');
	let resolving = $state(true);

	onMount(() => {
		const raw = new URLSearchParams(location.hash.slice(1)).get('url') ?? '';
		try {
			const parsed = new URL(raw);
			if (!/^\/sub\/[A-Za-z0-9_-]+$/.test(parsed.pathname) || parsed.username || parsed.password) return;
			if (parsed.protocol !== 'https:' && parsed.origin !== subOrigin) return;
			url = raw;
		} catch { /* An absent or malformed link shows recovery. */ }
		finally { resolving = false; }
	});

</script>

<svelte:head><meta name="referrer" content="no-referrer" /></svelte:head>

<PayShell title="подписка hikkari">
	{#if resolving}
		<p class="meta">загрузка…</p>
	{:else if url}
		<CopyLink value={url} />
		<div class="actions">
			<Button href={importLink(url)}>открыть в hikkari <Icon name="arrowForward" size={18} /></Button>
			<Button href="/#download" variant="ghost">скачать клиент <Icon name="download" size={18} /></Button>
		</div>
	{:else}
		<p class="meta">подписка не найдена</p>
		<div class="actions"><Button href="/restore" variant="ghost">восстановить ссылку</Button></div>
	{/if}
</PayShell>

<style>
	.meta { text-align: center; color: var(--text-muted); font-size: 13px; line-height: 1.6; }
	.actions { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 8px; }
</style>
