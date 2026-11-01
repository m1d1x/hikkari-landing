<script lang="ts">
	import { onMount } from 'svelte';
	import { importLink } from '#lib/billing.ts';
	import PayShell from '#lib/sections/PayShell.svelte';
	import Button from '#lib/ui/Button.svelte';
	import Icon from '#lib/ui/Icon.svelte';

	// Letters link here (hikkari-control internal/billing/letters.go): mail
	// clients drop hikkari:// hrefs, this page offers one. The link rides in
	// the fragment, which reaches no server.
	let url = $state('');
	let copied = $state(false);

	onMount(() => {
		const raw = new URLSearchParams(location.hash.slice(1)).get('url') ?? '';
		if (/^https:\/\/[^\s]+\/sub\/[A-Za-z0-9_-]+$/.test(raw)) url = raw;
	});

	async function copy() {
		await navigator.clipboard.writeText(url);
		copied = true;
		setTimeout(() => (copied = false), 2_000);
	}
</script>

<PayShell title="подписка hikkari">
	{#if url}
		<p class="lead">откройте подписку в hikkari одной кнопкой или вставьте ссылку вручную: «профили → добавить»</p>
		<div class="link">
			<code>{url}</code>
			<button class="copy" type="button" onclick={copy} aria-label="скопировать ссылку">
				<Icon name={copied ? 'check' : 'copy'} size={18} />
			</button>
		</div>
		<div class="actions">
			<Button href={importLink(url)}>открыть в hikkari <Icon name="arrowForward" size={18} /></Button>
			<Button href="/#download" variant="ghost">скачать клиент <Icon name="download" size={18} /></Button>
		</div>
	{:else}
		<p class="lead">в ссылке нет подписки. откройте кнопку из письма ещё раз или запросите ссылку заново</p>
		<Button href="/restore" variant="ghost">восстановить ссылку</Button>
	{/if}
</PayShell>

<style>
	.lead {
		color: var(--text-secondary);
		line-height: 1.5;
	}

	.link {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 8px 8px 16px;
		background: var(--bg);
		border: 1px solid var(--selected-border);
		border-radius: var(--radius);
	}

	code {
		flex: 1;
		min-width: 0;
		overflow-wrap: anywhere;
		font-family: var(--font-mono);
		font-size: 13px;
		color: var(--text);
	}

	.copy {
		display: grid;
		place-items: center;
		flex: none;
		width: 40px;
		height: 40px;
		border-radius: 10px;
		color: var(--text-muted);
		cursor: pointer;
		transition:
			color var(--transition-hover),
			background var(--transition-hover);
	}

	.copy:hover {
		color: var(--primary);
		background: var(--surface-2);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}
</style>
