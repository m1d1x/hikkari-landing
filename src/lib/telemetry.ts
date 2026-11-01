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

		// Using text/plain guarantees a CORS-safelisted simple request (no OPTIONS preflight),
		// so browsers do not drop or block the beacon during download navigation.
		if (typeof fetch !== 'undefined') {
			fetch(endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
				body: payload,
				keepalive: true,
				mode: 'cors'
			}).catch(() => {});
		} else if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
			navigator.sendBeacon(endpoint, payload);
		}
	} catch {
		// Telemetry must never disrupt user flow.
	}
}
