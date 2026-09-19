<script>
	/**
	 * Draggable, closable desktop window — light Fabbrica-style chrome.
	 * @type {{
	 *   id: string,
	 *   title?: string,
	 *   ariaLabel?: string,
	 *   x: number,
	 *   y: number,
	 *   z: number,
	 *   width?: number,
	 *   height?: number,
	 *   flush?: boolean,
	 *   fitContent?: boolean,
	 *   fitWidth?: boolean,
	 *   maxHeightRatio?: number,
	 *   closable?: boolean,
	 *   compact?: boolean,
	 *   chromeActions?: import('svelte').Snippet,
	 *   onClose?: () => void,
	 *   onFocus?: () => void,
	 *   onMove?: (pos: { x: number, y: number }) => void,
	 *   onHeightChange?: (height: number) => void,
	 *   onWidthChange?: (width: number) => void,
	 *   children?: import('svelte').Snippet
	 * }}
	 */
	let {
		id,
		title = '',
		ariaLabel,
		x = 80,
		y = 80,
		z = 1,
		width = 360,
		height = 320,
		flush = false,
		fitContent = false,
		fitWidth = false,
		maxHeightRatio = 0.5,
		closable = true,
		compact = false,
		chromeActions,
		onClose,
		onFocus,
		onMove,
		onHeightChange,
		onWidthChange,
		children
	} = $props();

	let rootEl = $state(null);
	let bodyEl = $state(null);
	let chromeEl = $state(null);
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

	let capped = $state(false);

	$effect(() => {
		if ((!fitContent && !fitWidth) || !rootEl || !bodyEl || !chromeEl) return;

		const measure = () => {
			const style = getComputedStyle(bodyEl);
			const padY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
			const padX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
			const kids = /** @type {HTMLElement[]} */ ([...bodyEl.children]);

			if (fitContent) {
				let contentH = 0;
				if (kids.length) {
					const first = kids[0];
					const last = kids[kids.length - 1];
					const firstMargin = parseFloat(getComputedStyle(first).marginTop) || 0;
					const lastMargin = parseFloat(getComputedStyle(last).marginBottom) || 0;
					const top = first.getBoundingClientRect().top - firstMargin;
					const bottom = last.getBoundingClientRect().bottom + lastMargin;
					contentH = bottom - top;
				}
				if (contentH <= 0) contentH = bodyEl.scrollHeight - padY;

				const natural = Math.ceil(chromeEl.offsetHeight + contentH + padY) + 2;
				const cap = Math.round(window.innerHeight * maxHeightRatio);
				capped = natural > cap;
				const next = Math.max(120, Math.min(natural, cap));
				onHeightChange?.(next);
			}

			if (fitWidth) {
				// Intrinsic width only — ignore stretched offsetWidth (avoids full-desk feedback loop).
				let contentW = 0;
				for (const child of kids) {
					const prev = {
						width: child.style.width,
						minWidth: child.style.minWidth,
						maxWidth: child.style.maxWidth
					};
					child.style.width = 'max-content';
					child.style.minWidth = 'max-content';
					child.style.maxWidth = 'none';
					contentW = Math.max(contentW, Math.ceil(child.getBoundingClientRect().width));
					child.style.width = prev.width;
					child.style.minWidth = prev.minWidth;
					child.style.maxWidth = prev.maxWidth;
				}
				if (contentW <= 0) return;
				const borderX = rootEl.offsetWidth - rootEl.clientWidth;
				const nextW = Math.ceil(contentW + padX + borderX);
				const maxW = rootEl.parentElement
					? Math.max(120, rootEl.parentElement.clientWidth - 12)
					: nextW;
				onWidthChange?.(Math.min(Math.max(nextW, 56), maxW));
			}
		};

		measure();
		requestAnimationFrame(measure);
		const ro = new ResizeObserver(measure);
		ro.observe(bodyEl);
		for (const child of bodyEl.children) ro.observe(child);
		window.addEventListener('resize', measure);
		return () => {
			ro.disconnect();
			window.removeEventListener('resize', measure);
		};
	});
</script>

<div
	bind:this={rootEl}
	class="win"
	class:is-dragging={dragging}
	class:win--flush={flush}
	class:win--fit={fitContent}
	class:win--capped={fitContent && capped}
	class:win--compact={compact}
	style="left:{x}px; top:{y}px; z-index:{z}; width:min({width}px, calc(100% - 0.75rem)); height:{fitContent
		? `${height}px`
		: `min(${height}px, calc(100% - 0.75rem))`}; max-height:{fitContent ? `${maxHeightRatio * 100}vh` : 'none'};"
	data-window-id={id}
	onpointerdown={focus}
	role="dialog"
	aria-modal="false"
	aria-label={ariaLabel || title}
>
	<div
		bind:this={chromeEl}
		class="win__chrome"
		role="toolbar"
		aria-label="{title} verschieben"
		onpointerdown={onChromePointerDown}
		onpointermove={onChromePointerMove}
		onpointerup={onChromePointerUp}
		onpointercancel={onChromePointerUp}
	>
		<span class="win__title">{title}</span>
		{#if chromeActions}
			<div class="win__actions">
				{@render chromeActions()}
			</div>
		{:else if closable}
			<button class="win__close" type="button" aria-label="Fenster schliessen" onclick={close}>
				<svg viewBox="0 0 16 16" aria-hidden="true">
					<path d="M2.5 2.5 L13.5 13.5 M13.5 2.5 L2.5 13.5" />
				</svg>
			</button>
		{/if}
	</div>
	<div class="win__body" bind:this={bodyEl}>
		{@render children?.()}
	</div>
</div>

<style>
	.win {
		position: absolute;
		display: flex;
		flex-direction: column;
		min-width: min(240px, 100%);
		min-height: 140px;
		background: var(--cream);
		border: var(--stroke) solid var(--accent);
		overflow: hidden;
		box-shadow: 0 12px 40px rgba(22, 37, 27, 0.1), 0 2px 8px rgba(22, 37, 27, 0.06);
	}

	.win--compact {
		min-width: 0;
		min-height: 0;
	}

	.win--compact .win__body {
		padding: 0.55rem;
	}

	@media (max-width: 720px) {
		.win {
			min-width: 0;
		}

		.win__chrome {
			padding: 0.55rem 0.65rem 0.55rem 0.8rem;
			font-size: 1rem;
		}

		.win__close {
			width: 1.15em;
			height: 1.15em;
		}

		.win__body {
			padding: 0.85rem;
		}

		.win--flush .win__body {
			padding: 0;
		}
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
		min-width: 0;
		flex: 1 1 auto;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
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

	.win__actions {
		display: flex;
		align-items: center;
		gap: 0.15rem;
		flex-shrink: 0;
	}

	.win__actions :global(button) {
		display: grid;
		place-items: center;
		width: 1.1em;
		height: 1.1em;
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--cream);
		cursor: pointer;
		font-family: var(--font-display);
		font-size: 1.15em;
		line-height: 1;
	}

	.win__actions :global(button:hover:not(:disabled)) {
		opacity: 0.65;
	}

	.win__actions :global(button:disabled) {
		opacity: 0.35;
		cursor: default;
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

	.win--fit {
		min-height: 0;
	}

	.win--fit .win__body {
		flex: 0 1 auto;
		overflow: hidden;
	}

	.win--fit.win--capped .win__body {
		overflow: auto;
	}

	.win--flush .win__body {
		padding: 0;
		overflow: hidden;
	}
</style>
