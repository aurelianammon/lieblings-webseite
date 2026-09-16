<script>
	import Nav from '$lib/components/Nav.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Visit from '$lib/components/Visit.svelte';
	import Events from '$lib/components/Events.svelte';
	import Verein from '$lib/components/Verein.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import Newsletter from '$lib/components/Newsletter.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { data } = $props();

	const sections = [
		{ id: 'besuch', label: 'Besuch' },
		{ id: 'events', label: 'Events' },
		{ id: 'verein', label: 'Verein' },
		{ id: 'eindruecke', label: 'Eindrücke' },
		{ id: 'newsletter', label: 'Newsletter' }
	];
</script>

<svelte:head>
	<title>{data.site.title} {data.site.subtitle}</title>
	<meta name="description" content={data.site.description} />
	<meta property="og:title" content={`${data.site.title} ${data.site.subtitle}`} />
	<meta property="og:description" content={data.site.description} />
	<meta property="og:type" content="website" />
	<link rel="canonical" href="https://lieblings.be/" />
</svelte:head>

<Nav sections={sections} title={data.site.title} />
<Hero site={data.site} statusNote={data.site.status_note} />
<main id="inhalt">
	<Visit besuch={data.besuch} socials={data.footer.socials} />
	<Events meta={data.eventsMeta} events={data.events} />
	<Verein verein={data.verein} />
	<Gallery eindruecke={data.eindruecke} />
	<Newsletter newsletter={data.newsletter} />
</main>
<Footer site={data.site} besuch={data.besuch} footer={data.footer} />
