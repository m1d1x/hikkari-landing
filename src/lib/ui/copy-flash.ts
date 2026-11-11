/** Direct port of app/lib/ui/copy_flash.dart. Keep curves, intervals and
 * transforms together so the browser uses the client's animation, not CSS
 * keyframes that approximate it. Flutter Cubic coefficients come from the
 * installed Flutter SDK's animation/curves.dart. */
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const segment = (v: number, start: number, end: number) => clamp((v - start) / (end - start));

function cubic(x1: number, y1: number, x2: number, y2: number) {
	const evaluate = (t: number, a: number, b: number) => 3 * a * (1 - t) ** 2 * t + 3 * b * (1 - t) * t ** 2 + t ** 3;
	return (input: number) => {
		// An input outside 0..1 never converges: the bisection below would spin forever and hang the tab.
		const v = clamp(input);
		if (v === 0 || v === 1) return v;
		let lo = 0, hi = 1, mid = .5;
		for (let i = 0; i < 40; i++) {
			mid = (lo + hi) / 2;
			const estimate = evaluate(mid, x1, x2);
			// Same error bound as Flutter's Cubic._cubicErrorBound.
			if (Math.abs(v - estimate) < .001) break;
			if (estimate < v) lo = mid; else hi = mid;
		}
		return evaluate(mid, y1, y2);
	};
}

const easeOut = cubic(0, 0, .58, 1);
const easeIn = cubic(.42, 0, 1, 1);
const easeInCubic = cubic(.55, .055, .675, .19);
const easeInBack = cubic(.6, -.28, .735, .045);
const easeOutBack = cubic(.175, .885, .32, 1.275);
const elasticOut = (v: number) => v === 0 || v === 1 ? v : 2 ** (-10 * v) * Math.sin((v - .1) * 2 * Math.PI / .4) + 1;

export function copyFlashFrame(v: number, leaving: boolean) {
	const reveal = easeOut(v);
	const checkRaw = segment(v, 0, .5);
	const checkScaleT = leaving ? easeInBack(checkRaw) : elasticOut(checkRaw);
	const checkEase = leaving ? easeIn(checkRaw) : easeOut(checkRaw);
	const labelRaw = segment(v, .2, .9);
	const labelBack = leaving ? easeInCubic(labelRaw) : easeOutBack(labelRaw);
	const labelT = leaving ? easeInCubic(labelRaw) : easeOut(labelRaw);
	const contentT = leaving ? easeInCubic(v) : easeOutBack(v);
	return {
		bodyOpacity: 1 - .55 * reveal,
		bodyScale: 1 - .035 * contentT,
		overlayY: (1 - reveal) * 7,
		checkOpacity: segment(v, 0, .22),
		checkAngle: (1 - checkEase) * -.8,
		checkScale: .3 + .7 * checkScaleT,
		labelOpacity: clamp(labelT),
		labelX: (1 - labelBack) * -18,
		labelScale: .8 + .2 * labelBack
	};
}
