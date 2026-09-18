<script>
	import { formatEventDate } from '$lib/date.js';

	let { event, past = false } = $props();
	const when = $derived(formatEventDate(event.date));
</script>

<article class="event" class:is-past={past}>
	{#if event.image}
		<div class="event__media">
			<img src={event.image} alt={event.image_alt || event.title} loading="lazy" />
		</div>
	{/if}

	<div class="event__main">
		<div class="event__date">
			<time datetime={event.date} aria-label={when.full}>
				<span class="event__day">{when.day}</span>
				<span class="event__month">{when.month}</span>
			</time>
		</div>

		<div class="event__text">
			{#if event.category}
				<p class="event__category">{event.category}</p>
			{/if}
			<h3 class="event__title">{event.title}</h3>
			<p class="event__meta">
				{#if event.time}<span>{event.time} Uhr</span>{/if}
				{#if event.location}<span>{event.location}</span>{/if}
			</p>
			{#if event.body}
				<div class="event__desc rich">{@html event.body}</div>
			{/if}
			{#if event.link_url}
				<a class="btn" href={event.link_url} target="_blank" rel="noopener noreferrer">
					{event.link_label || 'Mehr erfahren'}
					<span aria-hidden="true">↗</span>
				</a>
			{/if}
		</div>
	</div>
</article>

<style>
	.event {
		padding: 0 0 1rem;
		border-bottom: var(--stroke) solid var(--accent-soft);
		display: grid;
		gap: 0.75rem;
	}

	.event:last-child {
		border-bottom: 0;
		padding-bottom: 0;
	}

	.event.is-past {
		opacity: 0.55;
	}

	.event__media img {
		width: 100%;
		aspect-ratio: 16 / 10;
		object-fit: cover;
	}

	.event__main {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.85rem;
		align-items: start;
	}

	.event__date {
		text-align: center;
		min-width: 3rem;
	}

	.event__date time {
		display: grid;
		line-height: 1;
	}

	.event__day {
		font-family: var(--font-display);
		font-size: 2rem;
		letter-spacing: 0.04em;
	}

	.event__month {
		font-family: var(--font-display);
		font-size: 0.85rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.event__category {
		margin: 0 0 0.15rem;
		font-family: var(--font-display);
		font-size: 0.85rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent-soft);
	}

	.event__title {
		font-size: 1.55rem;
		letter-spacing: 0.06em;
	}

	.event__meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 0.85rem;
		margin: 0.3rem 0 0;
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--accent-soft);
	}

	.event__desc {
		margin-top: 0.5rem;
		font-size: 0.95rem;
		color: var(--accent-soft);
	}

	.event__text :global(.btn) {
		margin-top: 0.65rem;
	}

	@media (max-width: 520px) {
		.event__main {
			grid-template-columns: 1fr;
		}

		.event__date {
			display: inline-flex;
			align-items: baseline;
			gap: 0.4rem;
			justify-self: start;
		}
	}
</style>
