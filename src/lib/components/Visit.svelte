<script>
	import Window from './Window.svelte';

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
			<div class="visit__win visit__win--hours">
				<Window title={besuch.hours_heading || 'Öffnungszeiten'}>
					<ul class="hours">
						{#each besuch.hours ?? [] as row}
							<li>
								<span>{row.days}</span>
								<strong>{row.time}</strong>
							</li>
						{/each}
					</ul>
					{#if besuch.hours_note}
						<p class="note">{besuch.hours_note}</p>
					{/if}
				</Window>
			</div>

			<div class="visit__win">
				<Window title={besuch.address_heading || 'Adresse'}>
					<address>
						{#each besuch.address ?? [] as line}
							<span>{line}</span>
						{/each}
					</address>
					{#if besuch.transport}
						<p class="note">{besuch.transport}</p>
					{/if}
					{#if besuch.map_url}
						<a class="btn" href={besuch.map_url} target="_blank" rel="noopener noreferrer">
							{besuch.map_label || 'Karte öffnen'}
							<span aria-hidden="true">↗</span>
						</a>
					{/if}
				</Window>
			</div>

			<div class="visit__win">
				<Window title={besuch.contact_heading || 'Kontakt'}>
					{#if besuch.email}
						<a class="visit__mail" href={`mailto:${besuch.email}`}>{besuch.email}</a>
					{/if}
					{#if besuch.email_note}
						<p class="note">{besuch.email_note}</p>
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
				</Window>
			</div>
		</div>
	</div>
</section>

<style>
	.visit__grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
		align-items: start;
	}

	.visit__win--hours {
		margin-top: 0.75rem;
	}

	.hours {
		display: grid;
		gap: 0.7rem;
	}

	.hours li {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding-bottom: 0.65rem;
		border-bottom: 1px dashed rgba(22, 37, 27, 0.35);
		font-size: 0.92rem;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.hours li:last-child {
		border-bottom: 0;
		padding-bottom: 0;
	}

	.hours strong {
		font-family: var(--font-display);
		font-weight: 700;
		letter-spacing: 0.04em;
	}

	address {
		font-style: normal;
		display: grid;
		gap: 0.2rem;
		font-size: 0.98rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		margin-bottom: 0.85rem;
	}

	.note {
		margin: 0.85rem 0 0;
		color: var(--ink-soft);
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		line-height: 1.4;
	}

	.visit__mail {
		display: inline-block;
		font-family: var(--font-display);
		font-size: clamp(1.1rem, 0.95rem + 0.6vw, 1.45rem);
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		text-decoration: none;
		word-break: break-word;
		margin-bottom: 0.5rem;
	}

	.visit__mail:hover {
		text-decoration: underline;
	}

	.visit :global(.btn) {
		margin-top: 1rem;
	}

	.visit__socials {
		display: grid;
		gap: 0;
		margin-top: 1rem;
		border: var(--stroke) solid var(--ink);
	}

	.visit__socials a {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.55rem 0.7rem;
		border-bottom: var(--stroke) solid var(--ink);
		text-decoration: none;
		font-family: var(--font-display);
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		transition: background-color 0.15s ease, color 0.15s ease;
	}

	.visit__socials li:last-child a {
		border-bottom: 0;
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

		.visit__win--hours {
			margin-top: 0;
		}
	}
</style>
