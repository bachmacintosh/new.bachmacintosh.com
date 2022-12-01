import type { GetStaticProps } from "next";
import type { WaniKaniIndexPageData } from "@/types";
import { getWaniKaniIndexData } from "@/lib/jpn/wanikani";

export default function WaniKani({ user, groups }: WaniKaniIndexPageData): JSX.Element {
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

export const getStaticProps: GetStaticProps = async () => {
	const data = await getWaniKaniIndexData();
	const { user, groups } = data;
	return {
		props: {
			user,
			groups,
		},
	};
};
