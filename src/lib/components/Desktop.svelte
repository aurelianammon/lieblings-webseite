<script>
	import Window from './Window.svelte';
	import LogoPanel from './LogoPanel.svelte';
	import EventCard from './EventCard.svelte';
	import DockIcon from './DockIcon.svelte';
	import { isUpcoming } from '$lib/date.js';

	let { data } = $props();

	const apps = [
		{ id: 'logo', label: 'Logo', title: 'Das Logo', width: 420, height: 440, flush: true, fitContent: true, maxHeightRatio: 0.9 },
		{ id: 'hours', label: 'Zeiten', title: 'Öffnungszeiten', width: 420, height: 200, fitContent: true, maxHeightRatio: 0.5 },
		{ id: 'address', label: 'Adresse', title: 'Adresse', width: 340, height: 200, fitContent: true, maxHeightRatio: 0.5 },
		{ id: 'contact', label: 'Kontakt', title: 'Kontakt', width: 520, height: 200, fitContent: true, maxHeightRatio: 0.5 },
		{ id: 'events', label: 'Programm', title: 'Programm', width: 460, height: 500 },
		{ id: 'verein', label: 'Verein', title: 'Verein', width: 420, height: 200, fitContent: true, maxHeightRatio: 0.85 },
		{ id: 'gallery', label: 'Eindrücke', title: 'Eindrücke', spawnPhoto: true },
		{ id: 'newsletter', label: 'Newsletter', title: 'Newsletter', width: 360, height: 200, fitContent: true, maxHeightRatio: 0.5 }
	];

	const panelApps = apps.filter((app) => !app.spawnPhoto);

	let zTop = $state(20);
	let deskEl = $state(null);

	let windows = $state(
		Object.fromEntries(
			panelApps.map((app) => [
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

	/** @type {{ id: string, title: string, src: string, alt: string, x: number, y: number, z: number, width: number, height: number }[]} */
	let photoWindows = $state([]);
	let photoSeq = 0;

	const upcoming = $derived(data.events.filter((event) => isUpcoming(event.date)));
	const past = $derived(
		data.events.filter((event) => !isUpcoming(event.date)).slice().reverse()
	);

	const galleryImages = $derived(data.eindruecke.images ?? []);

	const PHOTO_CHROME_H = 42;
	const PHOTO_HEIGHT_RATIO = 0.5;
	const MENU_WIDTH = 120;

	const MOBILE_BP = 720;

	let mobile = $state(false);

	let menu = $state({
		x: 16,
		y: 16,
		z: 30,
		width: MENU_WIDTH,
		height: 420,
		collapsed: false
	});

	function isMobile() {
		return Boolean(deskEl && deskEl.clientWidth < MOBILE_BP);
	}

	function centerMenu() {
		if (!deskEl || !mobile) return;
		menu.x = Math.max(0, Math.round((deskEl.clientWidth - menu.width) / 2));
		menu.y = Math.max(0, Math.round((deskEl.clientHeight - menu.height) / 2));
	}

	function placeMenuDefault() {
		if (!deskEl) return;
		const pad = mobile ? 10 : 16;
		if (mobile) {
			menu.collapsed = false;
			centerMenu();
		} else {
			menu.x = Math.max(pad, deskEl.clientWidth - menu.width - pad);
			menu.y = pad;
		}
	}

	function openCount() {
		return Object.values(windows).filter((w) => w.open).length + photoWindows.length;
	}

	function sizeFor(app) {
		const baseWidth = app.width;
		const baseHeight = app.height;
		if (!deskEl || !isMobile()) {
			return { width: baseWidth, height: baseHeight };
		}
		const pad = 10;
		const width = Math.max(240, deskEl.clientWidth - pad * 2);
		if (app.id === 'logo') {
			const chrome = 42;
			const side = Math.min(width, Math.round(window.innerHeight * (app.maxHeightRatio ?? 0.9) - chrome));
			return { width: side, height: side + chrome };
		}
		if (app.fitContent) {
			return {
				width,
				height: Math.min(baseHeight, Math.round(window.innerHeight * (app.maxHeightRatio ?? 0.5)))
			};
		}
		return {
			width,
			height: Math.max(220, deskEl.clientHeight - pad * 2)
		};
	}

	function placeWindow(width, height) {
		if (!deskEl) return { x: 10, y: 10 };
		const pad = isMobile() ? 10 : 16;
		const maxX = Math.max(pad, deskEl.clientWidth - width - pad);
		const maxY = Math.max(pad, deskEl.clientHeight - height - pad);

		if (isMobile()) {
			const nudge = Math.min(openCount() * 14, 42);
			return {
				x: Math.min(pad + nudge, maxX),
				y: Math.min(pad + nudge, maxY)
			};
		}

		return {
			x: Math.round(pad + Math.random() * Math.max(0, maxX - pad)),
			y: Math.round(pad + Math.random() * Math.max(0, maxY - pad))
		};
	}

	function focusWindow(id) {
		zTop += 1;
		windows[id].z = zTop;
	}

	function openWindow(id) {
		const win = windows[id];
		const app = panelApps.find((a) => a.id === id);
		if (!win.open) {
			const size = sizeFor(app ?? { width: win.width, height: win.height });
			win.width = size.width;
			win.height = size.height;
			const pos = placeWindow(win.width, win.height);
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
		const app = apps.find((a) => a.id === id);
		if (app?.spawnPhoto) {
			openPhotoWindow();
			return;
		}
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

	function setWindowHeight(id, height) {
		const win = windows[id];
		if (!win?.open) return;
		if (win.height === height) return;
		win.height = height;
		if (deskEl) {
			const maxY = Math.max(10, deskEl.clientHeight - height - 10);
			if (win.y > maxY) win.y = maxY;
		}
	}

	/** @param {string} src */
	function loadImageSize(src) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
			img.onerror = reject;
			img.src = src;
		});
	}

	function sizePhotoWindow(naturalW, naturalH) {
		const aspect = naturalW / Math.max(1, naturalH);
		let height = Math.round(window.innerHeight * PHOTO_HEIGHT_RATIO);
		let bodyH = Math.max(80, height - PHOTO_CHROME_H);
		let width = Math.round(bodyH * aspect);

		if (deskEl) {
			const pad = isMobile() ? 10 : 16;
			const maxW = Math.max(160, deskEl.clientWidth - pad * 2);
			const maxH = Math.max(140, deskEl.clientHeight - pad * 2);
			if (height > maxH) {
				height = maxH;
				bodyH = Math.max(80, height - PHOTO_CHROME_H);
				width = Math.round(bodyH * aspect);
			}
			if (width > maxW) {
				width = maxW;
				bodyH = Math.round(width / aspect);
				height = bodyH + PHOTO_CHROME_H;
			}
		}

		return { width, height };
	}

	async function openPhotoWindow() {
		if (!galleryImages.length) return;
		const image = galleryImages[Math.floor(Math.random() * galleryImages.length)];
		let natW = 4;
		let natH = 3;
		try {
			const size = await loadImageSize(image.src);
			if (size.w > 0 && size.h > 0) {
				natW = size.w;
				natH = size.h;
			}
		} catch {
			/* keep default ratio */
		}

		const { width, height } = sizePhotoWindow(natW, natH);
		photoSeq += 1;
		zTop += 1;
		const pos = placeWindow(width, height);
		photoWindows.push({
			id: `photo-${photoSeq}`,
			title: image.caption || image.alt || data.eindruecke?.heading || 'Eindruck',
			src: image.src,
			alt: image.alt || image.caption || '',
			x: pos.x,
			y: pos.y,
			z: zTop,
			width,
			height
		});
	}

	function focusPhotoWindow(id) {
		zTop += 1;
		const win = photoWindows.find((w) => w.id === id);
		if (win) win.z = zTop;
	}

	function closePhotoWindow(id) {
		photoWindows = photoWindows.filter((w) => w.id !== id);
	}

	function movePhotoWindow(id, { x, y }) {
		const win = photoWindows.find((w) => w.id === id);
		if (win) {
			win.x = x;
			win.y = y;
		}
	}

	function focusMenu() {
		zTop += 1;
		menu.z = zTop;
	}

	function moveMenu({ x, y }) {
		menu.x = x;
		menu.y = y;
	}

	function setMenuHeight(height) {
		if (menu.height === height) return;
		menu.height = height;
		if (deskEl) {
			const maxY = Math.max(10, deskEl.clientHeight - height - 10);
			if (menu.y > maxY) menu.y = maxY;
		}
		if (mobile) centerMenu();
	}

	function setMenuWidth(width) {
		if (!Number.isFinite(width) || width < 48) return;
		if (menu.width === width) return;
		const prev = menu.width;
		menu.width = width;
		if (mobile) {
			centerMenu();
			return;
		}
		if (deskEl) {
			const maxX = Math.max(10, deskEl.clientWidth - width - 10);
			menu.x = Math.min(Math.max(0, menu.x - (width - prev)), maxX);
		}
	}

	function isAppOpen(app) {
		if (app.spawnPhoto) return false;
		return windows[app.id].open;
	}

	let shellPlaced = $state(false);

	$effect(() => {
		if (!deskEl) return;
		const syncMobile = () => {
			const next = deskEl.clientWidth < MOBILE_BP;
			const changed = next !== mobile;
			mobile = next;
			if (next) menu.collapsed = false;
			if (shellPlaced && changed) placeMenuDefault();
		};
		syncMobile();
		const ro = new ResizeObserver(syncMobile);
		ro.observe(deskEl);
		return () => ro.disconnect();
	});

	$effect(() => {
		if (!deskEl || shellPlaced) return;

		mobile = isMobile();
		menu.width = MENU_WIDTH;
		menu.z = zTop;
		placeMenuDefault();

		if (!mobile) {
			const size = sizeFor(apps[0]);
			windows.logo.width = size.width;
			windows.logo.height = size.height;
			const pos = placeWindow(windows.logo.width, windows.logo.height);
			zTop += 1;
			windows.logo.x = pos.x;
			windows.logo.y = pos.y;
			windows.logo.z = zTop;
			windows.logo.open = true;
		}

		shellPlaced = true;
	});
</script>

<div class="desktop" bind:this={deskEl} id="inhalt">
	{#each panelApps as app (app.id)}
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
				fitContent={app.fitContent ?? false}
				maxHeightRatio={app.maxHeightRatio ?? 0.5}
				onFocus={() => focusWindow(app.id)}
				onClose={() => closeWindow(app.id)}
				onMove={(pos) => moveWindow(app.id, pos)}
				onHeightChange={(h) => setWindowHeight(app.id, h)}
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
						<a class="btn map-btn" href={data.besuch.map_url} target="_blank" rel="noopener noreferrer">
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

	{#each photoWindows as photo (photo.id)}
		<Window
			id={photo.id}
			title={photo.title}
			x={photo.x}
			y={photo.y}
			z={photo.z}
			width={photo.width}
			height={photo.height}
			flush
			onFocus={() => focusPhotoWindow(photo.id)}
			onClose={() => closePhotoWindow(photo.id)}
			onMove={(pos) => movePhotoWindow(photo.id, pos)}
		>
			<img class="photo" src={photo.src} alt={photo.alt} draggable="false" />
		</Window>
	{/each}

	{#if shellPlaced}
		{#snippet menuChrome()}
			{#if menu.collapsed}
				<button
					type="button"
					aria-label="Menü ausklappen"
					onclick={(e) => {
						e.stopPropagation();
						menu.collapsed = false;
					}}
				>
					+
				</button>
			{:else}
				<button
					type="button"
					aria-label="Menü einklappen"
					onclick={(e) => {
						e.stopPropagation();
						menu.collapsed = true;
					}}
				>
					−
				</button>
			{/if}
		{/snippet}
		<Window
			id="menu"
			title={mobile || !menu.collapsed ? 'Menü' : ''}
			ariaLabel="Menü"
			x={menu.x}
			y={menu.y}
			z={menu.z}
			width={menu.width}
			height={menu.height}
			compact
			fitContent
			fitWidth
			maxHeightRatio={0.92}
			closable={false}
			chromeActions={mobile ? undefined : menuChrome}
			onFocus={focusMenu}
			onMove={moveMenu}
			onHeightChange={setMenuHeight}
			onWidthChange={setMenuWidth}
		>
			<nav
				class="menu"
				class:is-collapsed={!mobile && menu.collapsed}
				class:is-mobile={mobile}
				aria-label="Fenster öffnen"
			>
				{#each apps as app (app.id)}
					<button
						type="button"
						class="menu__item"
						class:is-open={isAppOpen(app)}
						aria-label={app.label}
						aria-pressed={isAppOpen(app)}
						onclick={() => toggleWindow(app.id)}
					>
						{#if !mobile}
							<span class="menu__icon"><DockIcon name={app.id} /></span>
						{/if}
						{#if mobile || !menu.collapsed}
							<span class="menu__label">{app.label}</span>
						{/if}
					</button>
				{/each}
			</nav>
		</Window>
	{/if}
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
		background-position: 0 -1px, 0 0;
	}

	.menu {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		width: max-content;
	}

	.menu__item {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		padding: 0.4rem 0.45rem;
		border: 0;
		background: transparent;
		color: var(--accent);
		cursor: pointer;
		text-align: left;
		font: inherit;
		white-space: nowrap;
		transition: background-color 0.15s ease, color 0.15s ease;
	}

	.menu.is-collapsed .menu__item {
		justify-content: center;
		padding-left: 0.35rem;
		padding-right: 0.35rem;
	}

	.menu.is-mobile .menu__item {
		padding: 0.5rem 0.65rem;
	}

	.menu.is-mobile .menu__label {
		font-size: 1.1rem;
	}

	.menu__item:hover,
	.menu__item.is-open {
		background: var(--accent);
		color: var(--cream);
		--dock-hole: var(--accent);
	}

	.menu__icon {
		display: grid;
		place-items: center;
		width: 1.75rem;
		height: 1.75rem;
		flex-shrink: 0;
	}

	.menu__label {
		font-family: var(--font-display);
		font-size: 1rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		line-height: 1;
		white-space: nowrap;
	}

	.hours,
	.facts,
	.socials {
		display: grid;
		gap: 0.55rem;
	}

	.events {
		display: grid;
		gap: 1.25rem;
	}

	.hours li {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1.25rem;
		padding-bottom: 0.45rem;
		border-bottom: var(--stroke) solid var(--accent-soft);
		font-size: 0.95rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.hours li > span {
		min-width: 0;
		flex: 1 1 auto;
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
		white-space: nowrap;
		flex: 0 0 auto;
		text-align: right;
	}

	.address {
		font-style: normal;
		display: grid;
		gap: 0.15rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-bottom: 0;
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

	.map-btn {
		margin-top: 1.15rem;
	}

	.lead {
		margin: 0 0 1.35rem;
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
		padding-top: 1.5rem;
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

	.photo {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		pointer-events: none;
		user-select: none;
	}

	@media (max-width: 720px) {
		.facts {
			grid-template-columns: 1fr;
		}
	}
</style>
