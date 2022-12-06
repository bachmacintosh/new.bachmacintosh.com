import type { BlogFrontMatter, BlogPost, BlogPostPath } from "@/types";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import fs from "fs";
import path from "path";
import remarkGfm from "remark-gfm";
import { serialize } from "next-mdx-remote/serialize";

const POSTS_PATH = path.join(process.cwd(), "blog");

export async function getBlogPost(slug: string): Promise<BlogPost> {
	const postFilePath = path.join(POSTS_PATH, `${slug}.mdx`);
	const source = await fs.promises.readFile(postFilePath);
	const content: MDXRemoteSerializeResult<Record<string, unknown>, BlogFrontMatter> = await serialize(source, {
		mdxOptions: {
			remarkPlugins: [remarkGfm],
			rehypePlugins: [],
		},
		parseFrontmatter: true,
	});
	return {
		content,
		slug,
	};
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
	const initialPaths = await fs.promises.readdir(POSTS_PATH);
	const postFilePaths = initialPaths.filter((file) => {
		return /\.mdx?$/u.test(file);
	});
	const posts = await Promise.all(
		postFilePaths.map(async (filePath) => {
			const source = await fs.promises.readFile(path.join(POSTS_PATH, filePath));
			const content: MDXRemoteSerializeResult<Record<string, unknown>, BlogFrontMatter> = await serialize(source, {
				mdxOptions: {
					remarkPlugins: [remarkGfm],
					rehypePlugins: [],
				},
				parseFrontmatter: true,
			});
			const slug = filePath.replace(/\.mdx?$/u, "");

			const post: BlogPost = {
				content,
				slug,
			};
			return post;
		}),
	);
	posts.sort((postA, postB) => {
		if (typeof postA.content.frontmatter === "undefined" || typeof postB.content.frontmatter === "undefined") {
			throw new Error("Missing date field in Front Matter!");
		}
		return new Date(postB.content.frontmatter.date).getTime() - new Date(postA.content.frontmatter.date).getTime();
	});
	return posts;
}

export async function getBlogPostPaths(): Promise<BlogPostPath[]> {
	const initialPaths = await fs.promises.readdir(POSTS_PATH);
	const postFilePaths = initialPaths.filter((file) => {
		return /\.mdx?$/u.test(file);
	});
	const paths = postFilePaths
		.map((filePath) => {
			return filePath.replace(/\.mdx?$/u, "");
		})
		.map((slug) => {
			return {
				params: {
					slug,
				},
			};
		});
	return paths;
}
