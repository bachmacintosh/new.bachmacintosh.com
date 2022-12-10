import type { MDXRemoteSerializeResult } from "next-mdx-remote/dist/types";

export interface BlogIndexProps {
	posts: BlogPost[];
}

export interface BlogPostPageProps {
	post: BlogPost;
}

export interface BlogPost {
	content: MDXRemoteSerializeResult;
	slug: string;
}

export interface BlogFrontMatter extends Record<string, string> {
	title: string;
	date: string;
	coverImage: string;
}

export interface BlogPostPath {
	params: {
		year: string;
		month: string;
		day: string;
		slug: string;
	};
}
