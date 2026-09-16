<script>
	let { status = 404, error } = $props();
</script>

<section class="section">
	<div class="wrap">
		<p class="eyebrow">Hoppla</p>
		<h1 class="section__title">{status}</h1>
		<p class="section__intro">{error?.message ?? 'Diese Seite gibt es nicht.'}</p>
		<a href="/">Zurück zum Lieblings</a>
	</div>
</section>
