import type { BlogIndexProps } from "@/types";
import type { GetStaticProps } from "next";
import { getAllBlogPosts } from "@/lib/blog";

export default function Blog({ posts }: BlogIndexProps): JSX.Element {
	return (
		<>
			<h1>Blog Posts</h1>
			<ul>
				{posts.map((post) => {
					return <li key={post.slug}>{post.frontMatter.fields.title}</li>;
				})}
			</ul>
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
