<script lang="ts">
	import { onMount } from 'svelte';
	import { interval } from '#lib/actions/interval.ts';
	import Icon from '#lib/ui/Icon.svelte';
	import Logo from '#lib/ui/Logo.svelte';

	/**
	 * Simulation of the protocol engine, built around make-before-break: when
	 * the censor starts interfering with the active protocol, the next warm one
	 * picks the traffic up while the old one still carries it — the line to the
	 * server never goes dark. The blocked
	 * protocol then adapts (new fingerprint and SNI) and returns to the pool.
	 */
	type State = 'active' | 'joining' | 'interfered' | 'blocked' | 'adapting' | 'ready';
	type LogKind = 'ok' | 'warn' | 'muted';

	interface Protocol {
		id: string;
		label: string;
		rtt: number;
		state: State;
		/** Ticks left in the current transient state. */
		left: number;
	}

	const STABLE_TICKS = 6;
	const BLOCKED_TICKS = 3;
	const ADAPT_TICKS = 4;
	/** Both protocols carry traffic for this long — long enough to see. */
	const HANDOVER_TICKS = 2;

	let protocols = $state<Protocol[]>([
		{ id: 'vless', label: 'vless reality', rtt: 41, state: 'active', left: 0 },
		{ id: 'hysteria2', label: 'hysteria2', rtt: 47, state: 'ready', left: 0 },
		{ id: 'trojan', label: 'trojan', rtt: 52, state: 'ready', left: 0 },
		{ id: 'shadowsocks', label: 'shadowsocks', rtt: 58, state: 'ready', left: 0 },
		{ id: 'awg', label: 'amneziawg', rtt: 44, state: 'ready', left: 0 }
	]);
	let log = $state<{ id: number; time: string; text: string; kind: LogKind }[]>([]);
	let stable = 0;
	let logId = 0;


	function write(text: string, kind: LogKind) {
		const time = new Date().toLocaleTimeString('ru-RU', { hour12: false });
		log = [...log.slice(-2), { id: logId++, time, text, kind }];
	}

	function nextReady(from: number) {
		for (let k = 1; k <= protocols.length; k++) {
			const i = (from + k) % protocols.length;
			if (protocols[i].state === 'ready') return i;
		}
		return -1;
	}

	function step() {
		for (const p of protocols) {
			if (p.state === 'blocked' && --p.left <= 0) {
				p.state = 'adapting';
				p.left = ADAPT_TICKS;
				write(`${p.label}: смена отпечатка и sni`, 'muted');
			} else if (p.state === 'adapting' && --p.left <= 0) {
				p.state = 'ready';
				write(`${p.label}: снова готов`, 'muted');
			}
		}

		// Second half of the handover: the new protocol owns the traffic, the
		// old one is dropped only now.
		const joining = protocols.findIndex((p) => p.state === 'joining');
		if (joining >= 0) {
			if (--protocols[joining].left > 0) return;
			const old = protocols.find((p) => p.state === 'interfered');
			if (old) {
				old.state = 'blocked';
				old.left = BLOCKED_TICKS;
			}
			const p = protocols[joining];
			p.state = 'active';
			stable = 0;
			write(`${p.label}: соединение принято, ${p.rtt} ms`, 'ok');
			return;
		}

		const active = protocols.findIndex((p) => p.state === 'active');
		if (active < 0 || ++stable < STABLE_TICKS) return;
		const next = nextReady(active);
		if (next < 0) return;

		// First half: interference is noticed and the next warm protocol joins
		// while the old one still carries traffic.
		const old = protocols[active];
		const fresh = protocols[next];
		old.state = 'interfered';
		fresh.state = 'joining';
		fresh.left = HANDOVER_TICKS;
		fresh.rtt = Math.round(fresh.rtt * (0.92 + Math.random() * 0.16));
		write(`${old.label}: помехи, трафик переходит на ${fresh.label}`, 'warn');
	}

	// ----- wires between the nodes, measured from the live layout -----
	let root: HTMLDivElement;
	let device: HTMLDivElement;
	let server: HTMLDivElement;
	let engine: HTMLDivElement;
	let rows: HTMLLIElement[] = $state([]);
	let size = $state({ w: 0, h: 0 });
	let vertical = $state(false);
	let anchors = $state<{
		device: [number, number];
		server: [number, number];
		engineTop: [number, number];
		engineBottom: [number, number];
		rowsIn: [number, number][];
		rowsOut: [number, number][];
	} | null>(null);

	function measure() {
		const box = root.getBoundingClientRect();
		const rel = (r: DOMRect, x: number, y: number): [number, number] => [
			r.left - box.left + r.width * x,
			r.top - box.top + r.height * y
		];
		const d = device.getBoundingClientRect();
		const s = server.getBoundingClientRect();
		const e = engine.getBoundingClientRect();
		const rowY = (r: HTMLLIElement) => rel(r.getBoundingClientRect(), 0, 0.5)[1];
		vertical = getComputedStyle(root).flexDirection === 'column';
		size = { w: box.width, h: box.height };
		anchors = {
			device: vertical ? rel(d, 0.5, 1) : rel(d, 1, 0.5),
			server: vertical ? rel(s, 0.5, 0) : rel(s, 0, 0.5),
			engineTop: rel(e, 0.5, 0),
			engineBottom: rel(e, 0.5, 1),
			// Wires meet the engine card's edge at each row's height.
			rowsIn: rows.map((r): [number, number] => [e.left - box.left, rowY(r)]),
			rowsOut: rows.map((r): [number, number] => [e.right - box.left, rowY(r)])
		};
	}

	const curve = ([x0, y0]: [number, number], [x1, y1]: [number, number]) => {
		const k = Math.abs(x1 - x0) * 0.55;
		return `M${x0} ${y0} C${x0 + k} ${y0} ${x1 - k} ${y1} ${x1} ${y1}`;
	};
	const midpoint = ([x0, y0]: [number, number], [x1, y1]: [number, number]): [number, number] => [
		(x0 + x1) / 2,
		(y0 + y1) / 2
	];
	const carries = (s: State) => s === 'active' || s === 'joining' || s === 'interfered';

	onMount(() => {
		write(`${protocols[0].label}: подключено, ${protocols[0].rtt} ms`, 'ok');
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(root);
		return () => ro.disconnect();
	});
