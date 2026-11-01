<script lang="ts" module>
	export type CountryCode = 'jp' | 'lv' | 'fi' | 'nl' | 'de' | 'se' | 'pl' | 'fr';
</script>

<script lang="ts">
	/** Flat rectangular flag, 18×13 like the app's ProfileFlagBadge. */
	let { code, width = 18, height = 13 }: { code: CountryCode; width?: number; height?: number } =
		$props();
</script>

<svg {width} {height} viewBox="0 0 30 20" preserveAspectRatio="none" aria-hidden="true">
	{#if code === 'jp'}
		<rect width="30" height="20" fill="#fff" />
		<circle cx="15" cy="10" r="6" fill="#bc002d" />
	{:else if code === 'lv'}
		<rect width="30" height="20" fill="#9e3039" />
		<rect y="8" width="30" height="4" fill="#fff" />
	{:else if code === 'fi'}
		<rect width="30" height="20" fill="#fff" />
		<rect x="8.3" width="5" height="20" fill="#002f6c" />
		<rect y="7.5" width="30" height="5" fill="#002f6c" />
	{:else if code === 'nl'}
		<rect width="30" height="20" fill="#21468b" />
		<rect width="30" height="13.34" fill="#fff" />
		<rect width="30" height="6.67" fill="#ae1c28" />
	{:else if code === 'de'}
		<rect width="30" height="20" fill="#ffce00" />
		<rect width="30" height="13.34" fill="#dd0000" />
		<rect width="30" height="6.67" fill="#000" />
	{:else if code === 'se'}
		<rect width="30" height="20" fill="#006aa7" />
		<rect x="9.4" width="3.8" height="20" fill="#fecc02" />
		<rect y="8" width="30" height="4" fill="#fecc02" />
	{:else if code === 'pl'}
		<rect width="30" height="20" fill="#dc143c" />
		<rect width="30" height="10" fill="#fff" />
	{:else if code === 'fr'}
		<rect width="30" height="20" fill="#ed2939" />
		<rect width="20" height="20" fill="#fff" />
		<rect width="10" height="20" fill="#002395" />
	{/if}
</svg>

<style>
	svg {
		flex: none;
		display: block;
		border-radius: 2px;
	}
</style>
