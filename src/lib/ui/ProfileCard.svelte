<script lang="ts">
	import Flag, { type CountryCode } from './Flag.svelte';
	import Icon from './Icon.svelte';
	import Sparkline from './Sparkline.svelte';

	/**
	 * ProfileSummaryCard + ProfileTile from the client: flag, name, live
	 * sparkline, average RTT and the expand chevron. Selected = active profile.
	 */
	let {
		title,
		flag,
		samples,
		selected = false,
		onselect
	}: {
		title: string;
		flag?: CountryCode;
		samples: (number | null)[];
		selected?: boolean;
		onselect?: () => void;
	} = $props();

	const rtt = $derived.by(() => {
		const ok = samples.slice(-12).filter((s): s is number => s !== null);
		return ok.length < 3 ? null : Math.round(ok.reduce((a, b) => a + b, 0) / ok.length);
	});
</script>

<button class="card" class:selected aria-pressed={selected} onclick={onselect}>
	{#if flag}<Flag code={flag} />{/if}
	<span class="title">{title}</span>
	<span class="chart">
		<Sparkline {samples} color={selected ? 'var(--primary)' : 'var(--text-muted)'} height={30} />
	</span>
	<span class="rtt">
		{#if rtt === null}…{:else}{rtt}<span class="unit">&nbsp;ms</span>{/if}
	</span>
	<span class="chevron icon-text"><Icon name="chevronDown" size={19} /></span>
</button>

<style>
	.card {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 11px 8px 11px 14px;
		text-align: left;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		transition:
			background var(--transition-hover),
			border-color var(--transition-hover);
	}

	.card:hover {
		background: color-mix(in srgb, var(--primary) 6%, var(--surface));
	}

	.card.selected {
		background: var(--selected-bg);
		border-color: var(--selected-border);
	}

	.card :global(svg:first-child) {
		margin-right: 8px;
	}

	.title {
		flex: none;
		max-width: 42%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-family: var(--font-mono);
		font-size: 14px;
		font-weight: 600;
		line-height: 1.1;
		color: var(--text-secondary);
	}

	.chart {
		flex: 1 1 60px;
		min-width: 24px;
		margin: 0 10px 0 12px;
	}

	.rtt {
		flex: none;
		min-width: 48px;
		text-align: right;
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 600;
		color: var(--text-muted);
		font-variant-numeric: tabular-nums;
	}

	.selected .rtt {
		color: var(--text);
		font-weight: 700;
	}

	.unit {
		color: rgb(138 138 142 / 0.62);
		font-weight: 500;
	}

	.chevron {
		flex: none;
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		margin-left: 6px;
		color: var(--text-muted);
	}
</style>
