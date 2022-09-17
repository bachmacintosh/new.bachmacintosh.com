export default function Footer(): JSX.Element {
	const startYear = 2022;
	const commitShaLength = 7;
	return (
		<div className="mt-5">
			<hr className="border-primary-content" />
			<span
				id="footer"
				className="text-xs text-primary-content"
			>
				Copyright &copy;
				{new Date().getFullYear() > startYear ? `2022-${new Date().getFullYear()}` : new Date().getFullYear()} Collin
				Bachman, a.k.a BachMacintosh
				<br />
				Version {process.env.version} Commit {process.env.commit?.slice(0, commitShaLength)}
			</span>
		</div>
	);
}
