import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

/** Serve the Decap admin HTML for /admin in Vite (SvelteKit would otherwise 404). */
function serveAdmin() {
	const file = path.resolve('static/admin/index.html');
	const send = (res) => {
		res.setHeader('Content-Type', 'text/html; charset=utf-8');
		res.end(fs.readFileSync(file));
	};
	const match = (url) => {
		const pathname = url?.split('?')[0];
		return pathname === '/admin' || pathname === '/admin/';
	};

	return {
		name: 'serve-admin',
		configureServer(server) {
			server.middlewares.use((req, res, next) => {
				if (match(req.url)) return send(res);
				next();
			});
		},
		configurePreviewServer(server) {
			server.middlewares.use((req, res, next) => {
				if (match(req.url)) return send(res);
				next();
			});
		}
	};
}

export default defineConfig({
	plugins: [serveAdmin(), sveltekit()],
	server: {
		watch: {
			// pick up edits the CMS writes into content/
			ignored: ['!**/content/**']
		}
	}
});
