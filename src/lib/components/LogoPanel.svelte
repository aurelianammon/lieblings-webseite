<script>
	import { onMount } from 'svelte';

	let { site = {} } = $props();

	const title = site.title ? `${site.title} ${site.subtitle ?? ''}`.trim() : 'Lieblings Café Bar';

	let hostEl = $state(null);

	onMount(() => {
		if (!hostEl) return;

		let disposed = false;
		let frame = 0;
		/** @type {null | (() => void)} */
		let teardown = null;

		(async () => {
			const THREE = await import('three');
			const { STLLoader } = await import('three/addons/loaders/STLLoader.js');
			if (disposed || !hostEl) return;

			const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
			camera.position.set(0, 0, 2.55);
			camera.lookAt(0, 0, 0);

			const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
			renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
			renderer.setClearColor(0x000000, 0);
			hostEl.appendChild(renderer.domElement);

			scene.add(new THREE.AmbientLight(0xffffff, 0.85));
			const key = new THREE.DirectionalLight(0xffffff, 1.35);
			key.position.set(2.5, 3, 4);
			const fill = new THREE.DirectionalLight(0xffffff, 0.55);
			fill.position.set(-2.2, -0.5, 2.5);
			scene.add(key, fill);

			const blackTexture = createBlackTexture(THREE);
			const material = new THREE.MeshStandardMaterial({
				map: blackTexture,
				color: 0x6a6a6a,
				roughness: 0.5,
				metalness: 0.15
			});

			const pivot = new THREE.Group();
			scene.add(pivot);

			/** @type {import('three').Mesh | null} */
			let mesh = null;
			const fitPadding = 1.08;

			const fitCameraToObject = () => {
				if (!mesh) return;
				const box = new THREE.Box3().setFromObject(mesh);
				const size = new THREE.Vector3();
				box.getSize(size);
				// use face diagonal so corners stay in frame while spinning
				const span = Math.hypot(size.x, size.y) || 1;
				const fov = (camera.fov * Math.PI) / 180;
				const fitH = span / 2 / Math.tan(fov / 2);
				const fitW = fitH / camera.aspect;
				const distance = Math.max(fitH, fitW) * fitPadding;
				camera.position.set(0, 0, distance);
				camera.near = Math.max(0.01, distance / 100);
				camera.far = distance * 100;
				camera.lookAt(0, 0, 0);
				camera.updateProjectionMatrix();
			};

			const resize = () => {
				if (!hostEl) return;
				const w = hostEl.clientWidth;
				const h = hostEl.clientHeight;
				if (w < 2 || h < 2) return;
				camera.aspect = w / h;
				camera.updateProjectionMatrix();
				renderer.setSize(w, h, false);
				fitCameraToObject();
			};

			const ro = new ResizeObserver(resize);
			ro.observe(hostEl);
			resize();

			/** @type {import('three').BufferGeometry | null} */
			let geometry = null;

			const canvas = renderer.domElement;
			canvas.style.touchAction = 'none';
			canvas.style.cursor = 'grab';

			let pointerActive = false;
			let targetTiltX = 0;
			let targetTiltY = 0;
			let tiltX = 0;
			let tiltY = 0;
			let tiltZ = 0;
			let velX = 0;
			let velY = 0;
			let velZ = 0;
			let idle = 0;

			const onPointerMove = (e) => {
				const rect = canvas.getBoundingClientRect();
				if (rect.width < 1 || rect.height < 1) return;
				const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
				const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
				pointerActive = true;
				targetTiltY = nx * 0.85;
				targetTiltX = ny * 0.55;
			};

			const onPointerLeave = () => {
				pointerActive = false;
				targetTiltX = 0;
				targetTiltY = 0;
			};

			canvas.addEventListener('pointermove', onPointerMove);
			canvas.addEventListener('pointerleave', onPointerLeave);

			teardown = () => {
				ro.disconnect();
				canvas.removeEventListener('pointermove', onPointerMove);
				canvas.removeEventListener('pointerleave', onPointerLeave);
				cancelAnimationFrame(frame);
				geometry?.dispose();
				material.dispose();
				blackTexture.dispose();
				renderer.dispose();
				renderer.domElement.remove();
			};

			if (disposed) {
				teardown();
				return;
			}

			new STLLoader().load(
				'/logo.stl',
				(geo) => {
					if (disposed) {
						geo.dispose();
						return;
					}

					geometry = geo;
					geometry.computeVertexNormals();
					geometry.center();

					mesh = new THREE.Mesh(geometry, material);
					pivot.add(mesh);
					fitCameraToObject();

					const tick = () => {
						if (disposed) return;
						frame = requestAnimationFrame(tick);

						idle += 0.016;

						// Soft idle only once mostly home — not while returning from the cursor.
						const away = Math.hypot(tiltX, tiltY, tiltZ);
						const settled = pointerActive ? 0 : Math.max(0, 1 - away / 0.35) ** 2;
						const idleX = Math.sin(idle * 0.28) * 0.1 * settled;
						const idleY = Math.sin(idle * 0.19) * 0.08 * settled + idle * 0.0012 * settled;
						const idleZ = Math.sin(idle * 0.15) * 0.06 * settled;

						const wantX = targetTiltX + idleX;
						const wantY = targetTiltY + idleY;
						const wantZ = idleZ;

						// Snappier follow while hovering; soft spring home on leave.
						const stiff = pointerActive ? 0.16 : 0.035;
						const damp = pointerActive ? 0.78 : 0.9;
						velX = velX * damp + (wantX - tiltX) * stiff;
						velY = velY * damp + (wantY - tiltY) * stiff;
						velZ = velZ * damp + (wantZ - tiltZ) * stiff;
						tiltX += velX;
						tiltY += velY;
						tiltZ += velZ;

						pivot.rotation.x = tiltX;
						pivot.rotation.y = tiltY;
						pivot.rotation.z = tiltZ;
						renderer.render(scene, camera);
					};
					tick();
				},
				undefined,
				(err) => console.error('Failed to load /logo.stl', err)
			);
		})();

		return () => {
			disposed = true;
			teardown?.();
		};
	});

	/** @param {typeof import('three')} THREE */
	function createBlackTexture(THREE) {
		const size = 256;
		const canvas = document.createElement('canvas');
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = '#555555';
		ctx.fillRect(0, 0, size, size);

		const image = ctx.getImageData(0, 0, size, size);
		for (let i = 0; i < image.data.length; i += 4) {
			const n = 70 + ((Math.random() * 70) | 0);
			image.data[i] = n;
			image.data[i + 1] = n;
			image.data[i + 2] = n;
			image.data[i + 3] = 255;
		}
		ctx.putImageData(image, 0, 0);

		const texture = new THREE.CanvasTexture(canvas);
		texture.colorSpace = THREE.SRGBColorSpace;
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(2.5, 2.5);
		return texture;
	}
</script>

<div class="logo-panel" bind:this={hostEl} role="img" aria-label={title}></div>

<style>
	.logo-panel {
		position: relative;
		width: 100%;
		aspect-ratio: 1;
		height: auto;
		min-height: 0;
		overflow: hidden;
		background: var(--cream);
	}

	.logo-panel :global(canvas) {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
