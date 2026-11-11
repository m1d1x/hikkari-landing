import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter()
		})
	],
	server: {
		port: 5173,
		// The hub only lets https://hikkari.net read its API, so the dev
		// server proxies it and the page calls its own origin (src/lib/billing.ts).
		proxy: {
			'/v1': { target: 'https://api.hikkari.net', changeOrigin: true }
		}
	}
});
