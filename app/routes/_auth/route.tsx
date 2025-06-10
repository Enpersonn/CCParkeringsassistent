import { Outlet } from "@remix-run/react";
import GlobalErrorBoundary from "~/view/global-error-boundary";

export { loader } from "./loader";

export default function Auth() {
	return <Outlet />;
}

export function ErrorBoundary() {
	return <GlobalErrorBoundary />;
}
