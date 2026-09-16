<script>
	import Logo from './Logo.svelte';

	let { site = {}, statusNote = '' } = $props();

	const RAY_COUNT = 14;
	const BASE_Y = 53; // sun edge, in the 200×200 ray viewBox
	const CENTER = 100;

	/** Deterministic pseudo-random so the prerendered and hydrated rays match. */
	function rnd(i, salt) {
		const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
		return x - Math.floor(x);
	}

	/** A wonky, slightly bowed petal — drawn like a kid would draw a sunbeam. */
	function rayPath(len, halfBase, halfTip, bow) {
		const tipY = BASE_Y - len;
		return [
			`M ${CENTER - halfBase} ${BASE_Y}`,
			`Q ${CENTER - halfBase - bow} ${BASE_Y - len * 0.55} ${CENTER - halfTip} ${tipY}`,
			`Q ${CENTER} ${tipY - halfTip * 1.6} ${CENTER + halfTip} ${tipY}`,
			`Q ${CENTER + halfBase + bow * 0.5} ${BASE_Y - len * 0.5} ${CENTER + halfBase} ${BASE_Y}`,
			'Z'
		].join(' ');
	}

	const step = 360 / RAY_COUNT;

	const rays = Array.from({ length: RAY_COUNT }, (_, i) => {
		const len = 22 + rnd(i, 1) * 15;
		const halfBase = 4.2 + rnd(i, 2) * 2.6;
		const bow = (rnd(i, 3) - 0.5) * 5;
		return {
			angle: i * step + (rnd(i, 4) - 0.5) * 7,
			path: rayPath(len, halfBase, 1 + rnd(i, 5) * 1.4, bow),
			delay: Math.round(rnd(i, 6) * 130),
			wobble: 3 + rnd(i, 7) * 4,
			spin: (rnd(i, 8) - 0.5) * 6
		};
	});

	// little cream dots that hop into the gaps between the beams
	const dots = Array.from({ length: RAY_COUNT }, (_, i) => ({
		angle: i * step + step / 2 + (rnd(i, 9) - 0.5) * 6,
		dist: 12 + rnd(i, 10) * 11,
		r: 1.5 + rnd(i, 11) * 1.6,
		delay: 120 + Math.round(rnd(i, 12) * 180)
	}));

	let hovered = $state(false);
	let pinned = $state(false);
	let teasing = $state(false);

	const shining = $derived(hovered || pinned || teasing);

	// one gentle burst after load so the interaction is discoverable on touch
	$effect(() => {
		const on = setTimeout(() => (teasing = true), 900);
		const off = setTimeout(() => (teasing = false), 2600);
		return () => {
			clearTimeout(on);
			clearTimeout(off);
		};
	});
</script>

