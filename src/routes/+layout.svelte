<script>
	import '../app.css';

	let { children } = $props();

	$effect(() => {
		const identity = window.netlifyIdentity;
		if (!identity) return;
		identity.on('init', (user) => {
			if (!user) {
				identity.on('login', () => {
					document.location.href = '/admin/';
				});
			}
		});
	});
</script>

<svelte:head>
	<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
</svelte:head>

<a class="skip-link" href="#inhalt">Zum Inhalt springen</a>

{@render children()}
