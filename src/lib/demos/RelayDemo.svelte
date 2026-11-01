<script lang="ts">
	import { flip } from 'svelte/animate';
	import { interval } from '#lib/actions/interval.ts';
	import Flag, { type CountryCode } from '#lib/ui/Flag.svelte';
	import Icon from '#lib/ui/Icon.svelte';

	/**
	 * Simulated relay auto-select: every location is probed for latency and
	 * throughput, the table re-sorts and the best one becomes active. Now and
	 * then a location gets congested, so the leader changes.
	 */
	interface Relay {
		code: CountryCode;
		city: string;
		ping: number;
		speed: number;
		basePing: number;
		baseSpeed: number;
		/** Ticks of congestion left. */
		load: number;
	}

	const make = (code: CountryCode, city: string, ping: number, speed: number): Relay => ({
		code,
		city,
		ping,
		speed,
		basePing: ping,
		baseSpeed: speed,
		load: 0
	});

	let relays = $state<Relay[]>([
		make('jp', 'токио', 47, 896),
		make('fi', 'хельсинки', 44, 790),
		make('lv', 'рига', 42, 740),
		make('pl', 'варшава', 46, 700),
		make('de', 'франкфурт', 49, 660),
		make('nl', 'амстердам', 52, 720),
		make('se', 'стокгольм', 57, 610),
		make('fr', 'париж', 61, 580)
	]);

	const score = (r: Relay) => r.speed / r.ping;
	const sorted = $derived([...relays].sort((a, b) => score(b) - score(a)));
	const best = $derived(sorted[0]);
	const maxSpeed = $derived(Math.max(...relays.map((r) => r.speed)));

	function step() {
		const leader = best.code;
		if (Math.random() < 0.18) {
			const victim =
				Math.random() < 0.6
					? relays.find((r) => r.code === leader)
					: relays[Math.floor(Math.random() * relays.length)];
			if (victim && victim.load === 0) victim.load = 4 + Math.floor(Math.random() * 4);
		}
		for (const r of relays) {
			const congested = r.load > 0;
			if (congested) r.load--;
			const jitter = () => Math.random() - 0.5;
			r.ping = Math.max(8, Math.round(r.basePing * (congested ? 1.9 : 1) + jitter() * 8));
			r.speed = Math.max(40, Math.round(r.baseSpeed * (congested ? 0.42 : 1) + jitter() * 70));
		}
	}

	function quality(r: Relay) {
		return r.ping < 50 ? 3 : r.ping < 80 ? 2 : 1;
	}
</script>

<div class="relay" use:interval={{ ms: 1800, tick: step }}>
	<div class="top">
		<span class="title">серверы</span>
		<span class="auto"><Icon name="bolt" size={14} /> auto</span>
	</div>

	<div class="grid head" aria-hidden="true">
		<span>локация</span>
		<span class="num">пинг <span class="sort">↓</span></span>
		<span class="num">скорость <span class="sort">↑</span></span>
		<span class="bar-col"></span>
		<span></span>
	</div>

	<ol>
		{#each sorted as r (r.code)}
			<li class="grid row" class:best={r === best} animate:flip={{ duration: 520 }}>
				<span class="where"><Flag code={r.code} />{r.city}</span>
				<span class="num ping">{r.ping} <span class="unit">ms</span></span>
				<span class="num">{r.speed} <span class="unit">мбит/с</span></span>
				<span class="bar-col"><span class="bar" style:width="{(r.speed / maxSpeed) * 100}%"></span></span>
				<span class="signal q{quality(r)}" aria-label="качество {quality(r)} из 3">
					<i></i><i></i><i></i>
				</span>
			</li>
		{/each}
	</ol>
</div>

<style>
	.relay {
		padding: 18px;
		font-family: var(--font-mono);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
	}

	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 2px 4px 16px;
	}

	.title {
		font-size: 16px;
		font-weight: 700;
	}

	.auto {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		height: 28px;
		padding: 0 10px;
		font-size: 12px;
		font-weight: 600;
		color: var(--primary);
		background: rgb(var(--primary-rgb) / 0.1);
		border: 1px solid rgb(var(--primary-rgb) / 0.3);
		border-radius: 999px;
	}

	.grid {
		display: grid;
		grid-template-columns: minmax(0, 1.7fr) 72px 104px minmax(60px, 1fr) 22px;
		align-items: center;
		gap: 14px;
		padding: 0 14px;
	}

	.head {
		padding-bottom: 10px;
		font-size: 11px;
		color: var(--text-faint);
	}

	.sort {
		color: var(--primary);
	}

	ol {
		display: grid;
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.row {
		height: 46px;
		font-size: 13px;
		color: var(--text-muted);
		background: var(--bg);
		border: 1px solid transparent;
		border-radius: var(--radius);
		transition:
			background 300ms var(--ease),
			border-color 300ms var(--ease),
			color 300ms var(--ease);
	}

	.row.best {
		color: var(--text);
		background: var(--selected-bg);
		border-color: var(--selected-border);
	}

	.where {
		display: flex;
		align-items: center;
		gap: 10px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: var(--text-secondary);
	}

	.best .where {
		font-weight: 600;
		color: var(--text);
	}

	.num {
		text-align: right;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.best .ping {
		color: var(--primary);
		font-weight: 600;
	}

	.unit {
		font-size: 11px;
		color: var(--text-faint);
	}

	.bar-col {
		height: 4px;
		border-radius: 2px;
		background: rgb(255 255 255 / 0.05);
		overflow: hidden;
	}

	.head .bar-col {
		background: none;
	}

	.bar {
		display: block;
		height: 100%;
		border-radius: 2px;
		background: var(--text-faint);
		transition:
			width 700ms var(--ease),
			background 300ms;
	}

	.best .bar {
		background: var(--primary);
		box-shadow: 0 0 10px rgb(var(--primary-rgb) / 0.6);
	}

	.signal {
		display: flex;
		align-items: flex-end;
		gap: 2px;
		height: 14px;
	}

	.signal i {
		width: 4px;
		border-radius: 1px;
		background: rgb(255 255 255 / 0.12);
	}

	.signal i:nth-child(1) {
		height: 40%;
	}

	.signal i:nth-child(2) {
		height: 70%;
	}

	.signal i:nth-child(3) {
		height: 100%;
	}

	.signal.q1 i:nth-child(1),
	.signal.q2 i:nth-child(-n + 2),
	.signal.q3 i {
		background: var(--text-muted);
	}

	.best .signal.q3 i,
	.best .signal.q2 i:nth-child(-n + 2),
	.best .signal.q1 i:nth-child(1) {
		background: var(--primary);
	}

	@media (max-width: 640px) {
		.relay {
			padding: 14px 10px;
		}

		.grid {
			grid-template-columns: minmax(0, 1fr) 62px 60px 18px;
			gap: 10px;
			padding: 0 10px;
		}

		.bar-col {
			display: none;
		}

		.num .unit {
			display: none;
		}
	}
</style>
