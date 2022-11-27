import type { WaniKaniIndexPageData } from "@/types";
import { getWaniKaniIndexData } from "@/lib/jpn/wanikani";

export default async function Page(): Promise<JSX.Element> {
	const data: WaniKaniIndexPageData = await getWaniKaniIndexData();
	const { user, groups } = data;
	return (
		<>
			<h1>Hello, {user.username} </h1>
			{groups.map((group) => {
				return (
					<div key={group.name}>
						<h2>{group.name}</h2>
					</div>
				);
			})}
		</>
	);
}
