import type { MDXRemoteSerializeResult } from "next-mdx-remote/dist/types";

export interface BlogIndexProps {
	posts: BlogPostMetadata[];
}

export interface BlogPostPageProps {
	post: BlogPost;
}

export interface BlogFrontMatter {
	excerpt?: string;
	fields: {
		title: string;
	};
}

export interface BlogPostMetadata {
	frontMatter: BlogFrontMatter;
	slug: string;
}

export interface BlogPostPath {
	params: {
		slug: string;
	};
}

export interface BlogPost {
	mdx: MDXRemoteSerializeResult;
	frontMatter: BlogFrontMatter;
}
