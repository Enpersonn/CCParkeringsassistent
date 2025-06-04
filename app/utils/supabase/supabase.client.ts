import { createBrowserClient } from "@supabase/ssr";

declare global {
	interface Window {
		ENV: {
			SUPABASE_URL: string;
			SUPABASE_ANON_KEY: string;
		};
	}
}
export const supabase = createBrowserClient(
	window.ENV.SUPABASE_URL,
	window.ENV.SUPABASE_ANON_KEY,
);
