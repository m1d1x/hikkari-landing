import { apiUrl } from './billing';

/**
 * Tracks a download button click from the landing page.
 * Uses navigator.sendBeacon with a keepalive fetch fallback so that the network
 * request outlives the page if navigation or file download triggers immediately.
 */
export function trackDownload(os: string, file: string) {
	try {
		const payload = JSON.stringify({
			os,
			file,
			ts: Math.floor(Date.now() / 1000)
		});
		const endpoint = `${apiUrl}/v1/landing/download`;

		if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
			const blob = new Blob([payload], { type: 'application/json' });
			navigator.sendBeacon(endpoint, blob);
		} else if (typeof fetch !== 'undefined') {
			fetch(endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: payload,
				keepalive: true
			}).catch(() => {});
		}
	} catch {
		// Telemetry must never disrupt user flow.
	}
}
