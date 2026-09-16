<script>
	let { newsletter = {} } = $props();
</script>

<section class="section newsletter" id="newsletter">
	<div class="wrap newsletter__box">
		<p class="eyebrow">Bleib dran</p>
		<h2 class="section__title">{newsletter.heading}</h2>
		{#if newsletter.body}
			<div class="newsletter__copy rich">{@html newsletter.body}</div>
		{/if}
		{#if newsletter.email}
			<a class="newsletter__btn" href={`mailto:${newsletter.email}?subject=Newsletter`}>
				{newsletter.button_label || 'Newsletter abonnieren'}
			</a>
		{/if}
	</div>
</section>

<style>
	.newsletter {
		padding-block: 0 0;
	}

	.newsletter__box {
		background: var(--green);
		border-radius: calc(var(--radius) + 0.4rem);
		padding: clamp(2rem, 6vw, 4.5rem);
		display: grid;
		justify-items: start;
		gap: 1rem;
	}

	.newsletter .eyebrow {
		color: var(--ink);
	}

	.newsletter__copy {
		max-width: 46ch;
		font-size: 1.08rem;
	}

	.newsletter__btn {
		display: inline-flex;
		margin-top: 0.5rem;
		padding: 0.8rem 1.4rem;
		border-radius: 999px;
		background: var(--ink);
		color: var(--cream);
		font-weight: 700;
		text-decoration: none;
	}

	.newsletter__btn:hover {
		background: var(--green-deep);
	}
</style>
