<script>
	import Logo from './Logo.svelte';
	import Window from './Window.svelte';

	let { site = {}, besuch = {}, footer = {} } = $props();

	const year = new Date().getFullYear();
</script>

<footer class="footer">
	<div class="wrap">
		<Window title="Footer" chrome="ink" body="flush">
			<div class="footer__grid">
				<div class="footer__brand">
					<a href="#start" class="footer__logo" aria-label={site.title || 'Lieblings'}>
						<Logo title={site.title || 'Lieblings'} />
					</a>
					<p class="footer__name">{site.title} {site.subtitle}</p>
					<p>{footer.tagline}</p>
				</div>

				<div>
					<h2>Besuch</h2>
					<ul class="hours">
						{#each besuch.hours ?? [] as row}
							<li><span>{row.days}</span> {row.time}</li>
						{/each}
					</ul>
					<p class="footer__address">
						{#each besuch.address ?? [] as line}
							<span>{line}</span>
						{/each}
					</p>
					{#if besuch.map_url}
						<a href={besuch.map_url} target="_blank" rel="noopener noreferrer">
							{besuch.map_label || 'Google Maps'}
						</a>
					{/if}
				</div>

				<div>
					<h2>Kontakt</h2>
					{#if besuch.email}
						<a href={`mailto:${besuch.email}`}>{besuch.email}</a>
					{/if}
					<ul class="footer__socials">
						{#each footer.socials ?? [] as item}
							<li>
								<a href={item.url} target="_blank" rel="noopener noreferrer">
									{item.platform}
									<span>{item.handle}</span>
								</a>
							</li>
						{/each}
					</ul>
					<a href="#newsletter">Zum Newsletter</a>
				</div>

				<div>
					<h2>{footer.media_heading || 'Medien'}</h2>
					{#if footer.media_note}
						<p>{footer.media_note}</p>
					{/if}
					<ul class="footer__media">
						{#each footer.media ?? [] as item}
							<li>
								<a href={item.url} download>{item.label}</a>
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<div class="footer__bar">
				<p>© {year} {site.title} {site.subtitle}</p>
				<nav aria-label="Rechtliches">
					{#each footer.legal_links ?? [] as link}
						<a href={link.url}>{link.label}</a>
					{/each}
					<a href="/admin/">CMS</a>
				</nav>
				<p>{footer.credit}</p>
			</div>
		</Window>
	</div>
</footer>

<style>
	.footer {
		margin-top: clamp(1.5rem, 4vw, 3rem);
		padding: 0 0 calc(var(--marquee-h) + 1.25rem);
	}

	.footer a {
		color: var(--ink);
		text-decoration: none;
	}

	.footer a:hover {
		text-decoration: underline;
	}

	.footer h2 {
		font-size: 0.95rem;
		margin-bottom: 0.85rem;
		color: var(--green-deep);
	}

	.footer__grid {
		display: grid;
		grid-template-columns: 1.2fr repeat(3, minmax(0, 1fr));
		gap: clamp(1.25rem, 3vw, 2.25rem);
		padding: clamp(1.25rem, 3vw, 2rem);
		background: var(--cream);
	}

	.footer__logo {
		display: block;
		width: 3.75rem;
		color: var(--ink);
		margin-bottom: 0.85rem;
	}

	.footer__name {
		font-family: var(--font-display);
		font-size: 1.2rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		margin-bottom: 0.4rem;
	}

	.footer__brand p:last-child {
		max-width: 28ch;
		color: var(--ink-soft);
		font-size: 0.88rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		line-height: 1.4;
	}

	.hours,
	.footer__socials,
	.footer__media {
		display: grid;
		gap: 0.4rem;
	}

	.hours li,
	.footer__socials a {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		font-size: 0.82rem;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.footer__socials span,
	.hours li span {
		color: var(--ink-soft);
	}

	.footer__address {
		display: grid;
		margin: 0.9rem 0 0.55rem;
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.footer__bar {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 1.5rem;
		justify-content: space-between;
		padding: 0.85rem clamp(1.25rem, 3vw, 2rem);
		border-top: var(--stroke) solid var(--ink);
		background: var(--cream-warm);
		font-family: var(--font-display);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	.footer__bar nav {
		display: flex;
		gap: 1rem;
	}

	.footer__bar p {
		margin: 0;
	}

	@media (max-width: 900px) {
		.footer__grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 640px) {
		.footer__grid {
			grid-template-columns: 1fr;
		}
	}
</style>