</script>

<div class="demo dashed" use:interval={{ ms: 1000, tick: step }}>
	<span class="legend">симуляция работы движка</span>
	<div class="diagram" bind:this={root}>
		{#if anchors}
			<svg class="wires" width={size.w} height={size.h} viewBox="0 0 {size.w} {size.h}" aria-hidden="true">
				{#if vertical}
					<path class="wire active" d="M{anchors.device[0]} {anchors.device[1]} L{anchors.engineTop[0]} {anchors.engineTop[1]}" />
					<path class="wire active" d="M{anchors.engineBottom[0]} {anchors.engineBottom[1]} L{anchors.server[0]} {anchors.server[1]}" />
				{:else}
					{#each protocols as p, i (p.id)}
						{#if anchors.rowsIn[i]}
							<path class="wire {p.state}" d={curve(anchors.device, anchors.rowsIn[i])} />
							{#if carries(p.state) && anchors.rowsOut[i]}
								<path class="wire {p.state}" d={curve(anchors.rowsOut[i], anchors.server)} />
							{/if}
							{#if p.state === 'blocked'}
								{@const [mx, my] = midpoint(anchors.device, anchors.rowsIn[i])}
								<path class="cross" transform="translate({mx} {my})" d="M-4 -4 L4 4 M4 -4 L-4 4" />
							{/if}
						{/if}
					{/each}
				{/if}
			</svg>
		{/if}

		<div class="node" bind:this={device}>
			<Icon name="laptop" size={24} />
			<span>вы</span>
		</div>

		<div class="engine" bind:this={engine}>
			<div class="engine-head">
				<Logo size={36} />
				<span class="engine-name">hikkari</span>
			</div>
			<ul>
				{#each protocols as p, i (p.id)}
					<li class="row {p.state}" bind:this={rows[i]}>
						<span class="label">{p.label}</span>
						<span class="state icon-text">
							{#if p.state === 'active' || p.state === 'joining'}
								<i class="live"></i>{p.rtt} ms
							{:else if p.state === 'interfered'}
								помехи
							{:else if p.state === 'blocked'}
								<Icon name="close" size={14} /> сбой
							{:else if p.state === 'adapting'}
								<Icon name="refresh" size={13} class="spin" /> адаптация
							{:else}
								готов
							{/if}
						</span>
					</li>
				{/each}
			</ul>
		</div>

		<div class="node" bind:this={server}>
			<Icon name="dns" size={24} />
			<span>сервер</span>
		</div>
	</div>

	<ol class="log" aria-live="polite">
		{#each log as line (line.id)}
			<li class={line.kind}><time>{line.time}</time>{line.text}</li>
		{/each}
	</ol>
</div>

<style>
	.demo {
		/* Blocks a notch darker than the app's surfaces, separated by clearly
		   visible hairlines; only the live row carries the accent. */
		--well: #141417;
		--well-row: #1c1c20;
		position: relative;
		padding: 34px 28px 24px;
		border-radius: var(--radius-lg);
	}

	.legend {
		position: absolute;
		top: -9px;
		left: 50%;
		transform: translateX(-50%);
		padding: 0 12px;
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 500;
		line-height: 18px;
		letter-spacing: 0.04em;
		white-space: nowrap;
		color: var(--text-secondary);
		background: var(--bg);
	}

	.diagram {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
	}

	.wires {
		position: absolute;
		inset: 0;
		overflow: visible;
		pointer-events: none;
	}

	.wire {
		fill: none;
		stroke: rgb(255 255 255 / 0.16);
		stroke-width: 1;
		transition:
			stroke 400ms var(--ease),
			opacity 400ms var(--ease);
	}

	/* Traffic: dashes keep moving through every handover. */
	.wire.active,
	.wire.joining,
	.wire.interfered {
		stroke-width: 1.6;
		stroke-dasharray: 6 6;
		animation: flow 900ms linear infinite;
	}

	.wire.active,
	.wire.joining {
		stroke: var(--primary);
	}

	.wire.interfered {
		stroke: rgb(255 159 10 / 0.7);
	}

	.wire.blocked {
		stroke: rgb(255 69 58 / 0.35);
		stroke-dasharray: 2 6;
	}

	.wire.adapting {
		stroke: rgb(255 255 255 / 0.28);
		stroke-dasharray: 3 5;
		animation: flow 1600ms linear infinite;
	}

	@keyframes flow {
		to {
			stroke-dashoffset: -12;
		}
	}

	.cross {
		stroke: var(--bad);
		stroke-width: 1.6;
		stroke-linecap: round;
	}

	.node {
		position: relative;
		flex: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;
		width: 96px;
		height: 96px;
		background: var(--well);
		border: 1px solid var(--border-strong);
		border-radius: var(--radius);
		color: var(--text);
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 600;
		line-height: 1.3;
		text-align: center;
	}

	.node :global(svg) {
		color: var(--text-secondary);
	}

	.engine {
		position: relative;
		flex: 0 1 272px;
		min-width: 0;
		padding: 14px;
		background: var(--well);
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-lg);
	}

	.engine-head {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 14px;
		padding: 8px 0 18px;
	}

	.engine-name {
		font-family: var(--font-mono);
		font-size: 18px;
		font-weight: 600;
		letter-spacing: 0.12em;
	}

	ul {
		display: grid;
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		height: 38px;
		padding: 0 12px;
		background: var(--well-row);
		border: 1px solid rgb(255 255 255 / 0.09);
		border-radius: 12px;
		font-family: var(--font-mono);
		font-size: 13px;
		transition:
			border-color var(--transition-hover),
			background var(--transition-hover);
	}

	.label {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: var(--text-secondary);
		transition: color var(--transition-hover);
	}

	.state {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		flex: none;
		font-size: 11px;
		color: var(--text-muted);
		font-variant-numeric: tabular-nums;
	}

	/* Only the protocol carrying traffic gets the app's selected style. */
	.row.active,
	.row.joining {
		border-color: rgb(var(--primary-rgb) / 0.75);
		background: color-mix(in srgb, var(--primary) 6%, var(--well-row));
	}

	.row.active .label,
	.row.joining .label {
		color: var(--primary);
		font-weight: 600;
	}

	.row.active .state,
	.row.joining .state {
		color: var(--text);
	}

	.row.interfered {
		border-color: rgb(255 159 10 / 0.45);
	}

	.row.interfered .label,
	.row.interfered .state {
		color: var(--warn);
	}

	.row.blocked .label {
		color: var(--text-faint);
		text-decoration: line-through;
		text-decoration-color: rgb(255 69 58 / 0.6);
	}

	.row.blocked .state {
		color: var(--bad);
	}

	.row.adapting {
		border-style: dashed;
		border-color: var(--border-strong);
	}

	.row.adapting .label {
		color: var(--text-muted);
	}

	.row.adapting .state {
		color: var(--text-secondary);
	}

	.state :global(.spin) {
		animation: spin 1.2s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.live {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--primary);
	}


	.log {
		display: grid;
		align-content: end;
		gap: 6px;
		height: 74px;
		margin: 24px 0 0;
		padding: 14px 0 0;
		border-top: 1px solid var(--border);
		list-style: none;
		font-family: var(--font-mono);
		font-size: 12px;
		overflow: hidden;
	}

	.log li {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		animation: line-in 400ms var(--ease);
	}

	.log li.ok {
		color: var(--text-secondary);
	}

	.log li.warn {
		color: var(--warn);
	}

	.log li.muted {
		color: var(--text-faint);
	}

	.log time {
		margin-right: 12px;
		color: var(--text-faint);
	}

	@keyframes line-in {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}

	@media (max-width: 720px) {
		.demo {
			padding: 18px;
		}

		.diagram {
			flex-direction: column;
			gap: 36px;
		}

		.engine {
			flex: none;
			width: 100%;
		}

		.node {
			flex-direction: row;
			width: auto;
			height: 52px;
			padding: 0 18px;
		}

	}

	@media (prefers-reduced-motion: reduce) {
		.wire,
		.state :global(.spin) {
			animation: none !important;
		}
	}
</style>
