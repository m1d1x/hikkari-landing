<script lang="ts">
	import { reveal } from '#lib/actions/reveal.ts';
	import ImportDemo from '#lib/demos/ImportDemo.svelte';
	import FeaturePoint from '#lib/ui/FeaturePoint.svelte';
	import SectionHead from '#lib/ui/SectionHead.svelte';

</script>

<section class="section" id="import">
	<div class="container">
		<div class="section-grid">
			<div>
				<SectionHead index="04" eyebrow="импорт">
					{#snippet title()}один клиент для&nbsp;всего{/snippet}
					{#snippet lead()}неважно, чья у вас подписка: <a href="#pricing">наша</a>, чужая или свой сервер. всё работает в одном клиенте{/snippet}
				</SectionHead>
				<div class="points" data-reveal use:reveal={80}>
					<FeaturePoint icon="link" title="поддержка любого формата" />
					<FeaturePoint icon="refresh" title="контроль трафика и сроков" />
					<FeaturePoint icon="infinity" title="бесплатный навсегда" />
				</div>
			</div>

			<div class="demo" data-reveal use:reveal={120}>
				<ImportDemo />
			</div>
		</div>
	</div>
</section>

<style>
	.demo {
		width: 100%;
		max-width: 560px;
		justify-self: center;
	}
</style>
