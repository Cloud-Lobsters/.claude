// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { DefaultSession } from "@auth/sveltekit";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: {
				id: string;
				email: string;
				name: string;
				isAdmin: boolean;
				isExternal: boolean;
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

// Extend Auth.js types to include custom fields in session
declare module "@auth/sveltekit" {
	interface Session {
		user: {
			id: string;
			email: string;
			name: string;
			isAdmin: boolean;
			isExternal: boolean;
		} & DefaultSession["user"];
	}
}

export {};
