<script>
	let { besuch = {}, socials = [] } = $props();
</script>

<section class="section visit" id="besuch">
	<div class="wrap">
		<header class="section__head">
			<p class="eyebrow">Info</p>
			<h2 class="section__title">{besuch.heading}</h2>
			{#if besuch.intro}
				<p class="section__intro">{besuch.intro}</p>
			{/if}
		</header>

		<div class="visit__grid">
			<article class="card card--hours">
				<h3>{besuch.hours_heading}</h3>
				<ul class="hours">
					{#each besuch.hours ?? [] as row}
						<li>
							<span>{row.days}</span>
							<strong>{row.time}</strong>
						</li>
					{/each}
				</ul>
				{#if besuch.hours_note}
					<p class="card__note">{besuch.hours_note}</p>
				{/if}
			</article>

			<article class="card">
				<h3>{besuch.address_heading}</h3>
				<address>
					{#each besuch.address ?? [] as line}
						<span>{line}</span>
					{/each}
				</address>
				{#if besuch.transport}
					<p class="card__note">{besuch.transport}</p>
				{/if}
				{#if besuch.map_url}
					<a class="btn" href={besuch.map_url} target="_blank" rel="noopener noreferrer">
						{besuch.map_label || 'Karte öffnen'}
						<span aria-hidden="true">↗</span>
					</a>
				{/if}
			</article>

			<article class="card">
				<h3>{besuch.contact_heading}</h3>
				{#if besuch.email}
					<a class="visit__mail" href={`mailto:${besuch.email}`}>{besuch.email}</a>
				{/if}
				{#if besuch.email_note}
					<p class="card__note">{besuch.email_note}</p>
				{/if}

				{#if socials.length}
					<ul class="visit__socials">
						{#each socials as item}
							<li>
								<a href={item.url} target="_blank" rel="noopener noreferrer">
									{item.platform}
									<span>{item.handle}</span>
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</article>
		</div>
	</div>
</section>

<style>
	.visit__grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1.25rem;
	}

	.card {
		background: var(--cream-warm);
		border-radius: var(--radius);
		padding: clamp(1.4rem, 2.5vw, 2rem);
		display: flex;
		flex-direction: column;
		gap: 1rem;
		min-height: 100%;
	}

	.card--hours {
		background: var(--green);
		rotate: -0.6deg;
	}

	.card h3 {
		font-size: clamp(1.5rem, 1.2rem + 1vw, 2rem);
	}

	.hours {
		display: grid;
		gap: 0.85rem;
	}

	.hours li {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px dashed rgba(22, 37, 27, 0.28);
		font-size: 0.98rem;
	}

	.hours li:last-child {
		border-bottom: 0;
		padding-bottom: 0;
	}

	address {
		font-style: normal;
		display: grid;
		gap: 0.15rem;
		font-size: 1.05rem;
	}

	.card__note {
		margin: 0;
		color: var(--ink-soft);
		font-size: 0.92rem;
	}

	.visit__mail {
		font-family: var(--font-display);
		font-size: clamp(1.2rem, 1rem + 0.8vw, 1.6rem);
		text-decoration: none;
		word-break: break-word;
	}

	.visit__mail:hover {
		text-decoration: underline;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		align-self: start;
		margin-top: auto;
		padding: 0.55rem 1.1rem;
		border-radius: 999px;
		background: var(--ink);
		color: var(--cream);
		font-size: 0.9rem;
		font-weight: 600;
		text-decoration: none;
	}

	.btn:hover {
		background: var(--green-deep);
	}

	.visit__socials {
		display: grid;
		gap: 0.45rem;
		margin-top: auto;
	}

	.visit__socials a {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.55rem 0.7rem;
		border-radius: 0.9rem;
		background: rgba(22, 37, 27, 0.06);
		text-decoration: none;
		font-weight: 600;
		font-size: 0.92rem;
	}

	.visit__socials a span {
		font-weight: 500;
		color: var(--ink-soft);
	}

	.visit__socials a:hover {
		background: var(--ink);
		color: var(--cream);
	}

	.visit__socials a:hover span {
		color: var(--cream);
	}

	@media (max-width: 900px) {
		.visit__grid {
			grid-template-columns: 1fr;
		}

		.card--hours {
			rotate: 0;
		}
	}
</style>
