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
	<title>hikkari · vpn, о котором забываешь</title>
	<meta
		name="description"
		content="vpn-клиент для macos и windows: сам переходит на рабочий протокол и сервер, российские сайты и игры пускает напрямую. бесплатный, принимает любые подписки"
	/>
	<link rel="canonical" href="https://hikkari.net/" />
	<meta property="og:title" content="hikkari · vpn, о котором забываешь" />
	<meta
		property="og:description"
		content="сам переходит на рабочий протокол и сервер, российские сайты и игры пускает напрямую. бесплатный клиент для macos и windows"
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://hikkari.net/" />
	<meta property="og:site_name" content="hikkari" />
	<meta property="og:locale" content="ru_RU" />
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
