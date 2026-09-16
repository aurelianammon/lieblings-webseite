/// <reference types="@sveltejs/kit" />

export {};

declare global {
	interface Window {
		netlifyIdentity?: {
			on: (event: string, cb: (user?: unknown) => void) => void;
		};
	}
}
