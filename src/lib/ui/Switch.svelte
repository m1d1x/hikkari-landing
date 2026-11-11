<script lang="ts">
	/**
	 * iOS-style toggle, 46×28 track and 24×24 knob — RouteSection's _IosSwitch.
	 * `display` renders the look only, for use inside a link or another control.
	 */
	let {
		checked = $bindable(false),
		label,
		display = false,
		onchange
	}: { checked?: boolean; label: string; display?: boolean; onchange?: (value: boolean) => void } =
		$props();

	function toggle(event: MouseEvent) {
		event.stopPropagation();
		checked = !checked;
		onchange?.(checked);
	}
</script>

{#if display}
	<span class="switch" class:on={checked} aria-hidden="true"><span class="knob"></span></span>
{:else}
	<button
		class="switch"
		class:on={checked}
		role="switch"
		aria-checked={checked}
		aria-label={label}
		onclick={toggle}
	>
		<span class="knob"></span>
	</button>
{/if}

<style>
	.switch {
		display: block;
		flex: none;
		width: 46px;
		height: 28px;
		padding: 2px;
		border-radius: 999px;
		background: var(--surface-2);
		transition: background var(--transition-hover);
	}

	.switch.on {
		background: var(--primary);
	}

	.knob {
		display: block;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: #ddd;
		transition:
			transform var(--d-normal) var(--ease),
			background var(--transition-hover);
	}

	.on .knob {
		background: #fff;
		transform: translateX(18px);
	}
</style>
