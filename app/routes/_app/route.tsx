import { Outlet, useLoaderData } from "@remix-run/react";
import { NuqsAdapter } from "nuqs/adapters/remix";
import GlobalLoader from "~/components/general/global-loader";
import { CookieConsentBanner } from "~/components/general/cookie-consent-banner";
import { Toaster } from "~/components/ui/sonner";
import GlobalErrorBoundary from "~/view/global-error-boundary";
import type { loader as loaderFn } from "./loader";

export { loader } from "./loader";
export default function App() {
	const user = useLoaderData<typeof loaderFn>();

	return (
		<NuqsAdapter>
			<GlobalLoader />
			<Outlet context={{ user }} />
			<Toaster />
			<CookieConsentBanner />
		</NuqsAdapter>
	);
}

export function ErrorBoundary() {
	return <GlobalErrorBoundary />;
}
