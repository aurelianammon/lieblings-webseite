<script>
	import Logo from './Logo.svelte';

	let { sections = [], title = 'Lieblings' } = $props();

	let scrolled = $state(false);
	let open = $state(false);
	let active = $state('');

	$effect(() => {
		const onScroll = () => (scrolled = window.scrollY > window.innerHeight * 0.55);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	$effect(() => {
		const targets = sections
			.map((s) => document.getElementById(s.id))
			.filter((el) => el !== null);
		if (!targets.length) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
				if (visible) active = visible.target.id;
			},
			{ rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
		);

		targets.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	});
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') open = false;
	}}
/>

<nav class="nav" class:is-scrolled={scrolled} class:is-open={open} aria-label="Hauptnavigation">
	<div class="nav__bar">
		<a class="nav__brand" href="#start" onclick={() => (open = false)}>
			<Logo class="nav__logo" title={title} />
			<span>{title}</span>
		</a>

		<ul class="nav__list">
			{#each sections as section}
				<li>
					<a
						href={`#${section.id}`}
						onclick={() => (open = false)}
						class="nav__link"
						class:is-active={active === section.id}
						aria-current={active === section.id ? 'true' : undefined}>{section.label}</a
					>
				</li>
			{/each}
		</ul>

		<button
			class="nav__toggle"
			type="button"
			aria-expanded={open}
			aria-controls="nav-panel"
			onclick={() => (open = !open)}
		>
			<span class="nav__toggle-lines" aria-hidden="true"><i></i><i></i><i></i></span>
			<span class="nav__toggle-label">{open ? 'Schliessen' : 'Menü'}</span>
		</button>
	</div>

	<div class="nav__panel" id="nav-panel" hidden={!open}>
		<ul>
			{#each sections as section}
				<li>
					<a href={`#${section.id}`} onclick={() => (open = false)}>{section.label}</a>
				</li>
			{/each}
		</ul>
	</div>
</nav>

<style>
	.nav {
		position: fixed;
		top: var(--marquee-h);
		left: 0;
		right: 0;
		z-index: 50;
		pointer-events: none;
	}

	.nav__bar {
		width: var(--page);
		margin-inline: auto;
		margin-top: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0;
		pointer-events: none;
	}

	.nav__brand,
	.nav__list,
	.nav__toggle,
	.nav__panel {
		pointer-events: auto;
	}

	.nav__brand {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.4rem 0.75rem;
		border: var(--stroke) solid var(--ink);
		background: var(--cream);
		box-shadow: var(--win-shadow);
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		text-decoration: none;
		color: var(--ink);
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s ease;
	}

	.is-scrolled .nav__brand,
	.is-open .nav__brand {
		opacity: 1;
		pointer-events: auto;
	}

	.nav__brand :global(.nav__logo) {
		width: 1.5rem;
		height: 1.5rem;
	}

	.nav__list {
		display: flex;
		align-items: stretch;
		border: var(--stroke) solid var(--ink);
		background: var(--cream);
		box-shadow: var(--win-shadow);
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s ease;
	}

	.is-scrolled .nav__list,
	.is-open .nav__list {
		opacity: 1;
		pointer-events: auto;
	}

	.nav__link {
		display: inline-flex;
		align-items: center;
		padding: 0.45rem 0.85rem;
		font-family: var(--font-display);
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		text-decoration: none;
		color: var(--ink);
		border-right: var(--stroke) solid var(--ink);
		transition: background-color 0.15s ease, color 0.15s ease;
	}

	.nav__list li:last-child .nav__link {
		border-right: 0;
	}

	.nav__link:hover {
		background: var(--green);
	}

	.nav__link.is-active {
		background: var(--ink);
		color: var(--cream);
	}

	.nav__toggle {
		display: none;
		align-items: center;
		gap: 0.55rem;
		border: var(--stroke) solid var(--ink);
		background: var(--ink);
		color: var(--cream);
		box-shadow: var(--win-shadow);
		font: inherit;
		font-family: var(--font-display);
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 0.5rem 0.9rem;
		cursor: pointer;
	}

	.nav__toggle-lines {
		display: grid;
		gap: 3px;
		width: 1rem;
	}

	.nav__toggle-lines i {
		display: block;
		height: 2px;
		background: currentColor;
	}

	.nav__panel {
		width: var(--page);
		margin: 0.55rem auto 0;
		border: var(--stroke) solid var(--ink);
		background: var(--cream);
		box-shadow: var(--win-shadow);
	}

	.nav__panel[hidden] {
		display: none;
	}

	.nav__panel ul {
		display: grid;
	}

	.nav__panel a {
		display: block;
		padding: 0.85rem 1rem;
		border-bottom: var(--stroke) solid var(--ink);
		font-family: var(--font-display);
		font-size: 1.15rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		text-decoration: none;
	}

	.nav__panel li:last-child a {
		border-bottom: 0;
	}

	.nav__panel a:hover {
		background: var(--green);
	}

	@media (max-width: 860px) {
		.nav__list {
			display: none;
		}

		.nav__toggle {
			display: inline-flex;
			margin-left: auto;
		}

		.nav__brand {
			opacity: 1;
			pointer-events: auto;
		}

		.nav__bar {
			pointer-events: auto;
		}
	}
</style>
