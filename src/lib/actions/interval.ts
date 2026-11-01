import type { Action } from 'svelte/action';

export interface IntervalOptions {
	ms: number;
	tick: () => void;
}

/**
 * Runs `tick` every `ms` while the element is on screen and the tab is
 * visible. Demos stay still for visitors who prefer reduced motion.
 */
export const interval: Action<HTMLElement, IntervalOptions> = (node, initial) => {
	let opts = initial;
	let onScreen = false;
	let timer: ReturnType<typeof setInterval> | undefined;
	const reduced = matchMedia('(prefers-reduced-motion: reduce)');

	const sync = () => {
		const run = onScreen && !document.hidden && !reduced.matches;
		if (run && timer === undefined) {
			timer = setInterval(() => opts.tick(), opts.ms);
		} else if (!run && timer !== undefined) {
			clearInterval(timer);
			timer = undefined;
		}
	};
	const restart = () => {
		if (timer !== undefined) clearInterval(timer);
		timer = undefined;
		sync();
	};

	const io = new IntersectionObserver((entries) => {
		onScreen = entries.some((e) => e.isIntersecting);
		sync();
	});
	io.observe(node);
	document.addEventListener('visibilitychange', sync);
	reduced.addEventListener('change', sync);

	return {
		update(next) {
			const changed = next.ms !== opts.ms;
			opts = next;
			if (changed) restart();
		},
		destroy() {
			io.disconnect();
			document.removeEventListener('visibilitychange', sync);
			reduced.removeEventListener('change', sync);
			if (timer !== undefined) clearInterval(timer);
		}
	};
};
