<script>
	let { verein = {} } = $props();
</script>

<section class="section verein" id="verein">
	<div class="wrap verein__layout">
		<header class="section__head">
			<p class="eyebrow">Über uns</p>
			<h2 class="section__title">{verein.heading}</h2>
			{#if verein.lead}
				<p class="section__intro">{verein.lead}</p>
			{/if}
		</header>

		{#if verein.body}
			<div class="verein__copy rich">{@html verein.body}</div>
		{/if}

		{#if verein.facts?.length}
			<ul class="facts">
				{#each verein.facts as fact}
					<li>
						<strong>{fact.value}</strong>
						<span>{fact.label}</span>
					</li>
				{/each}
			</ul>
		{/if}

		{#if verein.join_heading}
			<aside class="join">
				<div>
					<h3>{verein.join_heading}</h3>
					<p>{verein.join_text}</p>
				</div>
				{#if verein.join_email}
					<a class="join__btn" href={`mailto:${verein.join_email}`}>
						{verein.join_label || 'Schreib uns'}
					</a>
				{/if}
			</aside>
		{/if}
	</div>
</section>

<style>
	.verein__layout {
		display: grid;
		gap: clamp(1.5rem, 4vw, 2.75rem);
	}

	.verein .section__head {
		margin-bottom: 0;
		max-width: 38ch;
	}

	.verein__copy {
		max-width: 62ch;
		font-size: 1.08rem;
		color: var(--ink-soft);
	}

	.facts {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}

	.facts li {
		background: var(--green);
		border-radius: var(--radius);
		padding: 1.4rem 1.2rem;
		display: grid;
		gap: 0.35rem;
	}

	.facts li:nth-child(2) {
		rotate: -1.4deg;
		background: var(--cream-warm);
	}

	.facts li:nth-child(3) {
		rotate: 1deg;
	}

	.facts strong {
		font-family: var(--font-display);
		font-size: clamp(2rem, 1.4rem + 2vw, 3rem);
		line-height: 1;
	}

	.facts span {
		font-size: 0.95rem;
		color: var(--ink-soft);
	}

	.join {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1.25rem;
		padding: clamp(1.4rem, 3vw, 2rem);
		border-radius: var(--radius);
		background: var(--ink);
		color: var(--cream);
	}

	.join h3 {
		font-size: clamp(1.6rem, 1.2rem + 1.2vw, 2.2rem);
		margin-bottom: 0.4rem;
	}

	.join p {
		margin: 0;
		max-width: 48ch;
		color: rgba(251, 246, 234, 0.78);
	}

	.join__btn {
		display: inline-flex;
		padding: 0.75rem 1.3rem;
		border-radius: 999px;
		background: var(--green);
		color: var(--ink);
		font-weight: 700;
		text-decoration: none;
	}

	.join__btn:hover {
		background: var(--cream);
	}

	@media (max-width: 780px) {
		.facts {
			grid-template-columns: 1fr;
		}

		.facts li:nth-child(2),
		.facts li:nth-child(3) {
			rotate: 0;
		}
	}
</style>
