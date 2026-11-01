<script lang="ts">
	import { interval } from '#lib/actions/interval.ts';
	import Flag from '#lib/ui/Flag.svelte';
	import Icon from '#lib/ui/Icon.svelte';
	import Sparkline from '#lib/ui/Sparkline.svelte';
	import Switch from '#lib/ui/Switch.svelte';
	import { push, sample, series, type Probe } from './samples';

	/**
	 * The client's home screen: PowerToggle, active profile and the collapsed
	 * RouteSection, with the app's hover states. Each control is a link to the
	 * section that explains it: power → engine, profile → subscriptions,
	 * routing → routing.
	 */
	const probe: Probe = { base: 47, jitter: 6, spikes: 0.05 };

	let samples = $state(series(probe, 7));

	const rtt = $derived(Math.round(samples.slice(-12).reduce((a, b) => a + b, 0) / 12));
</script>

<div class="home" use:interval={{ ms: 1100, tick: () => (samples = push(samples, sample(probe))) }}>
	<a class="power" href="/#engine" aria-label="движок протоколов">
		<Icon name="power" size={62} />
	</a>

	<a class="profile" href="/#import" aria-label="профили и подписки">
		<span class="line">
			<span class="label">токио</span>
			<span class="spark">
				<Sparkline {samples} color="var(--primary)" height={17} />
			</span>
			<span class="rtt">{rtt} ms</span>
			<span class="chev"><Icon name="chevronDown" size={18} /></span>
		</span>
		<span class="endpoint">
			<Flag code="jp" width={16} height={12} />
			<span>demo.hikkari.net:443</span>
		</span>
	</a>

	<a class="route" href="/#routing" aria-label="маршрутизация">
		<span class="route-title">маршрутизация</span>
		<span class="route-chev"><Icon name="chevronDown" size={16} /></span>
		<span class="route-gap"></span>
		<span class="route-more"><Icon name="more" size={20} /></span>
		<Switch checked display label="маршрутизация" />
	</a>
</div>

<style>
	.home {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40px 16px 18px;
	}

	.power {
		display: grid;
		place-items: center;
		width: 160px;
		height: 160px;
		border-radius: 50%;
		border: 3px solid rgb(var(--primary-rgb) / 0.55);
		color: var(--primary);
		transition: border-color var(--transition-hover);
	}

	/* Hover states follow PowerToggle in the client (connected state). */
	.power:hover {
		border-color: rgb(var(--primary-rgb) / 0.85);
	}

	.profile {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		margin-top: 18px;
		padding: 14px 22px;
		font-family: var(--font-mono);
		border-radius: var(--radius-lg);
		transition: background var(--transition-hover);
	}

	.profile:hover {
		background: rgb(var(--primary-rgb) / 0.05);
	}

	.line {
		display: flex;
		align-items: center;
	}

	.label {
		font-size: 16px;
		font-weight: 700;
		color: var(--text);
		transition: color var(--transition-hover);
	}

	.profile:hover .label,
	.profile:hover .chev {
		color: var(--primary);
	}

	.spark {
		width: 50px;
		margin-left: 11px;
	}

	.rtt {
		margin-left: 9px;
		font-size: 14px;
		font-weight: 500;
		color: var(--text-muted);
		font-variant-numeric: tabular-nums;
	}

	.chev {
		display: grid;
		margin-left: 6px;
		color: var(--text-faint);
		transition: color var(--transition-hover);
	}

	.endpoint {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.2px;
		color: rgb(138 138 142 / 0.55);
	}

	.route {
		display: flex;
		align-items: center;
		align-self: stretch;
		margin-top: 22px;
		padding: 17px 16px 17px 19px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
	}

	.route-title {
		font-family: var(--font-mono);
		font-size: 16px;
		font-weight: 700;
		line-height: 1;
		transition: color var(--transition-hover);
	}

	.route-chev {
		display: grid;
		margin-left: 6px;
		color: var(--text-muted);
		transition: color var(--transition-hover);
	}

	.route:hover .route-title,
	.route:hover .route-chev,
	.route-more:hover {
		color: var(--primary);
	}

	.route-gap {
		flex: 1;
	}

	.route-more {
		display: grid;
		place-items: center;
		width: 28px;
		height: 28px;
		margin-right: 10px;
		color: var(--text-muted);
		transition: color var(--transition-hover);
	}
</style>
