import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, redirect } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
    // const session = await getSession(request.headers.get("Cookie"));
    // const user = session.get("user");
    // if (!user) {
    //     return redirect("/login");
    // }
    return null;
}

export default function App() {
    return (
        <Outlet />
    )
}
