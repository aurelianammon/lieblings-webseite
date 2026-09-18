<script>
	import Window from './Window.svelte';
	import LogoPanel from './LogoPanel.svelte';
	import EventCard from './EventCard.svelte';
	import DockIcon from './DockIcon.svelte';
	import { isUpcoming } from '$lib/date.js';

	let { data } = $props();

	const apps = [
		{ id: 'logo', label: 'Logo', title: 'Das Logo', width: 420, height: 440 },
		{ id: 'hours', label: 'Zeiten', title: 'Öffnungszeiten', width: 340, height: 300 },
		{ id: 'address', label: 'Adresse', title: 'Adresse', width: 340, height: 260 },
		{ id: 'contact', label: 'Kontakt', title: 'Kontakt', width: 340, height: 280 },
		{ id: 'events', label: 'Programm', title: 'Programm', width: 460, height: 500 },
		{ id: 'verein', label: 'Verein', title: 'Verein', width: 420, height: 440 },
		{ id: 'gallery', label: 'Eindrücke', title: 'Eindrücke', width: 420, height: 460, flush: true },
		{ id: 'newsletter', label: 'Newsletter', title: 'Newsletter', width: 360, height: 260 }
	];

	let zTop = $state(20);
	let deskEl = $state(null);

	let windows = $state(
		Object.fromEntries(
			apps.map((app) => [
				app.id,
				{
					open: false,
					x: 0,
					y: 0,
					z: 1,
					width: app.width,
					height: app.height
				}
			])
		)
	);

	const upcoming = $derived(data.events.filter((event) => isUpcoming(event.date)));
	const past = $derived(
		data.events.filter((event) => !isUpcoming(event.date)).slice().reverse()
	);

	const galleryImages = $derived(data.eindruecke.images ?? []);
	let galleryIndex = $state(0);
	const galleryCurrent = $derived(
		galleryImages.length ? galleryImages[galleryIndex % galleryImages.length] : null
	);

	function randomPos(width, height) {
		if (!deskEl) return { x: 48, y: 36 };
		const dockReserve = 64;
		const pad = 16;
		const maxX = Math.max(pad, deskEl.clientWidth - width - dockReserve);
		const maxY = Math.max(pad, deskEl.clientHeight - height - pad);
		return {
			x: Math.round(pad + Math.random() * (maxX - pad)),
			y: Math.round(pad + Math.random() * (maxY - pad))
		};
	}

	function focusWindow(id) {
		zTop += 1;
		windows[id].z = zTop;
	}

	function openWindow(id) {
		const win = windows[id];
		if (!win.open) {
			const pos = randomPos(win.width, win.height);
			win.x = pos.x;
			win.y = pos.y;
			win.open = true;
		}
		focusWindow(id);
	}

	function closeWindow(id) {
		windows[id].open = false;
	}

	function toggleWindow(id) {
		if (windows[id].open) {
			focusWindow(id);
		} else {
			openWindow(id);
		}
	}

	function moveWindow(id, { x, y }) {
		windows[id].x = x;
		windows[id].y = y;
	}

	function stepGallery(delta) {
		if (!galleryImages.length) return;
		galleryIndex = (galleryIndex + delta + galleryImages.length) % galleryImages.length;
	}

	let logoPlaced = $state(false);
	$effect(() => {
		if (!deskEl || logoPlaced) return;
		logoPlaced = true;
		const pos = randomPos(windows.logo.width, windows.logo.height);
		zTop += 1;
		windows.logo.x = pos.x;
		windows.logo.y = pos.y;
		windows.logo.z = zTop;
		windows.logo.open = true;
	});
</script>

