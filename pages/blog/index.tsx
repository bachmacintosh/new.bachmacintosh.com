import type { BlogIndexProps } from "@/types";
import type { GetStaticProps } from "next";
import { getAllBlogPosts } from "@/lib/blog";

export default function Blog({ posts }: BlogIndexProps): JSX.Element {
	return (
		<>
			<h1>Blog Posts</h1>
			{posts.map((post) => {
				return (
					<ul key={post.slug}>
						<li>{post.content.frontmatter?.title}</li>
					</ul>
				);
			})}
		</>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const posts = await getAllBlogPosts();
	return {
		props: {
			posts,
		},
	};
};
