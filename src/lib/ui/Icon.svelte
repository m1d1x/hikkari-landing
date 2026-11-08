<script lang="ts">
	import { icons, type IconName } from './icons';

	let { name, size = 20, class: className = '' }: { name: IconName; size?: number; class?: string } =
		$props();
</script>

<svg data-ui-icon
	class={className}
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="currentColor"
	aria-hidden="true"
>
	<path d={icons[name]} />
</svg>

<style>
	svg {
		flex: none;
		display: block;
	}
</style>
