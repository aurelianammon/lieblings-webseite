<script>
	/** @type {{ name: string }} */
	let { name } = $props();
</script>

<svg class="icon" viewBox="0 0 32 32" aria-hidden="true">
	{#if name === 'logo'}
		<circle cx="16" cy="16" r="6.5" fill="currentColor" />
		{#each [0, 45, 90, 135, 180, 225, 270, 315] as a}
			<rect
				x="14.5"
				y="1.5"
				width="3"
				height="6.5"
				fill="currentColor"
				transform="rotate({a} 16 16)"
			/>
		{/each}
	{:else if name === 'hours'}
		<circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" stroke-width="3.25" />
		<path
			d="M16 7.5v9.5l6.5 3.5"
			fill="none"
			stroke="currentColor"
			stroke-width="3.25"
			stroke-linecap="square"
			stroke-linejoin="bevel"
		/>
	{:else if name === 'address'}
		<path
			d="M16 29C16 29 5 19.5 5 12.2a11 11 0 1 1 22 0C27 19.5 16 29 16 29z"
			fill="currentColor"
		/>
		<circle class="hole" cx="16" cy="12.2" r="4.2" />
	{:else if name === 'contact'}
		<rect x="2.5" y="6.5" width="27" height="19" fill="currentColor" />
		<path
			d="M2.5 9 16 19.5 29.5 9"
			fill="none"
			stroke="var(--dock-hole, var(--cream))"
			stroke-width="3.25"
			stroke-linejoin="bevel"
		/>
	{:else if name === 'events'}
		<rect x="2.5" y="5.5" width="27" height="23" fill="currentColor" />
		<path d="M2.5 12.5h27" stroke="var(--dock-hole, var(--cream))" stroke-width="2.75" />
		<rect x="8.5" y="2" width="4" height="8" fill="currentColor" />
		<rect x="19.5" y="2" width="4" height="8" fill="currentColor" />
		<rect class="hole" x="7.5" y="16.5" width="5.5" height="5.5" />
		<rect class="hole" x="13.25" y="16.5" width="5.5" height="5.5" />
		<rect class="hole" x="19" y="16.5" width="5.5" height="5.5" />
	{:else if name === 'verein'}
		<circle cx="11" cy="9.5" r="5" fill="currentColor" />
		<path d="M2 28c1.2-7 4.8-10.5 9-10.5S20.8 21 22 28" fill="currentColor" />
		<circle cx="22.5" cy="11" r="3.8" fill="currentColor" />
		<path d="M16 28c.8-4.8 3.2-7.2 6.5-7.2S28.2 23.2 29 28" fill="currentColor" />
	{:else if name === 'gallery'}
		<rect x="1.5" y="4.5" width="29" height="23" fill="currentColor" />
		<circle class="hole" cx="10" cy="12" r="3.4" />
		<path
			d="M1.5 24 11 14.5l5.5 4.5 4.5-4L30.5 25"
			fill="none"
			stroke="var(--dock-hole, var(--cream))"
			stroke-width="3.25"
			stroke-linejoin="bevel"
		/>
	{:else if name === 'newsletter'}
		<path d="M3 7.5h17l9 7.5V24.5H3z" fill="currentColor" />
		<path
			d="M20 7.5v7.5h9"
			fill="none"
			stroke="var(--dock-hole, var(--cream))"
			stroke-width="2.75"
		/>
		<path
			d="M8.5 14h9M8.5 18.5h7"
			fill="none"
			stroke="var(--dock-hole, var(--cream))"
			stroke-width="2.75"
			stroke-linecap="square"
		/>
	{/if}
</svg>

<style>
	.icon {
		width: 1.5rem;
		height: 1.5rem;
		display: block;
		overflow: visible;
	}

	.hole {
		fill: var(--dock-hole, var(--cream));
	}
</style>
