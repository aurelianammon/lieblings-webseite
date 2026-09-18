<script>
	import Logo from './Logo.svelte';

	let { site = {} } = $props();

	const title = site.title ? `${site.title} ${site.subtitle ?? ''}`.trim() : 'Lieblings Café Bar';
</script>

<div class="logo-panel">
	<Logo class="logo-panel__mark" {title} />
</div>

<style>
	.logo-panel {
		display: grid;
		place-items: center;
		height: 100%;
		color: #000;
		padding: 0.5rem;
	}

	.logo-panel :global(.logo-panel__mark) {
		width: min(100%, 320px);
		height: auto;
	}
</style>
