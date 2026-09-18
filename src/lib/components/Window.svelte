<script>
	/**
	 * Draggable, closable desktop window — light Fabbrica-style chrome.
	 * @type {{
	 *   id: string,
	 *   title?: string,
	 *   x: number,
	 *   y: number,
	 *   z: number,
	 *   width?: number,
	 *   height?: number,
	 *   flush?: boolean,
	 *   onClose?: () => void,
	 *   onFocus?: () => void,
	 *   onMove?: (pos: { x: number, y: number }) => void,
	 *   children?: import('svelte').Snippet
	 * }}
	 */
	let {
		id,
		title = '',
		x = 80,
		y = 80,
		z = 1,
		width = 360,
		height = 320,
		flush = false,
		onClose,
		onFocus,
		onMove,
		children
	} = $props();

	let rootEl = $state(null);
	let dragging = $state(false);
	let dragOffsetX = 0;
	let dragOffsetY = 0;

	function focus() {
		onFocus?.();
	}

	function close() {
		onClose?.();
	}

	function onChromePointerDown(e) {
		if (e.button !== 0) return;
		if (e.target.closest('button')) return;
		focus();
		dragging = true;
		dragOffsetX = e.clientX - x;
		dragOffsetY = e.clientY - y;
		e.currentTarget.setPointerCapture(e.pointerId);
	}

	function onChromePointerMove(e) {
		if (!dragging) return;
		const desk = rootEl?.parentElement;
		if (!desk) return;

		const deskRect = desk.getBoundingClientRect();
		const winW = rootEl.offsetWidth;
		const winH = rootEl.offsetHeight;
		const nextX = Math.min(Math.max(0, e.clientX - dragOffsetX), Math.max(0, deskRect.width - winW));
		const nextY = Math.min(Math.max(0, e.clientY - dragOffsetY), Math.max(0, deskRect.height - winH));
		onMove?.({ x: nextX, y: nextY });
	}

	function onChromePointerUp(e) {
		if (!dragging) return;
		dragging = false;
		try {
			e.currentTarget.releasePointerCapture(e.pointerId);
		} catch {
			/* already released */
		}
	}
</script>

<div
	bind:this={rootEl}
	class="win"
	class:is-dragging={dragging}
	class:win--flush={flush}
	style="left:{x}px; top:{y}px; z-index:{z}; width:min({width}px, calc(100% - 1rem)); height:min({height}px, calc(100% - 1rem));"
	data-window-id={id}
	onpointerdown={focus}
	role="dialog"
	aria-modal="false"
	aria-label={title}
>
	<div
		class="win__chrome"
		role="toolbar"
		aria-label="{title} verschieben"
		onpointerdown={onChromePointerDown}
		onpointermove={onChromePointerMove}
		onpointerup={onChromePointerUp}
		onpointercancel={onChromePointerUp}
	>
		<span class="win__title">{title}</span>
		<button class="win__close" type="button" aria-label="Fenster schliessen" onclick={close}>
			<svg viewBox="0 0 16 16" aria-hidden="true">
				<path d="M2.5 2.5 L13.5 13.5 M13.5 2.5 L2.5 13.5" />
			</svg>
		</button>
	</div>
	<div class="win__body">
		{@render children?.()}
	</div>
</div>

<style>
	.win {
		position: absolute;
		display: flex;
		flex-direction: column;
		min-width: min(260px, 100%);
		min-height: 140px;
		background: var(--cream);
		border: var(--stroke) solid var(--accent);
		overflow: hidden;
		box-shadow: 0 12px 40px rgba(22, 37, 27, 0.1), 0 2px 8px rgba(22, 37, 27, 0.06);
	}

	.win.is-dragging {
		user-select: none;
		cursor: grabbing;
	}

	.win__chrome {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.4rem 0.55rem 0.4rem 0.75rem;
		background: var(--accent);
		color: var(--cream);
		cursor: grab;
		user-select: none;
		flex-shrink: 0;
		touch-action: none;
		font-size: 1.05rem;
	}

	.is-dragging .win__chrome {
		cursor: grabbing;
	}

	.win__title {
		font-family: var(--font-display);
		font-size: 1em;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		line-height: 1;
		pointer-events: none;
	}

	.win__close {
		display: grid;
		place-items: center;
		width: 1em;
		height: 1em;
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--cream);
		cursor: pointer;
		flex-shrink: 0;
	}

	.win__close svg {
		width: 100%;
		height: 100%;
		display: block;
		stroke: currentColor;
		stroke-width: 2.4;
		stroke-linecap: square;
		fill: none;
	}

	.win__close:hover {
		opacity: 0.65;
	}

	.win__body {
		flex: 1;
		min-height: 0;
		overflow: auto;
		padding: clamp(1rem, 2.2vw, 1.4rem);
		background: var(--cream);
		overscroll-behavior: contain;
		-webkit-overflow-scrolling: touch;
	}

	.win--flush .win__body {
		padding: 0;
		overflow: hidden;
	}
</style>
