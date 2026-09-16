<script>
	import Logo from './Logo.svelte';

	let { sections = [], title = 'Lieblings' } = $props();

	let scrolled = $state(false);
	let open = $state(false);
	let active = $state('');

	$effect(() => {
		const onScroll = () => (scrolled = window.scrollY > window.innerHeight * 0.75);
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
		inset: 0 0 auto;
		z-index: 50;
	}

	.nav__bar {
		width: var(--page);
		margin-inline: auto;
		margin-top: 0.9rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.55rem 0.85rem 0.55rem 1rem;
		border-radius: 999px;
		background: transparent;
		transition:
			background-color 0.35s ease,
			box-shadow 0.35s ease,
			backdrop-filter 0.35s ease;
	}

	.is-scrolled .nav__bar,
	.is-open .nav__bar {
		background: rgba(251, 246, 234, 0.88);
		backdrop-filter: blur(12px) saturate(1.2);
		box-shadow: 0 8px 30px rgba(22, 37, 27, 0.12);
	}

	.nav__brand {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		font-family: var(--font-display);
		font-size: 1.1rem;
		font-weight: 600;
		text-decoration: none;
		color: var(--ink);
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.35s ease;
	}

	.is-scrolled .nav__brand,
	.is-open .nav__brand {
		opacity: 1;
		pointer-events: auto;
	}

	.nav__brand :global(.nav__logo) {
		width: 1.85rem;
		height: 1.85rem;
	}

	.nav__list {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.nav__link {
		display: inline-block;
		padding: 0.4rem 0.85rem;
		border-radius: 999px;
		font-size: 0.92rem;
		font-weight: 500;
		text-decoration: none;
		color: var(--ink);
		transition:
			background-color 0.2s ease,
			color 0.2s ease;
	}

	.nav__link:hover {
		background: rgba(22, 37, 27, 0.09);
	}

	.nav__link.is-active {
		background: var(--ink);
		color: var(--cream);
	}

	.nav__toggle {
		display: none;
		align-items: center;
		gap: 0.55rem;
		border: 0;
		background: var(--ink);
		color: var(--cream);
		font: inherit;
		font-size: 0.85rem;
		font-weight: 600;
		padding: 0.5rem 1rem;
		border-radius: 999px;
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
		border-radius: 2px;
		background: currentColor;
	}

	.nav__panel {
		width: var(--page);
		margin: 0.5rem auto 0;
		padding: 1rem;
		border-radius: 1.5rem;
		background: rgba(251, 246, 234, 0.96);
		backdrop-filter: blur(12px);
		box-shadow: 0 14px 40px rgba(22, 37, 27, 0.18);
	}

	.nav__panel[hidden] {
		display: none;
	}

	.nav__panel ul {
		display: grid;
		gap: 0.15rem;
	}

	.nav__panel a {
		display: block;
		padding: 0.7rem 0.9rem;
		border-radius: 0.9rem;
		font-family: var(--font-display);
		font-size: 1.35rem;
		text-decoration: none;
	}

	.nav__panel a:hover {
		background: rgba(22, 37, 27, 0.08);
	}

	@media (max-width: 860px) {
		.nav__list {
			display: none;
		}

		.nav__toggle {
			display: inline-flex;
		}

		.nav__brand {
			opacity: 1;
			pointer-events: auto;
		}
	}
</style>
