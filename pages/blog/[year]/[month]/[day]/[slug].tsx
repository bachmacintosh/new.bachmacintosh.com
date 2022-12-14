import {
	BlockQuote,
	BlogPostTitle,
	Heading1,
	Heading2,
	Heading3,
	Heading4,
	Heading5,
	Heading6,
	OrderedList,
	Paragraph,
	UnorderedList,
} from "@/componentstext/typography";
import type { GetStaticPaths, GetStaticProps } from "next";
import { getBlogPost, getBlogPostPaths } from "@/lib/blog";
import { BlogBreadcrumbs } from "@/componentslayout/Breadcrumbs";
import type { BlogPostPageProps } from "@/types";
import Hyperlink from "@/components/text/Hyperlink";
import type { MDXComponents } from "mdx/types";
import { MDXRemote } from "next-mdx-remote";

export default function BlogPost({ post }: BlogPostPageProps): JSX.Element {
	const dateOptions: Intl.DateTimeFormatOptions = {
		dateStyle: "full",
		timeZone: "UTC",
	};
	const components: MDXComponents = {
		a: Hyperlink,
		blockquote: BlockQuote,
		h1: Heading1,
		h2: Heading2,
		h3: Heading3,
		h4: Heading4,
		h5: Heading5,
		h6: Heading6,
		ol: OrderedList,
		p: (props: JSX.IntrinsicElements["p"]) => {
			return (
				<Paragraph
					indent={1}
					{...props}
				/>
			);
		},
		ul: UnorderedList,
	};
	return (
		<>
			<BlogBreadcrumbs />
			<hr className="mb-3" />
			<BlogPostTitle>{post.content.frontmatter?.title}</BlogPostTitle>
			<br />
			<span className="text-sm md:text-base text-base-content">
				{`Posted ${new Date(post.content.frontmatter?.date as string).toLocaleDateString(
					"en-US",
					dateOptions,
				)} by Collin Bachman`}
			</span>
			<hr className="mb-3" />
			<MDXRemote
				{...post.content}
				components={components}
			/>
		</>
	);
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
	if (
		typeof params !== "undefined" &&
		typeof params.year === "string" &&
		typeof params.month === "string" &&
		typeof params.day === "string" &&
		typeof params.slug === "string"
	) {
		const post = await getBlogPost(params.year, params.month, params.day, params.slug);
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
