import type { GetStaticPaths, GetStaticProps } from "next";
import { getBlogPost, getBlogPostPaths } from "@/lib/blog";
import type { BlogPostPageProps } from "@/types";

export default function BlogPost({ post }: BlogPostPageProps): JSX.Element {
	return (
		<>
			<h1>{post.frontMatter.fields.title}</h1>
		</>
	);
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
	if (typeof params !== "undefined" && typeof params.slug === "string") {
		const post = await getBlogPost(params.slug);
		return {
			props: {
				post,
			},
		};
	} else {
		return {
			notFound: true,
		};
	}
};

export const getStaticPaths: GetStaticPaths = async () => {
	const paths = await getBlogPostPaths();
	return {
		paths,
		fallback: false,
	};
};
