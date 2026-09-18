<script>
	import EventCard from './EventCard.svelte';
	import { isUpcoming } from '$lib/date.js';

	let { meta = {}, events = [] } = $props();

	const upcoming = $derived(events.filter((event) => isUpcoming(event.date)));
	const past = $derived(
		events.filter((event) => !isUpcoming(event.date)).slice().reverse()
	);
</script>

<section class="section events" id="events">
	<div class="wrap">
		<header class="section__head">
			<p class="eyebrow">Programm</p>
			<h2 class="section__title">{meta.heading}</h2>
			{#if meta.intro}
				<p class="section__intro">{meta.intro}</p>
			{/if}
		</header>

		{#if upcoming.length}
			<ul class="events__list">
				{#each upcoming as event (event.slug)}
					<li>
						<EventCard {event} />
					</li>
				{/each}
			</ul>
		{:else}
			<p class="events__empty">{meta.empty_text}</p>
		{/if}

		{#if past.length}
			<details class="events__past">
				<summary>{meta.past_label || 'Vergangene Events'}</summary>
				<ul class="events__list events__list--past">
					{#each past as event (event.slug)}
						<li>
							<EventCard {event} past />
						</li>
					{/each}
				</ul>
			</details>
		{/if}
	</div>
</section>

<style>
	.events__list {
		display: grid;
		gap: 1rem;
	}

	.events__empty {
		margin: 0;
		padding: 1.25rem;
		border: var(--stroke) solid var(--ink);
		background: var(--cream);
		box-shadow: var(--win-shadow);
		color: var(--ink-soft);
		max-width: 42ch;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		font-size: 0.92rem;
	}

	.events__past {
		margin-top: 2.5rem;
	}

	.events__past summary {
		cursor: pointer;
		font-family: var(--font-display);
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		font-size: 0.78rem;
		color: var(--ink-soft);
		margin-bottom: 1rem;
	}

	.events__list--past {
		opacity: 0.88;
	}
</style>
