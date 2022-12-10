import { ChevronRightIcon } from "@heroicons/react/20/solid";

export function BlogBreadcrumbs(): JSX.Element {
	const blogPages = [{ name: "Blog", href: "#" }];
	return <Breadcrumbs pages={blogPages} />;
}

function Breadcrumbs({ pages }: { pages: { name: string; href: string }[] }): JSX.Element {
	return (
		<nav
			className="flex"
			aria-label="Breadcrumb"
		>
			<ol
				role="list"
				className="flex items-center space-x-4"
			>
				<li>
					<div>
						<a
							href="#"
							className="text-primary-content hover:text-white hover:underline"
						>
							Home
						</a>
					</div>
				</li>
				{pages.map((page) => {
					const linkClass = "ml-4 text-sm font-medium text-primary-content hover:text-white hover:underline";
					return (
						<li key={page.name}>
							<div className="flex items-center">
								<ChevronRightIcon
									className="h-5 w-5 flex-shrink-0 text-content-primary"
									aria-hidden="true"
								/>
								<a
									href={page.href}
									className={linkClass}
								>
									{page.name}
								</a>
							</div>
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
