<script>
	import Window from './Window.svelte';

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
			<Window title="Der Verein">
				<div class="verein__copy rich">{@html verein.body}</div>
			</Window>
		{/if}

		{#if verein.facts?.length}
			<ul class="facts">
				{#each verein.facts as fact, i}
					<li class:facts__offset={i === 1}>
						<Window title={fact.label} body={i === 1 ? 'warm' : 'green'}>
							<strong>{fact.value}</strong>
						</Window>
					</li>
				{/each}
			</ul>
		{/if}

		{#if verein.join_heading}
			<Window title="Mitmachen" chrome="ink" body="warm">
				<aside class="join">
					<div>
						<h3>{verein.join_heading}</h3>
						<p>{verein.join_text}</p>
					</div>
					{#if verein.join_email}
						<a class="btn" href={`mailto:${verein.join_email}`}>
							{verein.join_label || 'Schreib uns'}
						</a>
					{/if}
				</aside>
			</Window>
		{/if}
	</div>
</section>

<style>
	.verein__layout {
		display: grid;
		gap: clamp(1.25rem, 3vw, 2rem);
	}

	.verein .section__head {
		margin-bottom: 0;
		max-width: 40ch;
	}

	.verein__copy {
		max-width: 62ch;
		font-size: 1rem;
		color: var(--ink-soft);
	}

	.facts {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}

	.facts__offset {
		margin-top: 0.6rem;
	}

	.facts strong {
		font-family: var(--font-display);
		font-size: clamp(1.85rem, 1.3rem + 1.8vw, 2.75rem);
		line-height: 1;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.join {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1.25rem;
	}

	.join h3 {
		font-size: clamp(1.35rem, 1.1rem + 1vw, 1.85rem);
		margin-bottom: 0.45rem;
	}

	.join p {
		margin: 0;
		max-width: 48ch;
		color: var(--ink-soft);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		font-size: 0.9rem;
		line-height: 1.45;
	}

	@media (max-width: 780px) {
		.facts {
			grid-template-columns: 1fr;
		}

		.facts__offset {
			margin-top: 0;
		}
	}
</style>
