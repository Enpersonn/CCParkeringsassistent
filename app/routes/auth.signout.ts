import type { LoaderFunctionArgs } from "@remix-run/node";
import { signOut } from "~/utils/supabase/auth_service/signout";

export async function loader({ request }: LoaderFunctionArgs) {
	return signOut(request);
}
