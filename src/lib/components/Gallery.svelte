<script>
	let { eindruecke = {} } = $props();

	let openIndex = $state(-1);

	const images = $derived(eindruecke.images ?? []);
	const active = $derived(openIndex >= 0 ? images[openIndex] : null);

	function open(index) {
		openIndex = index;
	}

	function close() {
		openIndex = -1;
	}

	function step(delta) {
		if (!images.length || openIndex < 0) return;
		openIndex = (openIndex + delta + images.length) % images.length;
	}
</script>

<section class="section gallery" id="eindruecke">
	<div class="wrap">
		<header class="section__head">
			<p class="eyebrow">Atmosphäre</p>
			<h2 class="section__title">{eindruecke.heading}</h2>
			{#if eindruecke.intro}
				<p class="section__intro">{eindruecke.intro}</p>
			{/if}
		</header>

		{#if images.length}
			<ul class="mosaic">
				{#each images as image, index}
					<li>
						<button type="button" onclick={() => open(index)}>
							<img src={image.src} alt={image.alt || ''} loading="lazy" />
							{#if image.caption}
								<span>{image.caption}</span>
							{/if}
						</button>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="gallery__empty">Noch keine Bilder — im CMS unter Eindrücke hinzufügen.</p>
		{/if}
	</div>
</section>

{#if active}
	<div
		class="lightbox"
		role="dialog"
		aria-modal="true"
		aria-label={active.alt || active.caption || 'Bild'}
	>
		<button class="lightbox__backdrop" type="button" aria-label="Schliessen" onclick={close}></button>
		<figure>
			<img src={active.src} alt={active.alt || ''} />
			{#if active.caption}
				<figcaption>{active.caption}</figcaption>
			{/if}
		</figure>
		<button class="lightbox__nav lightbox__nav--prev" type="button" onclick={() => step(-1)}>
			Zurück
		</button>
		<button class="lightbox__nav lightbox__nav--next" type="button" onclick={() => step(1)}>
			Weiter
		</button>
		<button class="lightbox__close" type="button" onclick={close}>Schliessen</button>
	</div>
{/if}

<svelte:window
	onkeydown={(e) => {
		if (openIndex < 0) return;
		if (e.key === 'Escape') close();
		if (e.key === 'ArrowLeft') step(-1);
		if (e.key === 'ArrowRight') step(1);
	}}
/>

<style>
	.mosaic {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}

	.mosaic button {
		width: 100%;
		padding: 0;
		border: 0;
		background: var(--cream-warm);
		border-radius: 1.15rem;
		overflow: hidden;
		cursor: zoom-in;
		text-align: left;
		color: inherit;
		box-shadow: 0 10px 30px rgba(22, 37, 27, 0.08);
		transition:
			transform 0.35s cubic-bezier(0.32, 1.5, 0.6, 1),
			box-shadow 0.35s ease;
	}

	.mosaic li:nth-child(3n + 1) button {
		rotate: -1.2deg;
	}

	.mosaic li:nth-child(3n + 2) button {
		rotate: 1.1deg;
	}

	.mosaic li:nth-child(3n) button {
		rotate: -0.6deg;
	}

	.mosaic button:hover,
	.mosaic button:focus-visible {
		transform: translateY(-6px) rotate(0deg);
		box-shadow: 0 18px 40px rgba(22, 37, 27, 0.16);
	}

	.mosaic img {
		width: 100%;
		aspect-ratio: 1;
		object-fit: cover;
	}

	.mosaic span {
		display: block;
		padding: 0.7rem 0.9rem 0.9rem;
		font-size: 0.88rem;
		font-weight: 600;
	}

	.gallery__empty {
		margin: 0;
		color: var(--ink-soft);
	}

	.lightbox {
		position: fixed;
		inset: 0;
		z-index: 80;
		display: grid;
		place-items: center;
		padding: 2rem;
	}

	.lightbox__backdrop {
		position: absolute;
		inset: 0;
		border: 0;
		background: rgba(22, 37, 27, 0.82);
		cursor: zoom-out;
	}

	.lightbox figure {
		position: relative;
		z-index: 1;
		margin: 0;
		max-width: min(920px, 100%);
	}

	.lightbox img {
		max-height: min(78vh, 920px);
		width: auto;
		max-width: 100%;
		margin-inline: auto;
		border-radius: 1rem;
	}

	.lightbox figcaption {
		margin-top: 0.75rem;
		text-align: center;
		color: var(--cream);
		font-weight: 600;
	}

	.lightbox__close,
	.lightbox__nav {
		position: absolute;
		z-index: 1;
		border: 0;
		background: var(--cream);
		color: var(--ink);
		font: inherit;
		font-weight: 700;
		padding: 0.55rem 0.95rem;
		border-radius: 999px;
		cursor: pointer;
	}

	.lightbox__close {
		top: 1rem;
		right: 1rem;
	}

	.lightbox__nav--prev {
		left: 1rem;
		top: 50%;
		translate: 0 -50%;
	}

	.lightbox__nav--next {
		right: 1rem;
		top: 50%;
		translate: 0 -50%;
	}

	@media (max-width: 780px) {
		.mosaic {
			grid-template-columns: 1fr 1fr;
		}

		.lightbox__nav {
			display: none;
		}
	}
</style>
