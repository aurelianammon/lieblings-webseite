<script>
	/**
	 * @type {{ text: string, position?: 'top' | 'bottom', class?: string }}
	 */
	let { text, position = 'top', class: className = '' } = $props();

	const repeats = Array.from({ length: 8 }, () => text);

	/** Keep both banners at the same slow pixel speed (matches former bottom feel). */
	const PX_PER_SEC = 28;
	let trackEl = $state(null);
	let durationSec = $state(90);

	$effect(() => {
		text;
		if (!trackEl) return;

		const measure = () => {
			const half = trackEl.scrollWidth / 2;
			if (half > 0) durationSec = Math.max(50, half / PX_PER_SEC);
		};

		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(trackEl);
		return () => ro.disconnect();
	});
</script>

<div
	class="marquee {className}"
	class:marquee--top={position === 'top'}
	class:marquee--bottom={position === 'bottom'}
	aria-hidden="true"
>
	<div
		class="marquee__track"
		bind:this={trackEl}
		style="animation-duration: {durationSec}s"
	>
		{#each repeats as item, i (i)}
			<span>{item}</span>
			<span class="marquee__sep">◆</span>
		{/each}
		{#each repeats as item, i (`b-${i}`)}
			<span>{item}</span>
			<span class="marquee__sep">◆</span>
		{/each}
	</div>
</div>

<style>
	.marquee {
		overflow: hidden;
		background: var(--cream);
		z-index: 40;
		height: var(--marquee-h);
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-shrink: 0;
	}

	.marquee--top {
		border-bottom: var(--stroke) solid var(--accent);
		border-top: 0;
	}

	.marquee--bottom {
		border-top: var(--stroke) solid var(--accent);
		border-bottom: 0;
	}

	.marquee__track {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		width: max-content;
		height: 100%;
		white-space: nowrap;
		font-family: var(--font-display);
		font-size: 22px;
		letter-spacing: 0.08em;
		line-height: 1;
		text-transform: uppercase;
		color: var(--accent);
		animation: marquee-scroll 90s linear infinite;
	}

	.marquee__track > span {
		display: inline-flex;
		align-items: center;
		line-height: 1;
	}

	.marquee__sep {
		color: var(--accent);
		font-size: 0.65rem;
		opacity: 0.55;
		transform: none;
	}

	@keyframes marquee-scroll {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee__track {
			animation: none;
		}
	}
</style>
