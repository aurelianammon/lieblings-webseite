<script>
	import Logo from './Logo.svelte';
	import Window from './Window.svelte';

	let { site = {}, statusNote = '' } = $props();

	const RAY_COUNT = 14;
	const BASE_Y = 53;
	const CENTER = 100;

	function rnd(i, salt) {
		const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
		return x - Math.floor(x);
	}

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
	<div class="hero__desk">
		<div class="hero__logo-win">
			<Window title="Das Logo" body="warm">
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

				<div class="hero__brand-bar">
					<span class="hero__brand-name">{site.title ?? 'Lieblings'}</span>
					<span class="hero__brand-sub">{site.subtitle ?? 'Café Bar'}</span>
				</div>
			</Window>
		</div>

		<div class="hero__side">
			{#if statusNote}
				<div class="hero__status-win">
					<Window title="Status">
						<p class="hero__status">{statusNote}</p>
					</Window>
				</div>
			{/if}

			<div class="hero__about-win">
				<Window title="Was ist Lieblings?">
					<p class="hero__tagline">{site.tagline}</p>
					<p class="hero__hint" aria-hidden="true">{site.hero_hint ?? 'Berühre die Sonne'}</p>
				</Window>
			</div>
		</div>
	</div>

	<h1 class="sr-only">{site.title ?? 'Lieblings'} {site.subtitle ?? ''}</h1>

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
		min-height: calc(100svh - var(--marquee-h));
		display: grid;
		align-content: center;
		padding: clamp(5.5rem, 10vw, 7rem) 0 clamp(4rem, 8vw, 5.5rem);
	}

	.hero__desk {
		width: var(--page);
		margin-inline: auto;
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
		gap: clamp(1rem, 2.5vw, 1.75rem);
		align-items: start;
	}

	.hero__logo-win {
		animation: win-in 0.7s cubic-bezier(0.22, 1.2, 0.36, 1) both;
	}

	.hero__side {
		display: grid;
		gap: 1rem;
		padding-top: clamp(0.5rem, 4vw, 3rem);
	}

	.hero__status-win {
		animation: win-in 0.7s cubic-bezier(0.22, 1.2, 0.36, 1) 0.12s both;
	}

	.hero__about-win {
		animation: win-in 0.7s cubic-bezier(0.22, 1.2, 0.36, 1) 0.22s both;
	}

	@keyframes win-in {
		from {
			opacity: 0;
			transform: translateY(18px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.hero__logo-win :global(.win__body) {
		padding: clamp(1.25rem, 3vw, 2rem);
		display: grid;
		gap: 1rem;
		justify-items: center;
	}

	.sun {
		position: relative;
		width: clamp(220px, 42vmin, 420px);
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
		fill: var(--green);
		transform-origin: 100px 53px;
	}

	.is-shining .ray__shape,
	.is-shining .dot {
		transform: none;
		opacity: 1;
		transition:
			transform 0.62s cubic-bezier(0.32, 1.75, 0.5, 1),
			opacity 0.2s ease;
		transition-delay: var(--d);
	}

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
	}

	.hero__brand-bar {
		display: flex;
		width: 100%;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		padding-top: 0.35rem;
		border-top: var(--stroke) solid var(--ink);
		font-family: var(--font-display);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.hero__brand-name {
		font-size: clamp(1.4rem, 1rem + 1.5vw, 2.1rem);
		font-weight: 700;
	}

	.hero__brand-sub {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--ink-soft);
	}

	.hero__status {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(1.15rem, 1rem + 0.7vw, 1.65rem);
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		line-height: 1.2;
	}

	.hero__tagline {
		margin: 0;
		font-size: 0.92rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		line-height: 1.5;
		color: var(--ink-soft);
	}

	.hero__hint {
		margin: 1rem 0 0;
		font-family: var(--font-display);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--green-deep);
		animation: hint-pulse 3.4s ease-in-out infinite;
	}

	@keyframes hint-pulse {
		0%,
		100% {
			opacity: 0.45;
		}
		50% {
			opacity: 1;
		}
	}

	.hero__scroll {
		position: absolute;
		z-index: 1;
		bottom: 1.25rem;
		left: 50%;
		translate: -50% 0;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-display);
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		text-decoration: none;
		color: var(--ink);
		opacity: 0.8;
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

	@media (max-width: 860px) {
		.hero__desk {
			grid-template-columns: 1fr;
		}

		.hero__side {
			padding-top: 0;
		}
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
		.hero__scroll svg,
		.hero__logo-win,
		.hero__status-win,
		.hero__about-win {
			animation: none;
		}

		.sun__button,
		.is-shining .sun__button {
			transform: none;
			transition: none;
		}
	}
</style>
