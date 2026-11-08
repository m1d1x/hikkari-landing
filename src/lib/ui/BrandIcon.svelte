<script lang="ts">
	import { siApple, siGithub } from 'simple-icons';

	// Windows has no Simple Icons entry (trademark policy); its four panes are
	// drawn here instead.
	const windows = 'M3 5.5 10.5 4.5v7H3v-6zm0 13 7.5 1v-7H3v6zm8.5 1.13L21 21v-8.5h-9.5v7.13zM11.5 4.37V11.5H21V3l-9.5 1.37z';

	// Sber, Yandex Music and Wildberries are missing from Simple Icons too; the
	// marks below come from their official SVGs on Wikimedia Commons
	// (Sberbank_Logo_2020, Yandex_Music_icon_2023, Wildberries_2023_Pink — the
	// "wb" letters of the wordmark).
	const sber =
		'M41.61 9.55C42.7 10.98 43.61 12.54 44.39 14.2L23.31 29.93L14.46 24.3L14.46 17.57L23.27 23.15ZM5.47 23.84C5.47 23.52 5.47 23.24 5.52 22.92L0.18 22.64C0.18 23.01 0.14 23.43 0.14 23.79C0.14 30.25 2.74 36.11 6.93 40.35L10.72 36.52C7.48 33.29 5.47 28.82 5.47 23.84ZM23.27 5.86C23.59 5.86 23.86 5.86 24.18 5.9L24.45 0.51C24.09 0.51 23.68 0.46 23.31 0.46C16.93 0.46 11.13 3.09 6.93 7.33L10.72 11.16C13.91 7.89 18.38 5.86 23.27 5.86ZM23.27 41.82C22.95 41.82 22.67 41.82 22.35 41.78L22.08 47.17C22.45 47.17 22.86 47.22 23.22 47.22C29.61 47.22 35.4 44.59 39.6 40.35L35.81 36.52C32.62 39.84 28.19 41.82 23.27 41.82ZM33.3 8.99L37.82 5.62C33.85 2.4 28.79 0.41 23.27 0.41L23.27 5.81C27.01 5.86 30.47 7.01 33.3 8.99ZM46.44 23.84C46.44 22.41 46.3 21.03 46.07 19.64L41.1 23.38C41.1 23.52 41.1 23.7 41.1 23.84C41.1 29.14 38.82 33.89 35.22 37.17L38.82 41.18C43.48 36.94 46.44 30.71 46.44 23.84ZM23.27 41.82C18.02 41.82 13.32 39.52 10.08 35.88L6.11 39.52C10.36 44.27 16.47 47.22 23.27 47.22ZM11.36 10.51L7.75 6.5C3.05 10.79 0.14 16.97 0.14 23.84L5.47 23.84C5.47 18.58 7.75 13.79 11.36 10.51Z';
	const yandexmusic =
		'M21.79 8.39l-.09-.43-3.63-.63 2.11-2.85-.25-.27-3.1 1.49.39-3.95-.32-.18-1.89 3.19L12.91 0h-.37l.5 4.6L7.71.33l-.45.13 4.11 5.16L3.24 2.91l-.37.41 7.26 4.13L.11 8.29 0 8.91l10.41 1.13-8.68 7.18.37.5 10.33-5.62-2.05 9.9h.63l3.96-9.31 2.41 7.29.43-.33-.99-7.41 3.76 4.27.25-.39-2.88-5.29 4.02 1.49.04-.45-3.6-2.66 3.4-.82z';
	const wildberries =
		'M54.9 52 43.8 24h-8.5l-11 28L13.2 24H0l19.4 49.4h8.5L39.6 44l11.7 29.4h8.5L79.1 24H66zM110.8 22.1c-5.7 0-10.8 1.7-15.1 4.5V.5H83.6v48.1c0 14.6 12.2 26.4 27.1 26.4 14.9 0 27.3-11.7 27.3-26.5S126 22.1 110.8 22.1zM110.8 63.3c-8.2 0-15.1-6.4-15.1-14.7S102.2 34 110.8 34 126 40.5 126 48.6s-6.9 14.7-15.2 14.7z';

	const brands = {
		apple: { path: siApple.path, box: '0 0 24 24' },
		github: { path: siGithub.path, box: '0 0 24 24' },
		windows: { path: windows, box: '0 0 24 24' },
		sber: { path: sber, box: '0 0 46.6 47.7' },
		yandexmusic: { path: yandexmusic, box: '0 0 22 22' },
		wildberries: { path: wildberries, box: '0 0 138.2 75.1' }
	} as const;

	let { name, size = 18 }: { name: keyof typeof brands; size?: number } = $props();
</script>

<svg data-ui-icon width={size} height={size} viewBox={brands[name].box} fill="currentColor" fill-rule="evenodd" aria-hidden="true">
	<path d={brands[name].path} />
</svg>

<style>
	svg {
		flex: none;
		display: block;
	}
</style>
