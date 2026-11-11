<script lang="ts">
	import { reveal } from '#lib/actions/reveal.ts';
	import RelayDemo from '#lib/demos/RelayDemo.svelte';
	import FeaturePoint from '#lib/ui/FeaturePoint.svelte';
	import SectionHead from '#lib/ui/SectionHead.svelte';
</script>

<section class="section" id="relay">
	<div class="container section-grid">
		<div>
			<SectionHead index="03" eyebrow="автовыбор сервера">
				{#snippet title()}всегда самый быстрый{/snippet}
				{#snippet lead()}не нужно перебирать серверы вручную, когда вечером падает скорость: клиент сам следит за локациями и держит самую быструю{/snippet}
			</SectionHead>
			<div class="points" data-reveal use:reveal={80}>
				<FeaturePoint icon="speed" title="замер пинга и пропускной способности" />
				<FeaturePoint icon="bolt" title="автосмена при просадке скорости" />
				<FeaturePoint icon="tune" title="возможность ручного выбора локации" />
			</div>
		</div>

		<div data-reveal use:reveal={120}>
			<RelayDemo />
		</div>
	</div>
</section>
