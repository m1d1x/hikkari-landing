<script lang="ts">
	import { onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import { morph } from '#lib/actions/morph.ts';
	import BrandIcon from '#lib/ui/BrandIcon.svelte';
	import Icon from '#lib/ui/Icon.svelte';
	import Segmented from '#lib/ui/Segmented.svelte';
	import Switch from '#lib/ui/Switch.svelte';
	import { presets, type ServicePreset } from './presets.ts';

	/**
	 * Interactive copy of the client's RouteSection: master switch, category
	 * tabs, manual rules and the ready-made groups. Edits stay in the page;
	 * the header status replays the app's debounce → apply → applied cycle.
	 */
	type Tab = 'domains' | 'processes' | 'ips';
	type Platform = 'windows' | 'darwin';
	type Apply = 'idle' | 'pending' | 'applying' | 'applied';

	const tabs: { value: Tab; label: string }[] = [
		{ value: 'domains', label: 'домены' },
		{ value: 'processes', label: 'приложения' },
		{ value: 'ips', label: 'ip' }
	];
	const samples: Record<Exclude<Tab, 'processes'>, string[]> = {
		domains: ['example.com', 'vk.com', 'ya.ru', 'tbank.ru'],
		ips: ['172.16.0.0/12', '1.1.1.1', '8.8.8.8', '100.64.0.0/10']
	};
	const apps: Record<Platform, string[]> = {
		windows: ['Code.exe', 'qbittorrent.exe', 'obs64.exe', 'Figma.exe'],
		darwin: ['Code', 'qbittorrent', 'OBS', 'Figma']
	};
	const domainRe = /^(?=.{1,253}$)([a-z0-9-]{1,63}\.)+[a-z0-9-]{2,63}$/;
	const ipRe =
		/^((25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}(\/(3[0-2]|[12]?\d))?|([0-9a-f]{0,4}:){2,7}[0-9a-f]{0,4}(\/(12[0-8]|1[01]\d|[1-9]?\d))?)$/;

	let platform = $state<Platform>('windows');
	let open = $state(true);
	let enabled = $state(true);
	let tab = $state<Tab>('domains');
	let input = $state('');
	let invalid = $state(false);
	let apply = $state<Apply>('idle');
	let rules = $state<Record<Tab, string[]>>({
		domains: ['gosuslugi.ru', 'ozon.ru'],
		processes: [],
		ips: ['192.168.0.0/16', '10.0.0.0/8']
	});
	let selected = $state<Record<string, boolean>>({ sber: true, yandexmusic: true, wildberries: false });
	let expanded = $state<string | null>(null);

	const items = $derived([...rules[tab]].reverse());
	const nextApp = $derived(apps[platform].find((a) => !rules.processes.includes(a)));
	const nextSample = $derived(
		tab === 'processes' ? undefined : samples[tab].find((s) => !rules[tab].includes(s))
	);
	const placeholder = $derived(
		tab === 'processes' ? '' : (nextSample ?? (tab === 'domains' ? 'example.com' : '172.16.0.0/12'))
	);

	$effect(() => {
		tab;
		input = '';
		invalid = false;
	});

	function presetRules(p: ServicePreset, t: Tab) {
		return t === 'domains' ? p.domains : t === 'processes' ? p.processes[platform] : p.ips;
	}
	const services = $derived(presets.filter((p) => presetRules(p, tab).length > 0));

	function plural(n: number, one: string, few: string, many: string) {
		const two = n % 100;
		const last = n % 10;
		if (two >= 11 && two <= 14) return many;
		return last === 1 ? one : last >= 2 && last <= 4 ? few : many;
	}
	function subtitle(n: number) {
		if (tab === 'processes') return `${n} ${plural(n, 'файл', 'файла', 'файлов')}`;
		return `${n} ${tab === 'domains' ? 'доменов' : 'ip / подсетей'}`;
	}

	// Rows open and close by their own height while the content stays put
	// inside: `slide` also squeezes padding, so text drifted in from nowhere.
	// A tab switch remounts its content under {#key tab}: like the client, the
	// new rows appear at once and only the island glides to its height (`morph`).
	function grow(node: HTMLElement) {
		const h = node.offsetHeight;
		return { duration: 260, easing: cubicOut, css: (t: number) => `height: ${t * h}px; overflow: hidden` };
	}

	let timers: ReturnType<typeof setTimeout>[] = [];
	function changed() {
		timers.forEach(clearTimeout);
		apply = 'pending';
		timers = [
			setTimeout(() => (apply = 'applying'), 700),
			setTimeout(() => (apply = 'applied'), 1500),
			setTimeout(() => (apply = 'idle'), 3300)
		];
	}

	function add() {
		if (tab === 'processes') return;
		const raw = input.trim().toLowerCase();
		const value = raw || nextSample;
		if (!value) {
			invalid = true;
			setTimeout(() => (invalid = false), 600);
			return;
		}
		const ok = tab === 'ips' ? ipRe.test(value) : domainRe.test(value);
		if (!ok || rules[tab].includes(value)) {
			invalid = true;
			setTimeout(() => (invalid = false), 600);
			return;
		}
		rules[tab] = [...rules[tab], value];
		input = '';
		changed();
	}

	function addApp() {
		if (!nextApp) return;
		rules.processes = [...rules.processes, nextApp];
		changed();
	}

	function remove(value: string) {
		rules[tab] = rules[tab].filter((v) => v !== value);
		changed();
	}

	function togglePreset(id: string) {
		selected[id] = !selected[id];
		changed();
	}

	onMount(() => {
		if (/Mac/i.test(navigator.userAgent)) platform = 'darwin';
		rules.processes = [apps[platform][0]];
		return () => timers.forEach(clearTimeout);
	});

	const status: Record<Apply, { text: string; color: string } | null> = {
		idle: null,
		pending: { text: 'ожидает', color: 'var(--text-muted)' },
		applying: { text: 'применяется…', color: 'var(--warn)' },
		applied: { text: 'обновлено', color: 'var(--primary)' }
	};
</script>

<div class="routing">
	<div class="island" use:morph={tab}>
		<div
			class="head"
			role="button"
			tabindex="0"
			aria-expanded={open}
			onclick={() => (open = !open)}
			onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), (open = !open))}
		>
			<span class="title">маршрутизация</span>
			<span class="chev" class:up={open}><Icon name="chevronDown" size={16} /></span>
			<span class="status">
				{#key apply}
					{#if status[apply]}
						<span class="status-text" style:color={status[apply]?.color}>{status[apply]?.text}</span>
					{/if}
				{/key}
			</span>
			<span class="more" aria-hidden="true"><Icon name="more" size={20} /></span>
			<Switch bind:checked={enabled} label="маршрутизация" onchange={changed} />
		</div>

		<div class="reveal" class:open>
			<div class="reveal-inner">
				<div class="body">
					<Segmented segments={tabs} bind:selected={tab} label="категория правил" />
					{#key tab}
						{#if tab === 'processes'}
							<button class="add-app" onclick={addApp} disabled={!nextApp}>
								<Icon name="add" size={18} />
								{nextApp ? 'добавить приложение' : 'все демо-приложения добавлены'}
							</button>
						{:else}
							<form class="adder" onsubmit={(e) => (e.preventDefault(), add())}>
								<input
									class:invalid
									bind:value={input}
									{placeholder}
									aria-label={tab === 'domains' ? 'домен' : 'ip или подсеть'}
									autocomplete="off"
									spellcheck="false"
								/>
								<button class="add" type="submit" aria-label="добавить"><Icon name="add" size={22} /></button>
							</form>
						{/if}
					{/key}
				</div>
			</div>
		</div>
	</div>

	<div class="reveal" class:open>
		<div class="reveal-inner">
			<div class="island spaced" use:morph={tab}>
				<p class="caption">ручные</p>
				<div class="divider"></div>
				{#key tab}
					{#if items.length === 0}
						<p class="empty">добавьте домен, приложение или ip выше</p>
					{/if}
					{#each items as item (item)}
						<div class="row" transition:grow>
							<div class="item">
								<span>{item}</span>
								<button class="remove" onclick={() => remove(item)} aria-label="удалить {item}">
									<Icon name="close" size={16} />
								</button>
							</div>
						</div>
					{/each}
				{/key}
			</div>

			<div class="island spaced presets" use:morph={tab}>
				<p class="caption">преднастроенные</p>
				<div class="divider"></div>
				{#key tab}
					{#each services as service (service.id)}
						{@const on = selected[service.id]}
						{@const list = presetRules(service, tab)}
						<div class="row" transition:grow>
							<div class="service" class:on style:--brand={service.brand}>
								<div class="service-head">
									<button class="service-main" onclick={() => togglePreset(service.id)} aria-pressed={on}>
										<span class="service-face">
											<span class="badge"><BrandIcon name={service.id} size={16} /></span>
											<span class="service-text">
												<span class="service-name">{service.name}</span>
												<span class="service-sub">{subtitle(list.length)}</span>
											</span>
										</span>
										<span class="service-hover" aria-hidden="true">
											<Icon name="power" size={22} />
											{on ? 'отключить' : 'включить'}
										</span>
									</button>
									<button
										class="service-chev"
										class:up={expanded === service.id}
										onclick={() => (expanded = expanded === service.id ? null : service.id)}
										aria-label="правила {service.name}"
										aria-expanded={expanded === service.id}
									>
										<Icon name="chevronDown" size={16} />
									</button>
								</div>
								{#if expanded === service.id}
									<p class="service-rules" transition:slide={{ duration: 260 }}>{list.join('\n')}</p>
								{/if}
							</div>
						</div>
					{:else}
						<p class="empty">нет готовых правил для этой категории</p>
					{/each}
				{/key}
			</div>
		</div>
	</div>
</div>

<style>
	.routing {
		font-family: var(--font-mono);
	}

	.island {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.island.spaced {
		margin-top: 12px;
	}

	.head {
		display: flex;
		align-items: center;
		padding: 17px 16px 17px 19px;
		cursor: pointer;
		user-select: none;
		outline-offset: -2px;
	}

	.title {
		font-size: 16px;
		font-weight: 700;
		line-height: 1;
		transition: color var(--transition-hover);
	}

	.chev {
		display: grid;
		margin-left: 6px;
		color: var(--text-muted);
		transition:
			transform var(--d-routing) var(--ease),
			color var(--transition-hover);
	}

	.chev.up {
		transform: rotate(180deg);
	}

	.head:hover .title,
	.head:hover .chev {
		color: var(--primary);
	}

	.status {
		flex: 1;
		display: grid;
		margin-left: 8px;
		min-width: 0;
	}

	.status-text {
		font-size: 11px;
		font-weight: 500;
		white-space: nowrap;
		animation: fade 180ms ease;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
	}

	.more {
		display: grid;
		place-items: center;
		width: 28px;
		height: 28px;
		margin-right: 10px;
		color: var(--text-muted);
	}

	.reveal {
		display: grid;
		grid-template-rows: 0fr;
		opacity: 0;
		transition:
			grid-template-rows var(--d-routing) var(--ease),
			opacity var(--d-routing) var(--ease);
	}

	.reveal.open {
		grid-template-rows: 1fr;
		opacity: 1;
	}

	.reveal-inner {
		min-height: 0;
		overflow: hidden;
	}

	.body {
		display: grid;
		gap: 10px;
		padding: 0 12px 12px;
	}

	.adder {
		display: flex;
		gap: 6px;
	}

	input {
		flex: 1;
		min-width: 0;
		height: 40px;
		padding: 0 14px;
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--text);
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		outline: none;
		transition: border-color var(--transition-hover);
	}

	input::placeholder {
		color: var(--text-faint);
	}

	input:focus {
		border-color: var(--border-strong);
	}

	input.invalid {
		border-color: rgb(255 69 58 / 0.6);
		animation: shake 360ms;
	}

	@keyframes shake {
		25% {
			transform: translateX(-4px);
		}
		75% {
			transform: translateX(4px);
		}
	}

	.add,
	.add-app {
		display: grid;
		place-items: center;
		height: 40px;
		color: var(--text-muted);
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		transition:
			color var(--transition-hover),
			border-color var(--transition-hover),
			background var(--transition-hover);
	}

	.add {
		width: 40px;
		flex: none;
	}

	.add-app {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		font-weight: 500;
	}

	.add:hover,
	.add-app:hover:not(:disabled) {
		color: var(--primary);
	}

	.add-app:disabled {
		cursor: default;
		color: var(--text-faint);
	}

	.caption {
		padding: 11px 12px;
		text-align: center;
		font-size: 14px;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.divider {
		height: 1px;
		margin: 0 12px;
		background: var(--border);
	}

	.empty {
		padding: 15px 14px;
		text-align: center;
		font-size: 11px;
		color: var(--text-faint);
	}

	.item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 6px 8px 6px 14px;
		font-size: 13px;
	}

	/* flow-root keeps the inner margins inside the row, so the height `grow`
	   measures matches the clipped height it animates — no jump at the ends. */
	.row {
		display: flow-root;
	}

	.row + .row .item {
		border-top: 1px solid var(--border);
	}

	.item span {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.remove {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		color: var(--text-muted);
		transition: color var(--transition-hover);
	}

	.remove:hover {
		color: var(--text);
	}

	.presets {
		padding-bottom: 4px;
	}

	.presets .divider {
		margin-bottom: 12px;
	}

	.service {
		position: relative;
		margin: 0 12px 8px;
		background: var(--bg);
		border: 1px solid transparent;
		border-radius: var(--radius-lg);
		transition:
			background var(--transition-hover),
			border-color var(--transition-hover);
		--action: var(--primary);
	}

	.service.on {
		--action: var(--text-muted);
		background: #2a2a2e;
		border-color: color-mix(in srgb, var(--brand) 35%, rgb(255 255 255 / 0.12));
	}

	.service:hover {
		background: color-mix(in srgb, var(--action) 8%, var(--bg));
		border-color: color-mix(in srgb, var(--action) 35%, transparent);
	}

	.service.on:hover {
		background: color-mix(in srgb, var(--action) 8%, #2a2a2e);
	}

	.service-head {
		position: relative;
		display: flex;
		align-items: center;
	}

	.service-main {
		position: relative;
		display: block;
		flex: 1;
		min-width: 0;
		padding: 12px 8px 12px 12px;
		text-align: left;
	}

	.service-face {
		display: flex;
		align-items: center;
		gap: 10px;
		transition: opacity var(--transition-hover);
	}

	.service-main:hover .service-face {
		opacity: 0;
	}

	.badge {
		display: grid;
		place-items: center;
		width: 30px;
		height: 30px;
		border-radius: 8px;
		color: var(--text-faint);
		background: rgb(91 91 96 / 0.15);
		transition:
			color var(--transition-hover),
			background var(--transition-hover);
	}

	.on .badge {
		color: var(--brand);
		background: color-mix(in srgb, var(--brand) 15%, transparent);
	}

	.service-text {
		display: grid;
		gap: 2px;
	}

	.service-name {
		font-size: 13px;
		font-weight: 600;
		color: var(--text-faint);
	}

	.on .service-name {
		font-weight: 700;
		color: var(--text);
	}

	.service-sub {
		font-family: var(--font-sans);
		font-size: 11px;
		color: var(--text-faint);
	}

	.on .service-sub {
		color: var(--text-secondary);
	}

	.service-hover {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.3px;
		color: var(--action);
		opacity: 0;
		transition: opacity var(--transition-hover);
	}

	.service-main:hover .service-hover {
		opacity: 1;
	}

	.service-chev {
		flex: none;
		display: grid;
		place-items: center;
		width: 30px;
		height: 30px;
		margin-right: 8px;
		color: var(--text-faint);
		transition:
			transform 440ms var(--ease),
			color var(--transition-hover);
	}

	.service:hover .service-chev {
		color: var(--text-muted);
	}

	.service-chev.up {
		transform: rotate(180deg);
	}

	.service-rules {
		padding: 0 14px 14px;
		white-space: pre-line;
		font-family: var(--font-sans);
		font-size: 12px;
		line-height: 1.6;
		color: var(--text-muted);
	}
</style>
