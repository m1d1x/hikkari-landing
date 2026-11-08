<script lang="ts">
	import { slide } from 'svelte/transition';
	import { interval } from '#lib/actions/interval.ts';
	import Chip from '#lib/ui/Chip.svelte';
	import type { CountryCode } from '#lib/ui/Flag.svelte';
	import Icon from '#lib/ui/Icon.svelte';
	import ProfileCard from '#lib/ui/ProfileCard.svelte';
	import { formats } from './formats.ts';
	import { push, sample, series, type Probe } from './samples.ts';

	/**
	 * The client's profiles sheet: subscription groups with dashed borders,
	 * live sparklines and the import zone. Clicking the zone adds an example
	 * third-party subscription — the same way a pasted link lands in the app.
	 */
	interface Profile {
		id: string;
		title: string;
		flag: CountryCode;
		probe: Probe;
		samples: number[];
	}
	interface Group {
		id: string;
		title: string;
		period: string;
		traffic: string;
		profiles: Profile[];
	}

	let seed = 100;
	const profile = (id: string, title: string, flag: CountryCode, base: number): Profile => {
		const probe = { base, jitter: Math.round(base * 0.12) };
		return { id, title, flag, probe, samples: series(probe, seed++) };
	};

	let groups = $state<Group[]>([
		{
			id: 'hikkari',
			title: 'hikkari',
			period: '30 дней',
			traffic: '480 ГБ',
			profiles: [
				profile('tokyo', 'токио', 'jp', 47),
				profile('helsinki', 'хельсинки', 'fi', 44),
				profile('frankfurt', 'франкфурт', 'de', 49)
			]
		},
		{
			id: 'personal',
			title: 'личный vpn',
			period: '14 дней',
			traffic: '128 ГБ',
			profiles: [profile('warsaw', 'варшава', 'pl', 61)]
		}
	]);
	let active = $state('tokyo');
	let query = $state('');
	let imported = $state(false);

	const thirdParty = (): Group => ({
		id: 'thirdparty',
		title: 'thirdparty_vpn',
		period: '21 день',
		traffic: '250 ГБ',
		profiles: [profile('amsterdam', 'амстердам', 'nl', 72), profile('stockholm', 'стокгольм', 'se', 86)]
	});

	const count = $derived(groups.reduce((n, g) => n + g.profiles.length, 0));
	const visible = $derived(
		groups
			.map((g) => ({ ...g, profiles: g.profiles.filter((p) => p.title.includes(query.trim().toLowerCase())) }))
			.filter((g) => g.profiles.length > 0)
	);

	function importExample() {
		if (imported) return;
		imported = true;
		groups = [groups[0], thirdParty(), ...groups.slice(1)];
	}

	function tick() {
		for (const g of groups) for (const p of g.profiles) p.samples = push(p.samples, sample(p.probe));
	}
</script>

