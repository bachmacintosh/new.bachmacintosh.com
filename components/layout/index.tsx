import { Bars3Icon } from "@heroicons/react/24/solid";
import Footer from "./Footer";
import Navigation from "./Navigation";
export default function Layout({ children }: { children: React.ReactNode }): JSX.Element {
	return (
		<>
			<div className="drawer drawer-mobile">
				<input
					id="my-drawer-2"
					type="checkbox"
					className="drawer-toggle"
				/>
				<div className="drawer-content flex flex-col">
					<label
						htmlFor="my-drawer-2"
						className="btn btn-primary drawer-button lg:hidden text-2xl uppercase font-extrabold"
					>
						<Bars3Icon className="w-12 h-6 mt-1" />
						BachMacintosh
					</label>
					<div className="max-w-7xl mx-3 mt-5">
						{children}
						<Footer />
					</div>
				</div>
				<Navigation />
			</div>
		</>
	);
}
