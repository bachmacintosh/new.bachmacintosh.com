import type { GetStaticPaths, GetStaticProps } from "next";
import { getBlogPost, getBlogPostPaths } from "@/lib/blog";
import type { BlogPostPageProps } from "@/types";
import Hyperlink from "@/components/text/Hyperlink";
import type { MDXComponents } from "mdx/types";
import { MDXRemote } from "next-mdx-remote";

export default function BlogPost({ post }: BlogPostPageProps): JSX.Element {
	const components: MDXComponents = {
		a: Hyperlink,
	};
	return (
		<>
			<h1>{post.content.frontmatter?.title}</h1>
			<MDXRemote
				{...post.content}
				components={components}
			/>
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
