<script lang="ts">
	import HomeScreen from '#lib/demos/HomeScreen.svelte';
	import AppWindow from '#lib/ui/AppWindow.svelte';
	import BrandIcon from '#lib/ui/BrandIcon.svelte';
	import Button from '#lib/ui/Button.svelte';
	import Icon from '#lib/ui/Icon.svelte';
</script>

<section class="hero" id="top">
	<img class="art" src="/art/hero-figure-pilot-4k.webp" alt="" aria-hidden="true" width="4096" height="4829" />

	<div class="container stack">
		<div class="copy">
			<h1>vpn, о котором<br />забываешь</h1>
			<p class="lead">
				если протокол или сервер перестал работать, hikkari бесшовно переключит на рабочий. выключать
				его не придётся: благодаря гибкой маршрутизации игры и российские сайты работают напрямую
			</p>
			<div class="actions">
				<Button href="/#download">скачать <Icon name="download" size={18} /></Button>
				<Button href="/#pricing" variant="ghost">подписка hikkari <Icon name="arrowForward" size={16} /></Button>
			</div>
			<ul class="platforms" aria-label="платформы">
				<li><a class="icon-text" href="/#download"><BrandIcon name="apple" size={16} /> macos</a></li>
				<li><a class="icon-text" href="/#download"><BrandIcon name="windows" size={15} /> windows</a></li>
			</ul>
		</div>

		<div class="device">
			<div class="glow" aria-hidden="true"></div>
			<AppWindow>
				<HomeScreen />
			</AppWindow>
		</div>
	</div>
</section>

<style>
	.hero {
		position: relative;
		overflow: hidden;
		margin-top: calc(var(--header-h) * -1);
		padding: calc(var(--header-h) + 72px) 0 96px;
	}

	/*
	 * Character on the right (Neon Magenta Pilot Portrait).
	 * Aligned to baseline (Flowing Magenta Anime Hairline Portrait):
	 * k = 1.832, ox = -2426 px, oy = 103 px.
	 * Pn = 4829 px, Wn = 4096 px.
	 *
	 * height = 97.35% * 4829 / (2580 * 1.832) = 99.46%
	 * top = 2.11% - 97.35% * 103 / (2580 * 1.832) = 0.00%
	 * translateX = (4096 - (-2426) - 0.7115 * 4096 * 1.832) / 4096 * 100% = 28.87%
	 */
	.art {
		position: absolute;
		top: 0%;
		right: max(-60px, calc((100vw - var(--container)) / 2 - 160px));
		height: 99.46%;
		width: auto;
		max-width: none;
		transform: translateX(28.87%);
		opacity: 0.55;
		pointer-events: none;
		user-select: none;
	}

	/* Above the fold: animate with CSS so it never waits for hydration. */
	.copy,
	.device {
		animation: rise 800ms var(--ease) both;
	}

	.device {
		animation-delay: 120ms;
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.copy,
		.device {
			animation: none;
		}
	}

	.stack {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.copy {
		position: relative;
		z-index: 1;
		max-width: 720px;
	}



	h1 {
		font-size: clamp(42px, 5.4vw, 72px);
		font-weight: 600;
		line-height: 1.02;
		letter-spacing: -0.03em;
	}

	.lead {
		max-width: 33em;
		margin: 28px auto 0;
		font-size: 18px;
		line-height: 1.6;
		color: var(--text-muted);
		text-wrap: pretty;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 12px;
		margin-top: 40px;
	}





	.platforms {
		display: flex;
		justify-content: center;
		gap: 28px;
		margin: 48px 0 0;
		padding: 0;
		list-style: none;
	}

	.platforms a {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		font-family: var(--font-mono);
		font-size: 13px;
		color: var(--text-muted);
		transition: color var(--transition-hover);
	}

	.platforms a:hover {
		color: var(--primary);
	}

	.device {
		position: relative;
		width: 100%;
		max-width: 400px;
		margin-top: 72px;
	}

	.glow {
		position: absolute;
		inset: -20% -30%;
		background: radial-gradient(closest-side, rgb(var(--primary-rgb) / 0.12), transparent 70%);
		pointer-events: none;
	}

	.device :global(.window) {
		position: relative;
	}


	@media (max-width: 960px) {
		.art {
			right: -35%;
			opacity: 0.4;
		}

		.device {
			margin-top: 56px;
		}
	}

	@media (max-width: 640px) {
		.hero {
			padding: calc(var(--header-h) + 40px) 0 72px;
		}

		.lead {
			font-size: 16px;
		}

	}
</style>
