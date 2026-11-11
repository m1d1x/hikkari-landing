<script lang="ts">
	/**
	 * Port of the client's Sparkline painter: a smooth line through RTT samples
	 * (quadratic midpoint curves). `null` is a failed probe — the line keeps the
	 * last successful RTT, so it never shows noisy outage markers.
	 */
	let {
		samples,
		color = 'var(--text-muted)',
		windowSize = 60,
		padding = 3,
		height = 30
	}: {
		samples: (number | null)[];
		color?: string;
		windowSize?: number;
		padding?: number;
		height?: number;
	} = $props();

	const W = 200;

	const d = $derived.by(() => {
		const slice = samples.slice(-windowSize);
		const ok = slice.filter((s): s is number => s !== null);
		if (ok.length === 0) return '';
		// Floor of 80 ms so a calm chart doesn't look spiky.
		const max = Math.max(80, ...ok);
		const inset = 1;
		const step = (W - inset * 2) / (windowSize - 1);
		const off = inset + (windowSize - slice.length) * step;
		const usable = height - padding * 2;

		const pts: [number, number][] = [];
		let last: number | null = null;
		slice.forEach((s, i) => {
			if (s !== null) last = s;
			if (last === null) return;
			pts.push([off + i * step, height - padding - (last / max) * usable]);
		});
		if (pts.length === 0) return '';

		let path = `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
		for (let i = 1; i < pts.length; i++) {
			const [x0, y0] = pts[i - 1];
			const [x1, y1] = pts[i];
			const mx = (x0 + x1) / 2;
			const my = (y0 + y1) / 2;
			path += ` Q${x0.toFixed(2)} ${y0.toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)}`;
			path += ` Q${x1.toFixed(2)} ${y1.toFixed(2)} ${x1.toFixed(2)} ${y1.toFixed(2)}`;
		}
		return path;
	});
</script>

<svg viewBox="0 0 {W} {height}" preserveAspectRatio="none" style:height="{height}px" aria-hidden="true">
	<path
		{d}
		fill="none"
		stroke={color}
		stroke-width="1.4"
		stroke-linecap="round"
		stroke-linejoin="round"
		vector-effect="non-scaling-stroke"
	/>
</svg>

<style>
	svg {
		display: block;
		width: 100%;
		overflow: visible;
	}

	path {
		transition: stroke var(--transition-hover);
	}
</style>
