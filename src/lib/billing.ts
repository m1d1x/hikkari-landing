/**
 * Checkout against the hub (hikkari-control internal/billing). The hub is the
 * one source of what is sold and for how much; the prices in site.ts only
 * draw the pricing section and must match the hub's plans (ids = PeriodId).
 *
 * An order is proven by its secret: the hub keeps its hash, the buyer's
 * browser keeps the secret in localStorage and gets it back in the return
 * URL's fragment, which no server along the way logs.
 */

/**
 * The hub's public API; VITE_API_URL points the dev server at a local hub.
 * Without it the dev server proxies /v1 to the real hub (vite.config.ts),
 * since the hub's CORS lets only https://hikkari.net in.
 */
export const apiUrl: string =
	import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? '' : 'https://api.hikkari.net');

export interface Plan {
	id: string;
	title: string;
	days: number;
	price_cents: number;
}

export interface Catalog {
	/** False while no payment provider is connected: nothing can be bought. */
	open: boolean;
	currency: string;
	plans: Plan[];
}

export type OrderStatus = 'pending' | 'paid' | 'canceled' | 'expired';

export interface Order {
	status: OrderStatus;
	renewal: boolean;
	plan: Plan;
	/** The subscription link, once paid. */
	url?: string;
}

/** What the hub refuses an order for (internal/billing/http.go). */
export type OrderError = 'closed' | 'email' | 'plan' | 'renew' | 'rate' | 'provider' | 'network';

export class BillingError extends Error {
	constructor(readonly code: OrderError) {
		super(code);
	}
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
	let res: Response;
	try {
		res = await fetch(apiUrl + path, init);
	} catch {
		throw new BillingError('network');
	}
	const body = await res.json().catch(() => ({}));
	if (!res.ok) throw new BillingError((body.error as OrderError) ?? 'network');
	return body as T;
}

let catalogPromise: Promise<Catalog> | null = null;

export function catalog(force = false): Promise<Catalog> {
	if (!catalogPromise || force) {
		catalogPromise = call<Catalog>('/v1/billing/plans').catch((err) => {
			catalogPromise = null;
			throw err;
		});
	}
	return catalogPromise;
}

export interface Placed {
	id: string;
	secret: string;
	pay_url: string;
}

/** Orders plan for email; renew is the token of the subscription to extend. */
export const placeOrder = (plan: string, email: string, renew?: string) =>
	call<Placed>('/v1/billing/orders', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ plan, email, renew: renew ?? '' })
	});

export const orderStatus = (id: string, secret: string) =>
	call<Order>(`/v1/billing/orders/${encodeURIComponent(id)}`, {
		headers: { Authorization: `Bearer ${secret}` }
	});

/** Mails every subscription link bought with email; answers the same whether or not there are any. */
export const recoverLinks = (email: string) =>
	call<{ status: string }>('/v1/billing/recover', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email })
	});

const storeKey = 'hikkari.orders';

/** Remembers an order's secret in this browser. Storage may be unavailable. */
export function rememberOrder(id: string, secret: string) {
	try {
		const all = JSON.parse(localStorage.getItem(storeKey) ?? '{}') as Record<string, string>;
		all[id] = secret;
		localStorage.setItem(storeKey, JSON.stringify(all));
	} catch {
		/* the return URL still carries the secret */
	}
}

export function recallOrder(id: string): string | null {
	try {
		const all = JSON.parse(localStorage.getItem(storeKey) ?? '{}') as Record<string, string>;
		return all[id] ?? null;
	} catch {
		return null;
	}
}

/** Opens the subscription in the installed client (hikkari-client deep link). */
export const importLink = (url: string) => `hikkari://import?url=${encodeURIComponent(url)}`;

export const rub = (cents: number) =>
	(cents % 100 === 0 ? String(cents / 100) : (cents / 100).toFixed(2).replace('.', ','))
		.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
