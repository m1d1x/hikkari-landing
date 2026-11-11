<script lang="ts">
	import { onDestroy } from 'svelte';
	import Icon from './Icon.svelte';
	import { copyFlashFrame } from './copy-flash';

	let { value }: { value: string } = $props();
	let copied = $state(false);
	let copying = $state(false);
	let hovered = $state(false);
	let focused = $state(false);
	let error = $state(false);
	let v = $state(0);
	let leaving = $state(false);
	let link: HTMLElement;
	let timer: ReturnType<typeof setTimeout>;
	let raf = 0;
	const frame = $derived(copyFlashFrame(v, leaving));
	const flashing = $derived(copying || copied);
	const dark = $derived(hovered || focused || flashing);
	const hint = $derived((hovered || focused) && !flashing);

	onDestroy(() => { clearTimeout(timer); cancelAnimationFrame(raf); });

	function animate(reverse: boolean) {
		leaving = reverse;
		const started = performance.now();
		const duration = reverse ? 190 : 225;
		const tick = (now: number) => {
			// The frame timestamp can precede `started`, so keep progress inside 0..1.
			const progress = Math.max(0, Math.min(1, (now - started) / duration));
			v = reverse ? 1 - progress : progress;
			if (progress < 1) raf = requestAnimationFrame(tick);
			else if (reverse) copied = false;
		};
		raf = requestAnimationFrame(tick);
	}

	async function copy() {
		if (copying || copied) return;
		copying = true;
		error = false;
		try {
			await navigator.clipboard.writeText(value);
			copied = true;
			if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
				v = 1;
				timer = setTimeout(() => { copied = false; v = 0; }, 450);
			} else {
				v = 0;
				animate(false);
				timer = setTimeout(() => animate(true), 450);
			}
		} catch {
			error = true;
			const range = document.createRange();
			range.selectNodeContents(link);
			const selection = window.getSelection();
			selection?.removeAllRanges();
			selection?.addRange(range);
		} finally { copying = false; }
	}
</script>

<div class="copy-field">
	<button type="button" class:dark class:flashing onclick={copy}
		onpointerenter={(event) => { if (event.pointerType !== 'touch') hovered = true; }}
		onpointerleave={() => { hovered = false; }}
		onfocus={(event) => { focused = event.currentTarget.matches(':focus-visible'); }} onblur={() => { focused = false; }}
		aria-label="скопировать ссылку подписки">
		<span class="surface" style:transform="scale({copied ? frame.bodyScale : 1})">
			<span class="body icon-text"><span class="link" bind:this={link}>{value}</span><Icon name="copy" size={18} /></span>
			<span class="hint icon-text" class:visible={hint} aria-hidden="true"><Icon name="copy" size={15} />скопировать</span>
		</span>
		{#if copied}
			<span class="confirmation" aria-hidden="true" style:transform="translateY({frame.overlayY}px)">
				<span class="check" style:opacity={frame.checkOpacity} style:transform="rotate({frame.checkAngle}rad) scale({frame.checkScale})"><Icon name="check" size={20} /></span>
				<span class="label" style:opacity={frame.labelOpacity} style:transform="translate({frame.labelX}px, -1.5px) scale({frame.labelScale})">скопировано</span>
			</span>
		{/if}
	</button>
	<span class="sr-only" role="status">{copied ? 'ссылка скопирована' : ''}</span>
	{#if error}<p class="error" role="alert">не удалось скопировать. ссылка выделена для ручного копирования.</p>{/if}
</div>

<style>
	button { position: relative; width: 100%; text-align: left; }
	.surface { position: relative; display: block; padding: 10px 12px; min-height: 48px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--bg); transition: background var(--transition-hover); }
	.dark .surface { background: color-mix(in srgb, var(--bg) 40%, black); }
	.body { display: flex; align-items: center; gap: 6px; min-height: 26px; opacity: 1; transition: opacity 220ms var(--ease); }
	.dark .body { opacity: .08; }
	/* The icon sits alone beside the link, so it keeps geometric centring instead of the text-row offset. */
	.body :global(svg) { flex: none; color: var(--text-muted); translate: none; }
	.link { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: 700 13px/1.5 var(--font-mono); color: var(--primary); }
	.hint { position: absolute; inset: 0; display: flex; justify-content: center; align-items: center; gap: 6px; opacity: 0; pointer-events: none; color: var(--primary); font: 600 14px/1 var(--font-mono); transition: opacity 220ms var(--ease); }
	.hint.visible { opacity: 1; }
	.flashing .hint { transition-duration: 140ms; }
	.confirmation { position: absolute; inset: 0; display: flex; justify-content: center; align-items: center; gap: 7px; color: var(--primary); pointer-events: none; font: 600 15px/1 var(--font-mono); }
	.label { transform-origin: left center; }
	.check { display: flex; }
	.error { margin-top: 8px; color: var(--bad); font-size: 12px; text-align: center; }
	.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
	@media (prefers-reduced-motion: reduce) { .surface, .body, .hint { transition: none; } }
</style>
