<script>
	import Window from './Window.svelte';

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
					<li class:mosaic__lift={index % 3 === 1} class:mosaic__nudge={index % 3 === 2}>
						<Window title={image.caption || `Bild ${index + 1}`} body="flush">
							<button type="button" onclick={() => open(index)}>
								<img src={image.src} alt={image.alt || ''} loading="lazy" />
							</button>
						</Window>
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
		<button class="lightbox__nav lightbox__nav--prev btn" type="button" onclick={() => step(-1)}>
			← Zurück
		</button>
		<button class="lightbox__nav lightbox__nav--next btn" type="button" onclick={() => step(1)}>
			Weiter →
		</button>
		<button class="lightbox__close btn" type="button" onclick={close}>Schliessen</button>
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
		align-items: start;
	}

	.mosaic li.mosaic__lift {
		margin-top: 0.85rem;
	}

	.mosaic li.mosaic__nudge {
		margin-top: 0.35rem;
	}

	.mosaic button {
		width: 100%;
		padding: 0;
		border: 0;
		background: var(--cream-warm);
		cursor: zoom-in;
		color: inherit;
		display: block;
	}

	.mosaic img {
		width: 100%;
		aspect-ratio: 1;
		object-fit: cover;
	}

	.gallery__empty {
		margin: 0;
		color: var(--ink-soft);
		text-transform: uppercase;
		letter-spacing: 0.04em;
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
		background: rgba(22, 37, 27, 0.86);
		cursor: zoom-out;
	}

	.lightbox figure {
		position: relative;
		z-index: 1;
		margin: 0;
		max-width: min(920px, 100%);
		border: var(--stroke) solid var(--cream);
		background: var(--cream);
		padding: 0.65rem;
	}

	.lightbox img {
		max-height: min(72vh, 920px);
		width: auto;
		max-width: 100%;
		margin-inline: auto;
	}

	.lightbox figcaption {
		margin-top: 0.65rem;
		text-align: center;
		font-family: var(--font-display);
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink);
	}

	.lightbox__close,
	.lightbox__nav {
		position: absolute;
		z-index: 1;
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

		.mosaic li.mosaic__lift,
		.mosaic li.mosaic__nudge {
			margin-top: 0;
		}

		.lightbox__nav {
			display: none;
		}
	}
</style>
