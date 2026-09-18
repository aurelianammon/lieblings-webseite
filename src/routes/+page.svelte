<script>
	import Desktop from '$lib/components/Desktop.svelte';
	import Marquee from '$lib/components/Marquee.svelte';

	let { data } = $props();

	const topMarquee = 'Lieblings Café Bar';
	const bottomMarquee = 'In Bern an der Gerechtigkeitsgasse 13';
</script>

<svelte:head>
	<title>{data.site.title} {data.site.subtitle}</title>
	<meta name="description" content={data.site.description} />
	<meta property="og:title" content={`${data.site.title} ${data.site.subtitle}`} />
	<meta property="og:description" content={data.site.description} />
	<meta property="og:type" content="website" />
	<link rel="canonical" href="https://lieblings.be/" />
</svelte:head>

<div class="shell">
	<Marquee text={topMarquee} position="top" />
	<Desktop {data} />
	<Marquee text={bottomMarquee} position="bottom" />
</div>

<style>
	.shell {
		height: 100svh;
		height: 100dvh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
</style>