<div class="profiles" use:interval={{ ms: 1200, tick }}>
	<div class="head">
		<span class="title">профили</span>
		<span class="count">{count}</span>
		<span class="add icon-text"><Icon name="add" size={16} /> добавить</span>
		<span class="auto icon-text"><Icon name="bolt" size={14} /> auto</span>
	</div>

	<button class="drop dashed accent-hover" class:done={imported} onclick={importExample} disabled={imported}>
		<span class="drop-main">
			<span class="drop-icon"><Icon name="file" size={20} /></span>
			<span class="drop-text">
				<span class="drop-title">{imported ? 'подписка добавлена' : 'импорт подписки'}</span>
				<span class="drop-sub">{imported ? 'thirdparty_vpn · 2 сервера' : 'ссылка, файл или конфиг'}</span>
			</span>
		</span>
		<span class="drop-formats">
			<span class="chips">
				{#each formats as f (f)}<Chip>{f}</Chip>{/each}
			</span>
		</span>
	</button>

	<label class="search icon-text">
		<Icon name="search" size={16} />
		<input bind:value={query} placeholder="поиск" aria-label="поиск профиля" spellcheck="false" />
	</label>

	<div class="list">
		{#each visible as group (group.id)}
			<div class="group dashed" transition:slide={{ duration: 420 }}>
				<div class="group-head">
					<span class="g-title">{group.title}</span>
					<span class="g-period">{group.period}</span>
					<span class="g-traffic">{group.traffic}</span>
				</div>
				<div class="group-body">
					{#each group.profiles as p (p.id)}
						<ProfileCard
							title={p.title}
							flag={p.flag}
							samples={p.samples}
							selected={active === p.id}
							onselect={() => (active = p.id)}
						/>
					{/each}
				</div>
			</div>
		{:else}
			<p class="empty">ничего не найдено</p>
		{/each}
	</div>
</div>

<style>
	.profiles {
		padding: 18px 16px 10px;
		font-family: var(--font-mono);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
	}

	.head {
		display: flex;
		align-items: baseline;
		gap: 8px;
		padding: 0 4px 16px;
	}

	.title {
		font-size: 16px;
		font-weight: 700;
	}

	.count {
		font-size: 15px;
		color: var(--text-muted);
	}

	.add {
		align-self: center;
		display: inline-flex;
		align-items: center;
		gap: 4px;
		height: 28px;
		margin-left: 6px;
		padding: 0 10px 0 8px;
		font-size: 12px;
		color: var(--text-muted);
		border: 1px solid var(--border-strong);
		border-radius: 999px;
	}

	.auto {
		align-self: center;
		display: inline-flex;
		align-items: center;
		gap: 4px;
		height: 28px;
		margin-left: auto;
		padding: 0 10px;
		font-size: 12px;
		font-weight: 600;
		color: var(--primary);
		background: rgb(var(--primary-rgb) / 0.1);
		border: 1px solid rgb(var(--primary-rgb) / 0.3);
		border-radius: 999px;
	}

	.drop {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		width: 100%;
		padding: 16px;
		text-align: left;
		border-radius: var(--radius-lg);
		transition: background-color var(--transition-hover);
	}

	.drop:hover:not(:disabled) {
		background-color: rgb(var(--primary-rgb) / 0.04);
	}

	.drop:disabled {
		cursor: default;
	}

	.drop-main {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		gap: 14px;
		min-width: 0;
	}

	.drop-icon {
		flex: none;
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border-radius: 12px;
		color: var(--primary);
		background: rgb(var(--primary-rgb) / 0.08);
		border: 1px solid rgb(var(--primary-rgb) / 0.3);
	}

	.done .drop-icon {
		color: var(--ok);
		background: rgb(52 199 89 / 0.08);
		border-color: rgb(52 199 89 / 0.3);
	}

	.drop-text {
		display: grid;
		gap: 4px;
		min-width: 0;
	}

	.drop-title {
		font-size: 14px;
		font-weight: 600;
	}

	.drop-sub {
		font-size: 11px;
		color: var(--text-muted);
	}

	.drop-formats {
		display: flex;
		align-items: center;
		padding-left: 16px;
		border-left: 1px solid var(--border);
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.chips :global(.chip) {
		height: 26px;
		padding: 0 9px;
		font-size: 11px;
	}

	.search {
		display: flex;
		align-items: center;
		gap: 10px;
		height: 40px;
		margin: 12px 0 4px;
		padding: 0 14px;
		color: var(--text-faint);
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: var(--radius);
	}

	.search input {
		flex: 1;
		min-width: 0;
		height: 100%;
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--text);
		background: none;
		border: 0;
		outline: none;
	}

	.search input::placeholder {
		color: var(--text-faint);
	}

	.list {
		display: grid;
	}

	.group {
		margin-top: 8px;
		padding-bottom: 7px;
		border: 1px solid transparent;
		border-radius: var(--radius-lg);
	}


	.group-head {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		padding: 13px 24px 7px;
		font-size: 12px;
		font-weight: 600;
	}

	.g-title {
		font-weight: 700;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.g-period {
		text-align: center;
		color: var(--text-muted);
	}

	.g-traffic {
		text-align: right;
		color: var(--text-secondary);
	}

	.group-body {
		display: grid;
		gap: 8px;
		padding: 2px 12px 0;
	}

	.empty {
		padding: 24px;
		text-align: center;
		font-size: 12px;
		color: var(--text-muted);
	}

	@media (max-width: 640px) {
		.drop {
			flex-direction: column;
			align-items: stretch;
		}

		.drop-formats {
			padding: 12px 0 0;
			border-left: 0;
			border-top: 1px solid var(--border);
		}

		.profiles {
			padding: 16px 10px 8px;
		}

		.group-head {
			padding-inline: 12px;
			font-size: 11px;
		}

		.group-body {
			padding-inline: 8px;
		}
	}
</style>
