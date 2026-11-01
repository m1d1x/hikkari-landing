<script lang="ts">
	import { reveal } from '#lib/actions/reveal.ts';
	import EngineDemo from '#lib/demos/EngineDemo.svelte';
	import FeaturePoint from '#lib/ui/FeaturePoint.svelte';
	import SectionHead from '#lib/ui/SectionHead.svelte';
</script>

<section class="section" id="engine">
	<div class="container section-grid">
		<div>
			<SectionHead index="01" eyebrow="движок протоколов">
				{#snippet title()}чинит себя сам{/snippet}
				{#snippet lead()}протокол перестал работать? hikkari бесшовно переключит соединение на рабочий{/snippet}
			</SectionHead>
			<div class="points" data-reveal use:reveal={80}>
				<FeaturePoint icon="swap" title="бесшовное переключение" />
				<FeaturePoint icon="layers" title="поддержка всех протоколов" />
				<FeaturePoint icon="eye" title="раннее обнаружение сбоев" />
			</div>
		</div>

		<div data-reveal use:reveal={120}>
			<EngineDemo />
		</div>
	</div>
</section>
