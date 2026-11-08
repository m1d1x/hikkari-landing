/** Site-wide facts in one place: navigation, outbound links, downloads. */

export const nav = [
	{ href: '/#engine', label: 'движок' },
	{ href: '/#routing', label: 'маршрутизация' },
	{ href: '/#relay', label: 'серверы' },
	{ href: '/#import', label: 'импорт' },
	{ href: '/#faq', label: 'faq' }
] as const;

export const legal = [
	{ href: '/offer', label: 'публичная оферта' },
	{ href: '/privacy', label: 'политика конфиденциальности' },
	{ href: '/terms', label: 'условия использования' }
] as const;

export const links = {
	github: '/github',
	changelog: '/changelog'
} as const;

export type PlatformId = 'macos' | 'windows';

export interface Download {
	id: PlatformId;
	name: string;
	/** Short system requirements, one fact per entry. */
	specs: string[];
	/** Installer extension shown on the button. */
	file: '.pkg' | '.exe';
	/** Public installer URL. */
	url: string;
}

// Installers are built by CI (`hikkari-<version>.pkg`, `hikkari-setup.exe`)
// and published to update.hikkari.net/download/.
export const downloads: Download[] = [
	{
		id: 'macos',
		name: 'macos',
		specs: ['10.15 и новее', 'apple silicon и intel'],
		file: '.pkg',
		url: 'https://update.hikkari.net/download/hikkari.pkg'
	},
	{
		id: 'windows',
		name: 'windows',
		specs: ['10 и 11', 'x64'],
		file: '.exe',
		url: 'https://update.hikkari.net/download/hikkari-setup.exe'
	}
];

export type PeriodId = string;

export interface Period {
	id: string;
	/** Segment label in the period switch. */
	label: string;
	months: number;
	/** Total price for the period, roubles. */
	price: number;
}

// Fallback launch prices: shown before live plans arrive from the hub API
// or if offline. Live prices are fetched dynamically from /v1/billing/plans.
export const periods: Period[] = [
	{ id: '1m', label: '1 месяц', months: 1, price: 99 },
	{ id: '6m', label: '6 месяцев', months: 6, price: 490 },
	{ id: '12m', label: '12 месяцев', months: 12, price: 890 }
];

/** Shows the «цена на запуске» mark next to the plan; turn off with regular prices. */
export const launchPricing = true;

/** Checkout for a period; the hub's plan ids are the period ids (src/lib/billing.ts). */
export const checkoutUrl = (period: string) => `/pay?plan=${encodeURIComponent(period)}`;

/**
 * Where /donate sends the money. `{amount}` is replaced with the roubles the
 * visitor picked; null while no donation channel is connected (the page then
 * shows the button disabled).
 */
export const donation = {
	url: null as string | null,
	amounts: [100, 300, 500, 1000],
	min: 50,
	max: 100_000
};
