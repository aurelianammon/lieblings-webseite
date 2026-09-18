<script>
	let { status = 404, error } = $props();
</script>

<section class="error-page">
	<div class="error">
		<p class="error__eyebrow">Hoppla</p>
		<h1>{status}</h1>
		<p>{error?.message ?? 'Diese Seite gibt es nicht.'}</p>
		<a class="btn" href="/">Zurück zum Lieblings</a>
	</div>
</section>

<style>
	.error-page {
		min-height: 100svh;
		display: grid;
		place-items: center;
		padding: 2rem;
	}

	.error {
		padding: 1.5rem;
		border: var(--stroke) solid var(--accent);
		background: var(--cream);
		display: grid;
		gap: 0.75rem;
		justify-items: start;
		max-width: 28rem;
	}

	.error__eyebrow {
		margin: 0;
		font-family: var(--font-display);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--accent-soft);
	}

	.error h1 {
		font-size: 4rem;
	}

	.error p {
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--accent-soft);
	}
</style>
