<script>
	import Logo from './Logo.svelte';

	let { site = {}, besuch = {}, footer = {} } = $props();

	const year = new Date().getFullYear();
</script>

<footer class="footer">
	<div class="wrap footer__grid">
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

	<div class="wrap footer__bar">
		<p>© {year} {site.title} {site.subtitle}</p>
		<nav aria-label="Rechtliches">
			{#each footer.legal_links ?? [] as link}
				<a href={link.url}>{link.label}</a>
			{/each}
			<a href="/admin/">CMS</a>
		</nav>
		<p>{footer.credit}</p>
	</div>
</footer>

<style>
	.footer {
		margin-top: clamp(3rem, 8vw, 6rem);
		padding: clamp(2.5rem, 6vw, 4.5rem) 0 1.5rem;
		background: var(--ink);
		color: var(--cream);
	}

	.footer a {
		color: var(--cream);
		text-decoration: none;
	}

	.footer a:hover {
		text-decoration: underline;
	}

	.footer h2 {
		font-size: 1.15rem;
		margin-bottom: 0.9rem;
		color: var(--green);
	}

	.footer__grid {
		display: grid;
		grid-template-columns: 1.2fr repeat(3, minmax(0, 1fr));
		gap: clamp(1.5rem, 4vw, 3rem);
		padding-bottom: 2.5rem;
	}

	.footer__logo {
		display: block;
		width: 4.5rem;
		color: var(--cream);
		margin-bottom: 1rem;
	}

	.footer__name {
		font-family: var(--font-display);
		font-size: 1.4rem;
		margin-bottom: 0.4rem;
	}

	.footer__brand p:last-child {
		max-width: 28ch;
		color: rgba(251, 246, 234, 0.72);
	}

	.hours,
	.footer__socials,
	.footer__media {
		display: grid;
		gap: 0.45rem;
	}

	.hours li,
	.footer__socials a {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		font-size: 0.92rem;
	}

	.footer__socials span,
	.hours li span {
		color: rgba(251, 246, 234, 0.62);
	}

	.footer__address {
		display: grid;
		margin: 1rem 0 0.6rem;
		font-size: 0.95rem;
	}

	.footer__bar {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 1.5rem;
		justify-content: space-between;
		padding-top: 1.25rem;
		border-top: 1px solid rgba(251, 246, 234, 0.12);
		font-size: 0.82rem;
		color: rgba(251, 246, 234, 0.62);
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
