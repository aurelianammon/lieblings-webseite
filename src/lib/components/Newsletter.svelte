<script>
	import Window from './Window.svelte';

	let { newsletter = {} } = $props();
</script>

<section class="section newsletter" id="newsletter">
	<div class="wrap">
		<Window title="Bleib dran" chrome="ink" body="green">
			<div class="newsletter__box">
				<h2 class="section__title">{newsletter.heading}</h2>
				{#if newsletter.body}
					<div class="newsletter__copy rich">{@html newsletter.body}</div>
				{/if}
				{#if newsletter.email}
					<a class="btn" href={`mailto:${newsletter.email}?subject=Newsletter`}>
						{newsletter.button_label || 'Newsletter abonnieren'}
					</a>
				{/if}
			</div>
		</Window>
	</div>
</section>

<style>
	.newsletter {
		padding-block: clamp(2rem, 5vw, 3.5rem);
	}

	.newsletter__box {
		display: grid;
		justify-items: start;
		gap: 0.85rem;
		padding: clamp(0.5rem, 2vw, 1.25rem);
	}

	.newsletter__copy {
		max-width: 46ch;
		font-size: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		line-height: 1.45;
	}

	.newsletter__box :global(.btn) {
		margin-top: 0.35rem;
	}
</style>
