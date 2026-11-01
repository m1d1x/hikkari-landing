<script lang="ts">
	import '@fontsource/ibm-plex-sans/latin-400.css';
	import '@fontsource/ibm-plex-sans/latin-500.css';
	import '@fontsource/ibm-plex-sans/latin-600.css';
	import '@fontsource/ibm-plex-sans/cyrillic-400.css';
	import '@fontsource/ibm-plex-sans/cyrillic-500.css';
	import '@fontsource/ibm-plex-sans/cyrillic-600.css';
	import '@fontsource/ibm-plex-mono/latin-400.css';
	import '@fontsource/ibm-plex-mono/latin-500.css';
	import '@fontsource/ibm-plex-mono/latin-600.css';
	import '@fontsource/ibm-plex-mono/latin-700.css';
	import '@fontsource/ibm-plex-mono/cyrillic-400.css';
	import '@fontsource/ibm-plex-mono/cyrillic-500.css';
	import '@fontsource/ibm-plex-mono/cyrillic-600.css';
	import '@fontsource/ibm-plex-mono/cyrillic-700.css';
	import '../app.css';

	let { children } = $props();
</script>

{@render children()}
