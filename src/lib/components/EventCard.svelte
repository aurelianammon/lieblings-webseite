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

	<div class="event__body">
		<div class="event__date">
			<time datetime={event.date} aria-label={when.full}>
				<span class="event__day">{when.day}</span>
				<span class="event__month">{when.month}</span>
			</time>
			<span class="event__weekday">{when.weekday}{when.year ? ` · ${when.year}` : ''}</span>
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
				<a class="event__link" href={event.link_url} target="_blank" rel="noopener noreferrer">
					{event.link_label || 'Mehr erfahren'}
					<span aria-hidden="true">↗</span>
				</a>
			{/if}
		</div>
	</div>
</article>

<style>
	.event {
		display: grid;
		grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
		gap: clamp(1.25rem, 3vw, 2.5rem);
		align-items: center;
		padding: clamp(1.1rem, 2vw, 1.6rem);
		border-radius: var(--radius);
		background: var(--cream-warm);
		transition:
			transform 0.35s cubic-bezier(0.32, 1.5, 0.6, 1),
			box-shadow 0.35s ease;
	}

	.event:hover {
		transform: translateY(-4px) rotate(-0.35deg);
		box-shadow: 0 18px 40px rgba(22, 37, 27, 0.14);
	}

	.event:not(:has(.event__media)) {
		grid-template-columns: 1fr;
	}

	.event.is-past {
		background: transparent;
		border: 1px solid rgba(22, 37, 27, 0.15);
		opacity: 0.7;
	}

	.event.is-past:hover {
		transform: none;
		box-shadow: none;
		opacity: 1;
	}

	.event__media {
		border-radius: calc(var(--radius) - 0.5rem);
		overflow: hidden;
		background: var(--green);
	}

	.event__media img {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
	}

	.event__body {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: clamp(1rem, 2vw, 1.75rem);
		align-items: start;
	}

	.event__date {
		display: grid;
		justify-items: center;
		gap: 0.35rem;
		padding: 0.65rem 0.9rem;
		border-radius: 1rem;
		background: var(--green);
		color: var(--ink);
		text-align: center;
		rotate: -2deg;
	}

	.event__date time {
		display: grid;
		justify-items: center;
		line-height: 1;
	}

	.event__day {
		font-family: var(--font-display);
		font-size: 2rem;
		font-weight: 700;
	}

	.event__month {
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.event__weekday {
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		opacity: 0.75;
	}

	.event__category {
		margin: 0 0 0.3rem;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--green-deep);
	}

	.event__title {
		font-size: clamp(1.4rem, 1.1rem + 1vw, 2rem);
	}

	.event__meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1rem;
		margin: 0.5rem 0 0;
		font-size: 0.9rem;
		color: var(--ink-soft);
	}

	.event__meta span + span::before {
		content: '·';
		margin-right: 0.75rem;
		opacity: 0.5;
	}

	.event__desc {
		margin-top: 0.75rem;
		color: var(--ink-soft);
		font-size: 0.98rem;
	}

	.event__link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-top: 1rem;
		padding: 0.5rem 1.1rem;
		border-radius: 999px;
		background: var(--ink);
		color: var(--cream);
		font-size: 0.9rem;
		font-weight: 600;
		text-decoration: none;
	}

	.event__link:hover {
		background: var(--green-deep);
	}

	@media (max-width: 780px) {
		.event {
			grid-template-columns: 1fr;
		}

		.event__body {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.event__date {
			display: flex;
			align-items: baseline;
			gap: 0.5rem;
			justify-self: start;
			rotate: -1.5deg;
		}

		.event__day {
			font-size: 1.5rem;
		}
	}
</style>
