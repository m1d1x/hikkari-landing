<script lang="ts">
	import { reveal } from '#lib/actions/reveal.ts';
	import RoutingDemo from '#lib/demos/RoutingDemo.svelte';
	import FeaturePoint from '#lib/ui/FeaturePoint.svelte';
	import SectionHead from '#lib/ui/SectionHead.svelte';
</script>

<section class="section" id="routing">
	<div class="container section-grid">
		<div>
			<SectionHead index="02" eyebrow="маршрутизация">
				{#snippet title()}гибкая настройка{/snippet}
				{#snippet lead()}выбирайте, какие сайты и приложения идут через vpn, а какие напрямую{/snippet}
			</SectionHead>
			<div class="points" data-reveal use:reveal={80}>
				<FeaturePoint icon="tune" title="домены, приложения и ip подсети" />
				<FeaturePoint icon="apps" title="готовые пресеты сервисов" />
				<FeaturePoint icon="bolt" title="применение в реальном времени" />
			</div>
		</div>

		<div class="demo" data-reveal use:reveal={120}>
			<RoutingDemo />
		</div>
	</div>
</section>

<style>
	.demo {
		width: 100%;
		max-width: 480px;
		justify-self: center;
	}
</style>
