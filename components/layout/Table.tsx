export function Table(props: JSX.IntrinsicElements["tbody"] & { headers: string[] }): JSX.Element {
	return (
		<div className="flex flex-col">
			<div className="-mt-2 mb-5 overflow-x-auto sm:-mx-6 lg:-mx-8">
				<div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
					<div className="shadow overflow-hidden border-b border-blue-diamond">
						<table
							className="table-auto min-w-full divide-y divide-blue-diamond
              border-b border-blue-diamond"
						>
							<TableHeader>
								<tr>
									{props.headers.map((header, index) => {
										return <TableHeaderColumn key={`${header}-${index}`}>{header}</TableHeaderColumn>;
									})}
								</tr>
							</TableHeader>
							<tbody {...props} />
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

export function TableRow(props: JSX.IntrinsicElements["tr"] & { index?: number }): JSX.Element {
	const TWO = 2;
	return (
		<tr
			className={typeof props.index !== "undefined" && props.index % TWO === 0 ? "bg-primary" : "bg-base"}
			{...props}
		/>
	);
}

export function TableColumn(props: JSX.IntrinsicElements["td"]): JSX.Element {
	return (
		<td
			className="
      px-6 py-2 align-top text-sm text-blue-diamond break-words border-b
      border-blue-diamond"
			{...props}
		/>
	);
}

function TableHeader(props: JSX.IntrinsicElements["thead"]): JSX.Element {
	return (
		<thead
			className="bg-blue-ultra"
			{...props}
		/>
	);
}

function TableHeaderColumn(props: JSX.IntrinsicElements["th"]): JSX.Element {
	return (
		<th
			scope="col"
			className="px-6 py-3 text-left text-xs md:text-base font-medium text-white
      uppercase tracking-wider"
			{...props}
		/>
	);
}
