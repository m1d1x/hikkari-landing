import type { Action } from 'svelte/action';

/**
 * Glides a box between heights whenever `key` changes. The new content is
 * laid out at its final size straight away (top-aligned, clipped by the box);
 * only the box itself grows or shrinks from the height it was showing.
 * Ordinary content changes between keys keep their own animations.
 * Duration and easing follow the `--d-routing` and `--ease` tokens.
 */
export const morph: Action<HTMLElement, unknown> = (node, key) => {
	let shown = node.offsetHeight;
	let animation: Animation | null = null;
	const reduced = matchMedia('(prefers-reduced-motion: reduce)');
	const ro = new ResizeObserver(() => {
		if (!animation) shown = node.offsetHeight;
	});
	ro.observe(node);

	return {
		update(next) {
			if (next === key) return;
			key = next;
			// Mid-flight, the visible height is the animated one; retarget from it.
			const from = animation ? node.offsetHeight : shown;
			animation?.cancel();
			const to = node.offsetHeight;
			shown = to;
			if (from === to || reduced.matches) return;
			const style = getComputedStyle(node);
			const current = node.animate([{ height: `${from}px` }, { height: `${to}px` }], {
				duration: parseFloat(style.getPropertyValue('--d-routing')) || 520,
				easing: style.getPropertyValue('--ease').trim() || 'ease-out'
			});
			animation = current;
			const done = () => {
				if (animation !== current) return;
				animation = null;
				shown = node.offsetHeight;
			};
			current.onfinish = done;
			current.oncancel = done;
		},
		destroy() {
			ro.disconnect();
			animation?.cancel();
		}
	};
};
