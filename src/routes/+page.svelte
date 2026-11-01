<script lang="ts">
	import DownloadSection from '#lib/sections/DownloadSection.svelte';
	import EngineSection from '#lib/sections/EngineSection.svelte';
	import FaqSection from '#lib/sections/FaqSection.svelte';
	import Footer from '#lib/sections/Footer.svelte';
	import Header from '#lib/sections/Header.svelte';
	import Hero from '#lib/sections/Hero.svelte';
	import ImportSection from '#lib/sections/ImportSection.svelte';
	import PricingSection from '#lib/sections/PricingSection.svelte';
	import RelaySection from '#lib/sections/RelaySection.svelte';
	import RoutingSection from '#lib/sections/RoutingSection.svelte';
</script>

<svelte:head>
	<title>hikkari - vpn, о котором забываешь</title>
	<meta
		name="description"
		content="vpn-клиент для macos и windows: если протокол или сервер перестал работать, hikkari бесшовно переключит на рабочий. гибкая маршрутизация: российские сайты работают с включённым vpn, в играх нет лишнего пинга."
	/>
	<meta property="og:title" content="hikkari - vpn, о котором забываешь" />
	<meta
		property="og:description"
		content="движок протоколов, полная маршрутизация, автовыбор сервера и любые подписки в одном клиенте."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

<Header />
<main>
	<Hero />
	<EngineSection />
	<RoutingSection />
	<RelaySection />
	<ImportSection />
	<PricingSection />
	<DownloadSection />
	<FaqSection />
</main>
<Footer />
