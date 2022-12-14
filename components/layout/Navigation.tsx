export default function Navigation(): JSX.Element {
	return (
		<div className="drawer-side">
			<label
				htmlFor="my-drawer-2"
				className="drawer-overlay"
			></label>
			<ul className="menu p-4 overflow-y-auto w-64 bg-primary text-primary-content">
				<li className="uppercase text-2xl text-center font-extrabold mb-5">BachMacintosh</li>
				<li>
					<a>Home</a>
				</li>
				<li>
					<a>Blog</a>
				</li>
				<li>
					<a>Videos</a>
				</li>
				<li>
					<a>Music</a>
				</li>
				<li>
					<a>Gaming</a>
				</li>
				<li>
					<a>Japanese</a>
				</li>
				<li>
					<a>Misc</a>
				</li>
			</ul>
		</div>
	);
}