<header class="hero" id="start">
	<div class="hero__inner">
		<div class="sun" class:is-shining={shining}>
			<svg class="rays" viewBox="0 0 200 200" aria-hidden="true">
				{#each rays as ray}
					<g
						class="ray"
						style="--wobble:{ray.wobble}s; --spin:{ray.spin}deg; transform: rotate({ray.angle}deg)"
					>
						<path class="ray__shape" style="--d:{ray.delay}ms" d={ray.path} />
					</g>
				{/each}
				{#each dots as dot}
					<g class="ray" style="transform: rotate({dot.angle}deg)">
						<circle
							class="dot"
							style="--d:{dot.delay}ms"
							cx={CENTER}
							cy={BASE_Y - dot.dist}
							r={dot.r}
						/>
					</g>
				{/each}
			</svg>

			<button
				type="button"
				class="sun__button"
				aria-pressed={pinned}
				onpointerenter={() => (hovered = true)}
				onpointerleave={() => (hovered = false)}
				onfocus={() => (hovered = true)}
				onblur={() => (hovered = false)}
				onclick={() => (pinned = !pinned)}
			>
				<Logo class="sun__logo" title="Lieblings Café Bar" />
				<span class="sr-only">Lieblings Café Bar — Sonnenstrahlen ein- und ausschalten</span>
			</button>
		</div>

		<h1 class="sr-only">{site.title ?? 'Lieblings'} {site.subtitle ?? ''}</h1>

		{#if statusNote}
			<p class="hero__status">{statusNote}</p>
		{/if}

		<p class="hero__hint" aria-hidden="true">{site.hero_hint ?? 'Berühre die Sonne'}</p>
	</div>

	<a class="hero__scroll" href="#besuch">
		<span>{site.scroll_hint ?? 'Mehr entdecken'}</span>
		<svg viewBox="0 0 24 24" aria-hidden="true"
			><path
				d="M12 4v14M6 13l6 6 6-6"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/></svg
		>
	</a>
</header>

<style>
	.hero {
		position: relative;
		min-height: 100svh;
		display: grid;
		place-items: center;
		background: radial-gradient(circle at 50% 40%, #9cc79c 0%, var(--green) 55%, #7fae82 100%);
		overflow: hidden;
	}

	/* hand-painted paper grain */
	.hero::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0.35;
		mix-blend-mode: soft-light;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E");
	}

	.hero__inner {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		padding: 6rem 1.5rem 7rem;
	}

	.sun {
		position: relative;
		width: clamp(275px, 58vmin, 560px);
		aspect-ratio: 1;
		display: grid;
		place-items: center;
	}

	.rays {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
		pointer-events: none;
	}

	.ray {
		transform-box: view-box;
		transform-origin: 100px 100px;
	}

	.ray__shape,
	.dot {
		transform-box: view-box;
		transform-origin: 100px 53px;
		transform: translateY(14px) scale(0.35);
		opacity: 0;
		transition:
			transform 0.3s cubic-bezier(0.4, 0, 0.7, 1),
			opacity 0.25s ease;
		transition-delay: calc(var(--d) / 3);
	}

	.ray__shape {
		fill: var(--ink);
	}

	.dot {
		fill: var(--cream-warm);
		transform-origin: 100px 53px;
	}

	.is-shining .ray__shape,
	.is-shining .dot {
		transform: none;
		opacity: 1;
		/* overshoot on the way out — that is the bounce */
		transition:
			transform 0.62s cubic-bezier(0.32, 1.75, 0.5, 1),
			opacity 0.2s ease;
		transition-delay: var(--d);
	}

	/* rays keep breathing while they are out */
	.is-shining .ray {
		animation: ray-sway var(--wobble, 4s) ease-in-out infinite alternate;
	}

	@keyframes ray-sway {
		to {
			rotate: var(--spin, 3deg);
		}
	}

	.sun__button {
		position: relative;
		z-index: 1;
		width: 46%;
		aspect-ratio: 1;
		padding: 0;
		margin: 0;
		border: 0;
		background: none;
		color: var(--ink);
		cursor: pointer;
		display: grid;
		place-items: center;
		border-radius: 50%;
		transition: transform 0.55s cubic-bezier(0.32, 1.7, 0.5, 1);
	}

	.is-shining .sun__button {
		transform: scale(1.045) rotate(-1.5deg);
	}

	.sun__button:active {
		transform: scale(0.98);
	}

	.sun__button :global(.sun__logo) {
		width: 100%;
		height: auto;
		filter: drop-shadow(0 12px 28px rgba(22, 37, 27, 0.22));
	}

	.hero__status {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(1.15rem, 1rem + 0.9vw, 1.9rem);
		font-style: italic;
		text-align: center;
		color: var(--ink);
		max-width: 24ch;
	}

	.hero__hint {
		margin: 0;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: rgba(22, 37, 27, 0.6);
		animation: hint-pulse 3.4s ease-in-out infinite;
	}

	@keyframes hint-pulse {
		0%,
		100% {
			opacity: 0.45;
			transform: translateY(0) rotate(-0.6deg);
		}
		50% {
			opacity: 1;
			transform: translateY(-3px) rotate(0.6deg);
		}
	}

	.hero__scroll {
		position: absolute;
		z-index: 1;
		bottom: 1.75rem;
		left: 50%;
		translate: -50% 0;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		text-decoration: none;
		color: var(--ink);
		opacity: 0.75;
	}

	.hero__scroll:hover {
		opacity: 1;
	}

	.hero__scroll svg {
		width: 1.1rem;
		height: 1.1rem;
		animation: nudge 2s ease-in-out infinite;
	}

	@keyframes nudge {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(4px);
		}
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
		border: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.ray__shape,
		.dot {
			transform: none;
			opacity: 1;
			transition: none;
		}

		.is-shining .ray,
		.hero__hint,
		.hero__scroll svg {
			animation: none;
		}

		.sun__button,
		.is-shining .sun__button {
			transform: none;
			transition: none;
		}
	}
</style>
