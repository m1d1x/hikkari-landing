import { catalog, type Plan } from './billing.ts';
import { periods as defaultPeriods, type Period } from './site.ts';

/** Formats human-readable Russian label for a period */
export function formatPeriodLabel(months: number, title?: string): string {
	if (title && title.trim()) return title.trim();
	if (months === 1) return '1 месяц';
	if (months >= 2 && months <= 4) return `${months} месяца`;
	return `${months} месяцев`;
}

/** Converts a backend billing plan into a display Period */
export function planToPeriod(p: Plan): Period {
	const months = Math.max(1, Math.round(p.days / 30));
	return {
		id: p.id,
		label: formatPeriodLabel(months, p.title),
		months,
		price: Math.round(p.price_cents / 100)
	};
}

let livePeriods = $state<Period[]>(defaultPeriods);
let loaded = $state(false);
let loadPromise: Promise<Period[]> | null = null;

export async function loadLivePeriods(): Promise<Period[]> {
	if (loaded) return livePeriods;
	if (loadPromise) return loadPromise;

	loadPromise = (async () => {
		try {
			const shop = await catalog();
			if (shop?.plans && shop.plans.length > 0) {
				const converted = shop.plans
					.filter((p) => p.price_cents > 0)
					.map(planToPeriod);
				if (converted.length > 0) {
					livePeriods = converted;
					loaded = true;
					return converted;
				}
			}
		} catch {
			// keep fallback defaults on network/api error
		} finally {
			loadPromise = null;
		}
		return livePeriods;
	})();

	return loadPromise;
}

export function getPeriodsState() {
	return {
		get list() {
			return livePeriods;
		},
		get isLoaded() {
			return loaded;
		},
		load: loadLivePeriods
	};
}
