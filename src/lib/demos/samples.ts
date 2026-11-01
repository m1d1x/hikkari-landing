/** Synthetic RTT series for the interactive demos (clearly labelled as such). */

/** Small deterministic PRNG so prerendered and hydrated charts match. */
export function rng(seed: number) {
	let s = seed >>> 0;
	return () => {
		s = (s + 0x6d2b79f5) >>> 0;
		let t = s;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export interface Probe {
	base: number;
	jitter: number;
	/** Chance of an occasional spike. */
	spikes?: number;
}

export function sample(p: Probe, rand: () => number = Math.random): number {
	const spike = rand() < (p.spikes ?? 0.04) ? p.base * (0.4 + rand() * 0.8) : 0;
	return Math.max(4, Math.round(p.base + (rand() - 0.5) * 2 * p.jitter + spike));
}

export function series(p: Probe, seed: number, length = 60): number[] {
	const rand = rng(seed);
	return Array.from({ length }, () => sample(p, rand));
}

export function push<T>(list: T[], value: T, max = 60): T[] {
	const next = list.length >= max ? list.slice(list.length - max + 1) : list.slice();
	next.push(value);
	return next;
}
