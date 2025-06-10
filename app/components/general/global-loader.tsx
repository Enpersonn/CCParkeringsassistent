import { useNavigation } from "@remix-run/react";
import { cn } from "~/lib/utils";

const GlobalLoader = () => {
	const navigation = useNavigation();
	return (
		<div
			className={cn(
				navigation.state !== "idle" ? "opacity-100" : "opacity-0",
				"fixed top-5 left-5  flex items-center justify-center text-2xl font-bold z-[9999] transition-opacity duration-300",
			)}
		>
			<span className="animate-bounce delay-100">.</span>
			<span className="animate-bounce delay-200">.</span>
			<span className="animate-bounce delay-300">.</span>
		</div>
	);
};

export default GlobalLoader;
