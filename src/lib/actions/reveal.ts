import type { Action } from 'svelte/action';

/**
 * Fades an element in the first time it scrolls into view. Pair it with a
 * `data-reveal` attribute in markup so the hidden state is part of the
 * prerendered HTML (app.html restores visibility when JS is off).
 */
export const reveal: Action<HTMLElement, number | undefined> = (node, delay = 0) => {
	node.dataset.reveal = '';
	node.style.setProperty('--reveal-delay', `${delay}ms`);
	const io = new IntersectionObserver(
		(entries) => {
			if (entries.some((e) => e.isIntersecting)) {
				node.classList.add('revealed');
				io.disconnect();
			}
		},
		{ rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
	);
	io.observe(node);
	return { destroy: () => io.disconnect() };
};