<div class="desktop" bind:this={deskEl} id="inhalt">
	{#each apps as app (app.id)}
		{#if windows[app.id].open}
			<Window
				id={app.id}
				title={app.title}
				x={windows[app.id].x}
				y={windows[app.id].y}
				z={windows[app.id].z}
				width={windows[app.id].width}
				height={windows[app.id].height}
				flush={app.flush ?? false}
				onFocus={() => focusWindow(app.id)}
				onClose={() => closeWindow(app.id)}
				onMove={(pos) => moveWindow(app.id, pos)}
			>
				{#if app.id === 'logo'}
					<LogoPanel site={data.site} />
				{:else if app.id === 'hours'}
					<ul class="hours">
						{#each data.besuch.hours ?? [] as row}
							<li>
								<span>{row.days}</span>
								<strong>{row.time}</strong>
							</li>
						{/each}
					</ul>
					{#if data.besuch.hours_note}
						<p class="note">{data.besuch.hours_note}</p>
					{/if}
				{:else if app.id === 'address'}
					<address class="address">
						{#each data.besuch.address ?? [] as line}
							<span>{line}</span>
						{/each}
					</address>
					{#if data.besuch.transport}
						<p class="note">{data.besuch.transport}</p>
					{/if}
					{#if data.besuch.map_url}
						<a class="btn" href={data.besuch.map_url} target="_blank" rel="noopener noreferrer">
							{data.besuch.map_label || 'Karte öffnen'}
							<span aria-hidden="true">↗</span>
						</a>
					{/if}
				{:else if app.id === 'contact'}
					{#if data.besuch.email}
						<a class="mail" href={`mailto:${data.besuch.email}`}>{data.besuch.email}</a>
					{/if}
					{#if data.besuch.email_note}
						<p class="note">{data.besuch.email_note}</p>
					{/if}
					{#if data.footer.socials?.length}
						<ul class="socials">
							{#each data.footer.socials as item}
								<li>
									<a href={item.url} target="_blank" rel="noopener noreferrer">
										{item.platform}
										<span>{item.handle}</span>
									</a>
								</li>
							{/each}
						</ul>
					{/if}
				{:else if app.id === 'events'}
					{#if data.eventsMeta.intro}
						<p class="lead">{data.eventsMeta.intro}</p>
					{/if}
					{#if upcoming.length}
						<ul class="events">
							{#each upcoming as event (event.slug)}
								<li><EventCard {event} /></li>
							{/each}
						</ul>
					{:else}
						<p class="note">{data.eventsMeta.empty_text}</p>
					{/if}
					{#if past.length}
						<details class="past">
							<summary>{data.eventsMeta.past_label || 'Vergangene Events'}</summary>
							<ul class="events">
								{#each past as event (event.slug)}
									<li><EventCard {event} past /></li>
								{/each}
							</ul>
						</details>
					{/if}
				{:else if app.id === 'verein'}
					{#if data.verein.lead}
						<p class="lead">{data.verein.lead}</p>
					{/if}
					{#if data.verein.body}
						<div class="rich copy">{@html data.verein.body}</div>
					{/if}
					{#if data.verein.facts?.length}
						<ul class="facts">
							{#each data.verein.facts as fact}
								<li>
									<strong>{fact.value}</strong>
									<span>{fact.label}</span>
								</li>
							{/each}
						</ul>
					{/if}
					{#if data.verein.join_heading}
						<div class="join">
							<h3>{data.verein.join_heading}</h3>
							<p>{data.verein.join_text}</p>
							{#if data.verein.join_email}
								<a class="btn" href={`mailto:${data.verein.join_email}`}>
									{data.verein.join_label || 'Schreib uns'}
								</a>
							{/if}
						</div>
					{/if}
				{:else if app.id === 'gallery'}
					{#if galleryCurrent}
						<div class="gallery">
							<img
								class="gallery__img"
								src={galleryCurrent.src}
								alt={galleryCurrent.alt || galleryCurrent.caption || ''}
							/>
							<div class="gallery__nav">
								<button type="button" aria-label="Vorheriges Bild" onclick={() => stepGallery(-1)}>
									<svg viewBox="0 0 24 24" aria-hidden="true"
										><path d="M15 4 L7 12 L15 20" /></svg
									>
								</button>
								<span>
									{galleryCurrent.caption ||
										galleryCurrent.alt ||
										`Bild ${galleryIndex + 1}`}
								</span>
								<button type="button" aria-label="Nächstes Bild" onclick={() => stepGallery(1)}>
									<svg viewBox="0 0 24 24" aria-hidden="true"
										><path d="M9 4 L17 12 L9 20" /></svg
									>
								</button>
							</div>
						</div>
					{:else}
						<p class="note">Noch keine Bilder — im CMS unter Eindrücke hinzufügen.</p>
					{/if}
				{:else if app.id === 'newsletter'}
					{#if data.newsletter.body}
						<div class="rich copy">{@html data.newsletter.body}</div>
					{/if}
					{#if data.newsletter.email}
						<a class="btn" href={`mailto:${data.newsletter.email}?subject=Newsletter`}>
							{data.newsletter.button_label || 'Newsletter abonnieren'}
						</a>
					{/if}
				{/if}
			</Window>
		{/if}
	{/each}

	<aside class="dock" aria-label="Fenster öffnen">
		{#each apps as app (app.id)}
			<button
				type="button"
				class="dock__btn"
				class:is-open={windows[app.id].open}
				aria-label={app.label}
				aria-pressed={windows[app.id].open}
				title={app.label}
				onclick={() => toggleWindow(app.id)}
			>
				<DockIcon name={app.id} />
			</button>
		{/each}
	</aside>
</div>

<style>
	.desktop {
		position: relative;
		flex: 1;
		min-height: 0;
		overflow: hidden;
		background-color: var(--cream);
		background-image:
			linear-gradient(color-mix(in srgb, var(--green) 40%, transparent) 1px, transparent 1px),
			linear-gradient(90deg, color-mix(in srgb, var(--green) 40%, transparent) 1px, transparent 1px);
		background-size: var(--grid-size) var(--grid-size);
	}

	.dock {
		position: absolute;
		top: 50%;
		right: 0.55rem;
		translate: 0 -50%;
		z-index: 10000;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.35rem;
	}

	.dock__btn {
		display: grid;
		place-items: center;
		width: 2.7rem;
		height: 2.7rem;
		padding: 0;
		border: var(--stroke) solid var(--accent);
		border-radius: 50%;
		background: var(--cream);
		color: var(--accent);
		--dock-hole: var(--cream);
		cursor: pointer;
		transition:
			background-color 0.15s ease,
			color 0.15s ease;
	}

	.dock__btn:hover,
	.dock__btn.is-open {
		background: var(--accent);
		color: var(--cream);
		--dock-hole: var(--accent);
	}

	.hours,
	.events,
	.facts,
	.socials {
		display: grid;
		gap: 0.55rem;
	}

	.hours li {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding-bottom: 0.45rem;
		border-bottom: var(--stroke) solid var(--accent-soft);
		font-size: 0.95rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.hours li:last-child {
		border-bottom: 0;
		padding-bottom: 0;
	}

	.hours strong {
		font-family: var(--font-display);
		font-size: 1.1rem;
		font-weight: 400;
		letter-spacing: 0.08em;
	}

	.address {
		font-style: normal;
		display: grid;
		gap: 0.15rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-bottom: 0.85rem;
		font-family: var(--font-display);
		font-size: 1.15rem;
	}

	.note,
	.lead {
		margin: 0.75rem 0 0;
		color: var(--accent-soft);
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		line-height: 1.4;
	}

	.lead {
		margin: 0 0 0.85rem;
	}

	.mail {
		display: inline-block;
		font-family: var(--font-display);
		font-size: 1.45rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		text-decoration: none;
		word-break: break-word;
	}

	.mail:hover {
		text-decoration: underline;
	}

	.socials {
		margin-top: 1rem;
		gap: 0.35rem;
	}

	.socials a {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.25rem 0;
		border-bottom: var(--stroke) solid var(--accent-soft);
		text-decoration: none;
		font-family: var(--font-display);
		font-size: 1rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.socials li:last-child a {
		border-bottom: 0;
	}

	.socials a span {
		color: var(--accent-soft);
	}

	.past {
		margin-top: 1.1rem;
	}

	.past summary {
		cursor: pointer;
		font-family: var(--font-display);
		font-size: 1rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--accent-soft);
		margin-bottom: 0.75rem;
	}

	.copy {
		font-size: 1rem;
		color: var(--accent-soft);
		margin-bottom: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		line-height: 1.45;
	}

	.facts {
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.facts li {
		display: grid;
		gap: 0.2rem;
	}

	.facts strong {
		font-family: var(--font-display);
		font-size: 2rem;
		font-weight: 400;
		line-height: 1;
		letter-spacing: 0.04em;
	}

	.facts span {
		font-family: var(--font-display);
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--accent-soft);
	}

	.join {
		padding-top: 0.75rem;
		border-top: var(--stroke) solid var(--accent-soft);
		display: grid;
		gap: 0.45rem;
		justify-items: start;
	}

	.join h3 {
		font-size: 1.45rem;
	}

	.join p {
		margin: 0;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--accent-soft);
	}

	.gallery {
		position: relative;
		height: 100%;
		min-height: 0;
		background: var(--accent);
	}

	.gallery__img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.gallery__nav {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 0.85rem;
		background: transparent;
		border: 0;
		font-family: var(--font-display);
		font-size: 1.05rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--cream);
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
	}

	.gallery__nav span {
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.gallery__nav button {
		display: grid;
		place-items: center;
		width: 2.1rem;
		height: 2.1rem;
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--cream);
		cursor: pointer;
		filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.45));
	}

	.gallery__nav button svg {
		width: 1.35rem;
		height: 1.35rem;
		stroke: currentColor;
		stroke-width: 3.25;
		stroke-linecap: square;
		stroke-linejoin: bevel;
		fill: none;
	}

	.gallery__nav button:hover {
		opacity: 0.7;
	}

	@media (max-width: 720px) {
		.dock {
			top: auto;
			bottom: 0.55rem;
			right: 50%;
			translate: 50% 0;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			max-width: calc(100% - 1rem);
		}

		.facts {
			grid-template-columns: 1fr;
		}
	}
</style>
